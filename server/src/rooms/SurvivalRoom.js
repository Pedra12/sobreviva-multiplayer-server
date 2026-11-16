import { Room } from "colyseus";
import { SurvivalPlayer, SurvivalState } from "./SurvivalState.js";

const ALLOWED_CHARACTERS = new Set(["bacon", "noob", "rob"]);
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const finite = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const cleanName = (value) => String(value || "Jogador").replace(/[<>\\u0000-\\u001f]/g, "").trim().slice(0, 18) || "Jogador";

export class SurvivalRoom extends Room {
  maxClients = 8;
  patchRate = 50;
  maxMessagesPerSecond = 25;
  state = new SurvivalState();

  async onCreate() {
    await this.setPrivate(true);
    this.onMessage("move", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      if (!player || !data || typeof data !== "object") return;

      player.x = clamp(finite(data.x, player.x), -112, 112);
      player.y = clamp(finite(data.y, player.y), 0, 40);
      player.z = clamp(finite(data.z, player.z), -112, 112);
      player.rotation = clamp(finite(data.rotation, player.rotation), -1000, 1000);
      player.moving = Boolean(data.moving);
    });
  }

  onJoin(client, options = {}) {
    const player = new SurvivalPlayer();
    player.name = cleanName(options.name);
    player.character = ALLOWED_CHARACTERS.has(options.character) ? options.character : "bacon";
    const angle = Math.random() * Math.PI * 2;
    const radius = 12 + Math.random() * 22;
    player.x = Math.cos(angle) * radius;
    player.z = Math.sin(angle) * radius;
    this.state.players.set(client.sessionId, player);
    this.broadcast("lobby", { count: this.state.players.size });
  }

  onLeave(client) {
    this.state.players.delete(client.sessionId);
    this.broadcast("lobby", { count: this.state.players.size });
  }
}
