// server.js
import { WebSocketServer } from 'ws';

// server.js の修正例
const wss = new WebSocketServer({ port: 8080, host: '0.0.0.0' });
const clients = new Map();

wss.on('connection', (ws) => {
  const id = Date.now() + Math.random();
  clients.set(id, ws);

  ws.on('message', (msg) => {
    // 受け取ったデータを他のクライアントに送信
    for (const [otherId, client] of clients.entries()) {
      if (otherId !== id && client.readyState === 1) {
        client.send(msg);
      }
    }
  });

  ws.on('close', () => {
    clients.delete(id);
  });
});

console.log("WebSocket server running on ws://localhost:8080");
