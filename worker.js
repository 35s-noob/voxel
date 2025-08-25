export default {
  async fetch(request, env, ctx) {
    // WebSocket Upgrade の確認
    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response("Expected websocket", { status: 400 });
    }

    // WebSocketペア作成
    const [client, server] = Object.values(new WebSocketPair());

    // サーバー側のイベントハンドリング
    server.accept();
    server.addEventListener("message", (event) => {
      // シンプルなエコーサーバー（テスト用）
      server.send(`echo: ${event.data}`);
    });

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  },
};
