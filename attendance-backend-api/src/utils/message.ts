import { db } from "../config/db";

export const Message = {
    async callProcedureWithMessages(): Promise<any> {
        const msgSql = `SELECT @p_messages_json AS messages`;
        const msgResult = await db.query(msgSql);
        return msgResult[0];
    }
}

// export const Message = {
//     async callProcedureWithMessages(): Promise<any> {
//         const [rows] = await db.query(`SELECT @messages_json AS messages`);
//         return rows; 
//     }
// };
