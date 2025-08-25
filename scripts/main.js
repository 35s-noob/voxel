import * as THREE from 'three';
import { createWorld } from './world.js';
import { setupPointerLock, setupPlayer } from './controls.js';
import { sendPlayerState, otherPlayers } from './client.js';

const canvas = document.getElementById('gameCanvas');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

// --- ワールド生成 ---
const { mesh: worldMesh, collider: worldCollider } = createWorld();
scene.add(worldMesh);

// --- 光源 ---
scene.add(new THREE.AmbientLight(0xffffff, 0.7));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(50,100,50);
dirLight.castShadow = true;
scene.add(dirLight);

// --- プレイヤー ---
const playerObj = setupPlayer("Alice", camera);
scene.add(playerObj.mesh);

// --- 他プレイヤー ---
for (const p of Object.values(otherPlayers)) scene.add(p.mesh);

// --- コントロール ---
const controls = setupPointerLock(canvas, camera, worldCollider);

// --- メインループ ---
let prev = performance.now();
function loop(t){
  const dt = (t-prev)/1000; prev = t;

  controls.update(dt);
  playerObj.update(dt, [...Object.values(otherPlayers)], camera);

  // 自分の状態を送信
  sendPlayerState(playerObj);

  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
