import server from "./src/app.config.js";

const port = Number(process.env.PORT || 2567);
await server.listen(port, "0.0.0.0");
console.log(`Sobreviva multiplayer ouvindo na porta ${port}`);
