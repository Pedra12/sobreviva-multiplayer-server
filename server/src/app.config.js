import { defineRoom, defineServer } from "colyseus";
import { SurvivalRoom } from "./rooms/SurvivalRoom.js";

const server = defineServer({
  rooms: {
    survival_room: defineRoom(SurvivalRoom)
  },
  express: (app) => {
    app.get("/", (_req, res) => {
      res.json({
        game: "Sobreviva às Suas Ideias 3D",
        service: "multiplayer",
        status: "online",
        maxPlayersPerRoom: 8
      });
    });
    app.get("/health", (_req, res) => res.status(200).send("ok"));
  }
});

export default server;
