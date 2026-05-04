# Constance Collaboration Server

Real-time WebSocket server for multi-interpreter collaboration. Multiple interpreters can join the same room, see each other's transcripts, and correct mistakes in real time.

## How it works

1. **Host** taps "Create Room" → gets a 6-digit room code
2. **Host** shares the room code with colleagues
3. **Guests** tap "Join Room" → enter the code → see the same transcript
4. Everyone in the room sees:
   - New segments as they're spoken/typed (live)
   - Edits when someone fixes a segment
   - Deletes when someone removes a segment
   - Clear when someone clears the board
5. When a new guest joins mid-session, they get the full current transcript automatically

## Quick Start (for tomorrow's session)

### Option A: Run locally + ngrok (fastest, 5 minutes)

**Step 1: Install and run the server**
```bash
cd collab-server
npm install
npm start
```
The server runs on `ws://localhost:8080`

**Step 2: Get a public URL with ngrok**
```bash
# Install ngrok if you don't have it
npm install -g ngrok

# Expose your local server
ngrok http 8080
```
You'll see something like:
```
Forwarding  https://abc123-def.ngrok-free.app -> http://localhost:8080
```

**Step 3: Update the app**
Open `interpreter-pro.html`, find this line near the top:
```javascript
const COLLAB_SERVER="";
```
Replace with your ngrok URL (use `wss://` not `https://`):
```javascript
const COLLAB_SERVER="wss://abc123-def.ngrok-free.app";
```

**Step 4: Share**
- Share the app URL with colleagues
- After they open it, you create a room, they join with the code
- All transcripts sync in real time

### Option B: Deploy to Render.com (free tier)

1. Go to https://render.com and sign up
2. Click "New" → "Web Service"
3. Connect your GitHub repo or upload the `collab-server/` folder
4. Set:
   - **Build command:** `npm install`
   - **Start command:** `npm start`
   - **Environment:** Node
5. Render gives you a URL like `https://constance-collab.onrender.com`
6. Update `COLLAB_SERVER` in the app to `wss://constance-collab.onrender.com`

Free tier: sleeps after 15 min inactivity, wakes on first request (takes ~30 seconds).

### Option C: Deploy to Railway (free tier)

1. Go to https://railway.app and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repo with the `collab-server` folder
4. Railway auto-detects Node.js and deploys
5. Copy the generated URL
6. Update `COLLAB_SERVER` in the app

Free tier: 500 hours/month, no sleep penalty.

## API Protocol

The WebSocket protocol is simple JSON messages:

| Client sends | Server responds | Broadcast to room |
|---|---|---|
| `{type:"create"}` | `{type:"joined",room:"ABC123",role:"host"}` | — |
| `{type:"join",room:"ABC123"}` | `{type:"joined",room:"ABC123",role:"guest"}` + `{type:"state",segs:[...]}` | — |
| `{type:"add",seg:{id,text,trans,lang,time}}` | — | `{type:"add",seg}` |
| `{type:"edit",id,text,trans}` | — | `{type:"edit",id,text,trans}` |
| `{type:"delete",id}` | — | `{type:"delete",id}` |
| `{type:"clear"}` | — | `{type:"clear"}` |
| `{type:"ping"}` | `{type:"pong"}` | — |

## Data persistence

- Rooms are stored in memory while active
- Auto-saved to `rooms.json` every 30 seconds
- Loaded on server restart
- Empty rooms are cleaned up after 1 hour

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `8080` | HTTP/WebSocket server port |

## Files

```
collab-server/
├── server.js         # Main server (WebSocket + HTTP)
├── package.json      # Dependencies (ws, express)
└── rooms.json        # Auto-generated room persistence
```

## Free hosting limits

| Service | Concurrent | Messages/day | Sleep? |
|---|---|---|---|
| Local + ngrok | Unlimited | Unlimited | When you close laptop |
| Render.com | Unlimited | Unlimited | After 15 min idle |
| Railway | Unlimited | Unlimited | 500 hrs/month |
| Fly.io | Unlimited | 160GB/month | No sleep |

## Troubleshooting

**"Connection failed" in the app**
- Check `COLLAB_SERVER` uses `wss://` (secure) not `ws://` for public URLs
- If using ngrok, the URL changes every time you restart ngrok — update the config
- Make sure the server is running before opening the app

**Guests don't see updates**
- Check they're entering the exact room code (uppercase, no spaces)
- Check browser console for WebSocket errors
- Try refreshing the page

**Server crashes**
- Check `rooms.json` isn't corrupted — delete it and restart if needed
- Check port 8080 isn't already in use

## Security note

This is a lightweight collaboration tool for trusted team members. There is no authentication — anyone with the room code can join. For sensitive medical data, consider:
- Using the app in Solo Mode (no server, no sharing)
- Running the server on a private network
- Adding a password feature (we can build this if needed)
