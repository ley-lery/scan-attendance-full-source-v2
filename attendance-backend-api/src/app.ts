import fastify, { FastifyReply, FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import { corsOptions } from "./middlewares/cors";
import routes from "./routes";

const app = fastify({
    logger: false,
});
app.register(cors, corsOptions); 
app.register(routes);

// Error handling no route found
app.setNotFoundHandler((res: FastifyRequest, rep: FastifyReply) => {
    rep.status(404).send({ error: "Route Not Found!" });
});

export default app;
