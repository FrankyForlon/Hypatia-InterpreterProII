import { getStore } from "@netlify/blobs";

const ROOM_TTL_MS = 12 * 60 * 60 * 1000;
const MAX_SEGS = 500;
const MAX_EVENTS = 1000;
const MAX_TEXT_LENGTH = 4000;
const DEFAULT_ALLOWED_ORIGINS = [
  "https://hypatia-interpreterpro.netlify.app",
  "http://localhost:8888",
  "http://127.0.0.1:8888",
];

const baseJsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "vary": "origin",
};

export default async function rooms(req, context) {
  const origin = req.headers.get("origin") || "";
  if (!isAllowedOrigin(origin)) {
    return json({ error: "ORIGIN_NOT_ALLOWED" }, 403, origin);
  }

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }

  const url = new URL(req.url);
  const roomFromPath = extractRoomCode(url.pathname);

  try {
    if (req.method === "POST" && !roomFromPath) {
      const body = await readJson(req);
      if (body.type !== "create") return json({ error: "UNKNOWN_TYPE" }, 400, origin);
      return json(await createRoom(body), 200, origin);
    }

    if (!roomFromPath) return json({ error: "ROOM_REQUIRED" }, 400, origin);

    if (req.method === "GET") {
      const since = Number(url.searchParams.get("since") || 0);
      return json(await pollRoom(roomFromPath, since), 200, origin);
    }

    if (req.method === "POST") {
      const body = await readJson(req);
      if (body.type === "join") return json(await joinRoom(roomFromPath), 200, origin);
      if (body.type === "poll") return json(await pollRoom(roomFromPath, Number(body.since || 0)), 200, origin);
      if (body.type === "add") return json(await addSegment(roomFromPath, body.seg), 200, origin);
      if (body.type === "clear") return json(await clearRoom(roomFromPath), 200, origin);
      return json({ error: "UNKNOWN_TYPE" }, 400, origin);
    }

    return json({ error: "METHOD_NOT_ALLOWED" }, 405, origin);
  } catch (error) {
    const status = error.status || 500;
    return json({
      error: error.code || "ROOM_REQUEST_FAILED",
      message: String(error.message || "Room request failed.").slice(0, 160),
    }, status, origin);
  }
}

export const config = {
  path: ["/api/rooms", "/api/rooms/:room"],
  method: ["GET", "POST", "OPTIONS"],
};

async function readJson(req) {
  try {
    return await req.json();
  } catch {
    throw statusError("BAD_JSON", "Request body must be valid JSON.", 400);
  }
}

async function createRoom(body) {
  const store = roomStore();
  const initialSegs = Array.isArray(body.segs)
    ? body.segs.slice(0, MAX_SEGS).map(sanitizeSeg).filter(Boolean)
    : [];

  for (let tries = 0; tries < 8; tries++) {
    const room = generateRoomCode();
    const key = roomKey(room);
    const existing = await store.get(key, { type: "json" });
    if (existing) continue;

    const now = Date.now();
    const events = initialSegs.map((seg, idx) => ({
      seq: idx + 1,
      type: "add",
      seg,
      at: now,
    }));
    const state = {
      room,
      createdAt: now,
      updatedAt: now,
      expiresAt: now + ROOM_TTL_MS,
      seq: events.length,
      segs: initialSegs,
      events,
    };
    await store.setJSON(key, state, { metadata: { updatedAt: new Date(now).toISOString() } });
    return roomPayload(state, "host", []);
  }

  throw statusError("ROOM_CREATE_FAILED", "Could not create a unique room code.", 503);
}

async function joinRoom(room) {
  const state = await requireRoom(room);
  return roomPayload(state, "guest", []);
}

async function pollRoom(room, since) {
  const state = await requireRoom(room);
  const safeSince = Number.isFinite(since) ? since : 0;
  const events = state.events.filter(event => Number(event.seq) > safeSince);
  return roomPayload(state, "guest", events);
}

async function addSegment(room, seg) {
  const state = await requireRoom(room);
  const cleanSeg = sanitizeSeg(seg);
  if (!cleanSeg) throw statusError("BAD_SEGMENT", "Segment is missing required fields.", 400);

  if (!state.segs.some(item => String(item.id) === String(cleanSeg.id))) {
    state.segs.push(cleanSeg);
    if (state.segs.length > MAX_SEGS) state.segs = state.segs.slice(-MAX_SEGS);
    pushEvent(state, { type: "add", seg: cleanSeg });
    await saveRoom(state);
  }

  return roomPayload(state, "member", []);
}

async function clearRoom(room) {
  const state = await requireRoom(room);
  state.segs = [];
  pushEvent(state, { type: "clear" });
  await saveRoom(state);
  return roomPayload(state, "member", []);
}

function pushEvent(state, event) {
  const now = Date.now();
  state.seq = Number(state.seq || 0) + 1;
  state.updatedAt = now;
  state.expiresAt = now + ROOM_TTL_MS;
  state.events.push({
    ...event,
    seq: state.seq,
    at: now,
  });
  if (state.events.length > MAX_EVENTS) state.events = state.events.slice(-MAX_EVENTS);
}

async function requireRoom(room) {
  const cleanRoom = cleanRoomCode(room);
  if (!cleanRoom) throw statusError("BAD_ROOM", "Room code must be six letters or numbers.", 400);

  const state = await roomStore().get(roomKey(cleanRoom), { type: "json" });
  if (!state || Number(state.expiresAt || 0) < Date.now()) {
    throw statusError("ROOM_NOT_FOUND", "Room not found. Check the code and try again.", 404);
  }

  state.room = cleanRoom;
  state.segs = Array.isArray(state.segs) ? state.segs : [];
  state.events = Array.isArray(state.events) ? state.events : [];
  state.seq = Number(state.seq || 0);
  return state;
}

async function saveRoom(state) {
  await roomStore().setJSON(roomKey(state.room), state, {
    metadata: { updatedAt: new Date(state.updatedAt).toISOString() },
  });
}

function roomPayload(state, role, events) {
  return {
    type: "joined",
    room: state.room,
    role,
    seq: Number(state.seq || 0),
    segs: Array.isArray(state.segs) ? state.segs : [],
    events: Array.isArray(events) ? events : [],
    expiresAt: state.expiresAt,
  };
}

function sanitizeSeg(seg) {
  if (!seg || !seg.id) return null;
  const lang = seg.lang === "ru" ? "ru" : "en";
  return {
    id: cleanShort(seg.id, 120),
    speakerId: cleanShort(seg.speakerId, 120),
    speaker: cleanShort(seg.speaker || "Speaker", 80),
    lang,
    original: cleanLong(seg.original),
    cleanOriginal: cleanLong(seg.cleanOriginal || seg.original),
    translated: cleanLong(seg.translated),
    pending: false,
    time: cleanShort(seg.time, 40),
  };
}

function cleanShort(value, maxLength) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function cleanLong(value) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, MAX_TEXT_LENGTH);
}

function roomStore() {
  if (globalThis.__HYPATIA_ROOM_STORE__) return globalThis.__HYPATIA_ROOM_STORE__;
  return getStore({ name: "hypatia-rooms", consistency: "strong" });
}

function roomKey(room) {
  return `rooms/${room}`;
}

function extractRoomCode(pathname) {
  const match = pathname.match(/\/api\/rooms\/([^/?#]+)/);
  return match ? cleanRoomCode(match[1]) : "";
}

function cleanRoomCode(value) {
  const code = String(value || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
  return /^[A-Z0-9]{6}$/.test(code) ? code : "";
}

function generateRoomCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

function json(payload, status = 200, origin = "") {
  return new Response(JSON.stringify(payload), {
    status,
    headers: corsHeaders(origin),
  });
}

function corsHeaders(origin) {
  const headers = {
    ...baseJsonHeaders,
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "content-type",
  };
  if (isAllowedOrigin(origin)) {
    headers["access-control-allow-origin"] = origin;
  }
  return headers;
}

function isAllowedOrigin(origin) {
  if (!origin) return false;
  let normalized;
  try {
    normalized = new URL(origin).origin;
  } catch {
    return false;
  }

  return allowedOrigins().has(normalized);
}

function allowedOrigins() {
  const configured = (globalThis.Netlify?.env?.get?.("ALLOWED_ORIGINS") || "")
    .split(",")
    .map(origin => origin.trim())
    .filter(Boolean);

  return new Set([...DEFAULT_ALLOWED_ORIGINS, ...configured]);
}

function statusError(code, message, status) {
  const error = new Error(message);
  error.code = code;
  error.status = status;
  return error;
}
