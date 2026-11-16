import { schema, t } from "@colyseus/schema";

export const SurvivalPlayer = schema({
  name: t.string().default("Jogador"),
  character: t.string().default("bacon"),
  x: t.number().default(0),
  y: t.number().default(0),
  z: t.number().default(0),
  rotation: t.number().default(0),
  moving: t.boolean().default(false)
}, "SurvivalPlayer");

export const SurvivalState = schema({
  players: t.map(SurvivalPlayer),
  hostId: t.string().default("")
}, "SurvivalState");
