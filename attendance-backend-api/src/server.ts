import app from './app';
import {CONFIG} from "./config/env";
import "./config/db"
const PORT = CONFIG.PORT || 7700;

const start = async () => {
    try {
        await app.listen({ port: PORT, host: "0.0.0.0" });
        console.log(`Fastify server is running on http://localhost:${PORT}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1); 
    }
};

start().then(r => {
    console.log(`Server started on port ${PORT}`);
}).catch(err => {
    console.error('Error starting server:', err);
    process.exit(1);
});
