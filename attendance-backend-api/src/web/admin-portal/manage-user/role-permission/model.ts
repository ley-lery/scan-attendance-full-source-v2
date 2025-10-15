import { db } from "../../../../index";


export const RolePermissionModel = {
    async toggle(data: { role: number; permissions: number[] }): Promise<any> {
        const { role, permissions } = data;
        const permissionsJson = JSON.stringify(permissions);
        
        // Call stored procedure with correct syntax
        await db.query('CALL sp_role_permission_toggle(?, ?, @p_messages_json)', [
          role, 
          permissionsJson 
        ]);
        
        // Retrieve the OUT parameter
        const [rows] = await db.query('SELECT @p_messages_json AS messages');
        return rows;
      },
    async getByRoleId(roleId: number): Promise<any> {
        const [result] = await db.query(`Call sp_role_permission_get(?, @p_messages_json)`, [roleId]);
        return result;
    },
    async getPermissionCurrentUser(userId: number): Promise<any> {
        const [result] = await db.query(`Call sp_role_permission_get_current(?, @p_messages_json)`, [userId]);
        return result;
    },

    async search(keyword: string, page: number = 1, limit: number = 10): Promise<any> {
        const [result] = await db.query(`Call sp_role_permission_search(?, ?, ?, ?)`, [keyword, page, limit]);
        return result;
    },
};
