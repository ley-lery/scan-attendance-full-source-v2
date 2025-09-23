export const corsOptions = {
    origin: ["http://localhost:3600", "http://localhost:6600"],
    methods: "GET,PUT,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
    optionsSuccessStatus: 204,
};
