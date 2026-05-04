const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;
const DATA_FILE = path.join(__dirname, 'rooms.json');

// In-memory rooms: { roomCode: { segs: [], clients: Set<ws>, createdAt } }
const rooms = new Map();

// Load persisted rooms on startup
function loadRooms() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      for (const [code, roomData] of Object.entries(data)) {
        rooms.set(code, {
          segs: roomData.segs || [],
          clients: new Set(),
          createdAt: roomData.createdAt || Date.now()
        });
      }
      console.log(`Loaded ${rooms.size} rooms from disk`);
    }
  } catch (e) {
    console.error('Failed to load rooms:', e.message);
  }
}

// Persist rooms to disk
function saveRooms() {
  const data = {};
  for (const [code, room] of rooms) {
    data[code] = {
      segs: room.segs,
      createdAt: room.createdAt
    };
  }
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Failed to save rooms:', e.message);
  }
}

// Auto-save every 30 seconds
setInterval(saveRooms, 30000);

// Generate a random 6-digit room code
function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Broadcast a message to all clients in a room except the sender
function broadcast(roomCode, message, excludeWs = null) {
  const room = rooms.get(roomCode);
  if (!room) return;
  const payload = JSON.stringify(message);
  for (const client of room.clients) {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }
}

// Send current state to a single client
function sendState(ws, roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return;
  ws.send(JSON.stringify({
    type: 'state',
    segs: room.segs,
    room: roomCode
  }));
}

// HTTP server for health checks and static file serving
const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      rooms: rooms.size,
      uptime: process.uptime()
    }));
    return;
  }
  res.writeHead(404);
  res.end('Not found');
});

// WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  let roomCode = null;

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw);

      switch (msg.type) {
        case 'create': {
          roomCode = generateCode();
          rooms.set(roomCode, {
            segs: [],
            clients: new Set([ws]),
            createdAt: Date.now()
          });
          ws.send(JSON.stringify({
            type: 'joined',
            room: roomCode,
            role: 'host'
          }));
          console.log(`Room ${roomCode} created`);
          break;
        }

        case 'join': {
          const code = msg.room?.toUpperCase().trim();
          if (!code || !rooms.has(code)) {
            ws.send(JSON.stringify({
              type: 'error',
              message: 'Room not found. Check the code and try again.'
            }));
            return;
          }
          roomCode = code;
          rooms.get(code).clients.add(ws);
          ws.send(JSON.stringify({
            type: 'joined',
            room: code,
            role: 'guest'
          }));
          sendState(ws, code);
          console.log(`Client joined room ${code} (${rooms.get(code).clients.size} total)`);
          break;
        }

        case 'add': {
          if (!roomCode) return;
          const seg = msg.seg;
          if (!seg || !seg.id) return;
          const room = rooms.get(roomCode);
          room.segs.push(seg);
          broadcast(roomCode, { type: 'add', seg }, ws);
          break;
        }

        case 'edit': {
          if (!roomCode) return;
          const { id, text, trans } = msg;
          const room = rooms.get(roomCode);
          const idx = room.segs.findIndex(s => s.id === id);
          if (idx >= 0) {
            room.segs[idx] = { ...room.segs[idx], text, trans };
            broadcast(roomCode, { type: 'edit', id, text, trans }, ws);
          }
          break;
        }

        case 'delete': {
          if (!roomCode) return;
          const { id } = msg;
          const room = rooms.get(roomCode);
          room.segs = room.segs.filter(s => s.id !== id);
          broadcast(roomCode, { type: 'delete', id }, ws);
          break;
        }

        case 'clear': {
          if (!roomCode) return;
          const room = rooms.get(roomCode);
          room.segs = [];
          broadcast(roomCode, { type: 'clear' }, ws);
          break;
        }

        case 'ping': {
          ws.send(JSON.stringify({ type: 'pong' }));
          break;
        }
      }
    } catch (e) {
      console.error('Message error:', e.message);
    }
  });

  ws.on('close', () => {
    if (roomCode && rooms.has(roomCode)) {
      const room = rooms.get(roomCode);
      room.clients.delete(ws);
      // Clean up empty rooms after 1 hour
      if (room.clients.size === 0) {
        setTimeout(() => {
          const r = rooms.get(roomCode);
          if (r && r.clients.size === 0) {
            rooms.delete(roomCode);
            console.log(`Room ${roomCode} cleaned up`);
          }
        }, 3600000);
      }
    }
  });
});

loadRooms();
server.listen(PORT, () => {
  console.log(`Constance Collab Server running on port ${PORT}`);
  console.log(`WebSocket: ws://localhost:${PORT}`);
});
