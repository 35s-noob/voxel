// FPSマルチプレイ用 WebSocket サーバー（Cloudflare Workers版）

let clients = new Set();

export default {
  async fetch(request, env) {
    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response("Expected WebSocket", { status: 400 });
    }

    // WebSocket ペアを生成
    const [client, server] = Object.values(new WebSocketPair());
    server.accept();

    // 新しいクライアントを追加
    clients.add(server);

    // 受信イベント
    server.addEventListener("message", (event) => {
      let msg;

      try {
        msg = JSON.parse(event.data);
      } catch (e) {
        msg = { type: "chat", text: event.data };
      }

      // 全クライアントにブロードキャスト
      for (const c of clients) {
        if (c !== server) {
          try {
            c.send(JSON.stringify(msg));
          } catch (e) {
            // 送信できないクライアントは削除
            clients.delete(c);
          }
        }
      }
    });

    // 切断イベント
    server.addEventListener("close", () => {
      clients.delete(server);
    });

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  },
};
