import { Room } from "colyseus";
import { SurvivalPlayer, SurvivalState } from "./SurvivalState.js";

const ALLOWED_CHARACTERS = new Set(["bacon", "noob", "rob"]);
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const finite = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const cleanName = (value) => String(value || "Jogador").replace(/[<>\\u0000-\\u001f]/g, "").trim().slice(0, 18) || "Jogador";
const cleanText = (value) => String(value || "").replace(/[\\u0000-\\u001f]/g, " ").trim().slice(0, 100);

export class SurvivalRoom extends Room {
  maxClients = 8;
  seatReservationTimeout = 60;
  patchRate = 50;
  maxMessagesPerSecond = 40;
  state = new SurvivalState();
  eventCounter = 0;

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

    // Qualquer jogador conectado pode solicitar o início. O servidor é quem
    // marca a partida como iniciada e sincroniza o mesmo estado para a sala.
    this.onMessage("startMatchRequest", (client) => {
      if (!this.state.players.has(client.sessionId)) return;
      if (this.state.started) {
        client.send("startMatch", { hostId: this.state.hostId, startedAt: this.state.startedAt });
        return;
      }
      this.state.started = true;
      this.state.startedAt = Date.now();
      this.broadcast("startMatch", { hostId: client.sessionId, startedAt: this.state.startedAt });
    });

    this.onMessage("gameEventRequest", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      if (!player || !data || typeof data !== "object") return;
      const text = cleanText(data.text);
      if (!text) return;
      const requestId = cleanText(data.requestId).replace(/[^a-zA-Z0-9:_-]/g, "").slice(0, 64);
      if (!requestId) return;
      const seed = (finite(data.seed, 1) >>> 0) || 1;
      this.eventCounter++;
      const event = {
        id: client.sessionId + ":" + requestId,
        seed,
        text,
        by: player.name,
        originX: clamp(finite(data.x, player.x), -112, 112),
        originZ: clamp(finite(data.z, player.z), -112, 112)
      };
      for (const other of this.clients) {
        if (other.sessionId !== client.sessionId) other.send("gameEvent", event);
      }
    });

    this.onMessage("worldSync", (client, data) => {
      if (client.sessionId !== this.state.hostId || !data || !Array.isArray(data.entities)) return;
      const entities = data.entities.slice(0, 80).map((e) => ({
        id: cleanText(e.id).slice(0, 48),
        type: cleanText(e.type).slice(0, 16),
        x: clamp(finite(e.x), -150, 150),
        z: clamp(finite(e.z), -150, 150),
        y: clamp(finite(e.y), 0, 100),
        rotation: clamp(finite(e.rotation), -1000, 1000),
        hp: clamp(finite(e.hp), 0, 10000),
        dead: Boolean(e.dead),
        form: clamp(finite(e.form), 0, 1),
        fy: clamp(finite(e.fy), 0, 100),
        s: clamp(finite(e.s), -300, 300),
        life: clamp(finite(e.life), 0, 600),
        age: clamp(finite(e.age), 0, 600)
      })).filter((e) => e.id);
      this.broadcast("worldSync", { entities });
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
    if (!this.state.hostId && !this.state.started) this.state.hostId = client.sessionId;
    this.broadcast("lobby", { count: this.state.players.size, started: this.state.started });
  }

  onLeave(client) {
    this.state.players.delete(client.sessionId);
    if (this.state.hostId === client.sessionId && !this.state.started) {
      const next = this.state.players.keys().next();
      this.state.hostId = next.done ? "" : next.value;
    }
    this.broadcast("lobby", { count: this.state.players.size, started: this.state.started });
  }
}
