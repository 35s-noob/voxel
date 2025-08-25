const ws = new WebSocket('ws://fps-craft.vox-35sjp.workers.dev');
export const otherPlayers = {};

ws.onmessage = e => {
  const msg = JSON.parse(e.data);
  const { id, data } = msg;
  if(data===null){ delete otherPlayers[id]; return; }

  if(!otherPlayers[id]){
    const camera = new THREE.Object3D();
    otherPlayers[id] = { camera, player:{ name:data.name, health:data.health, alive:data.alive, weapon:data.weapon } };
  }
  const p = otherPlayers[id];
  p.camera.position.set(data.pos.x, data.pos.y, data.pos.z);
  p.player.health=data.health;
  p.player.alive=data.alive;
  p.player.weapon=data.weapon;
};

export function sendPlayerState(playerObj, camera){
  if(ws.readyState!==WebSocket.OPEN) return;
  ws.send(JSON.stringify({
    name:playerObj.player.name,
    pos:camera.position,
    health:playerObj.player.health,
    alive:playerObj.player.alive,
    weapon:playerObj.player.weapon
  }));
}

