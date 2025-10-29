import mysql, { Pool } from "mysql2/promise";
import { CONFIG } from "./env";

export const db: Pool = mysql.createPool({
    host: CONFIG.DB.HOST,
    user: CONFIG.DB.USER,
    password: CONFIG.DB.PASSWORD,
    database: CONFIG.DB.DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true,
});

(async (): Promise<void> => {
    try {
        await db.getConnection();
        console.log("Database connection established successfully.");
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
})();
