import bcrypt from 'bcryptjs';
import { AuditLog, AuditLogFilter, User, UserSignUp } from '../../../types/interface';
import { db } from '../../../config/db';
import { Message } from '../../../utils';



export const AuthModel = {
    async userSignUp(data: User): Promise<any> {
        const {username, email, password, isActive = true, assignType, assignTo } = data;
        const sql = `Call auth_user_signup(?, ?, ?, ?, ?, ?)`;
        const hashedPassword = bcrypt.hashSync(password, 10);
        const params = [username, email, hashedPassword, isActive, assignType, assignTo];
        const result = await db.query(sql, params);
        return result[0];
    },
    async userSignIn(email: string,): Promise<any> {
        const sql = `Call auth_user_sign_in(?)`;
        const params = [email];
        const resul = await db.query(sql, params);
        return resul[0];
    },
    async userAlreadyExist(email: string): Promise<any> {
        const sql = `Call auth_user_email_exists(?)`;
        const params = [email];
        const result = await db.query(sql, params);
        return result[0];
    },
    async userProfile(id: number): Promise<any> {
        const sql = `Call auth_get_user_profile(?)`;
        const params = [id];
        const result = await db.query(sql, params);
        return result[0];   
    },

    // new v
    async signUp(data: UserSignUp): Promise<any> {
        
        const {username, email, password, isActive = true, assignType, assignTo } = data;
        
        const sql = `Call sp_auth_user_signup(?, ?, ?, ?, ?, ?, @p_messages_json)`;

        const hashedPassword = bcrypt.hashSync(password, 10);
        const params = [username, email, hashedPassword, isActive, assignType, assignTo];

        await db.query(sql, params);
        return Message.callProcedureWithMessages();
    },
}
