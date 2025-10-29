import { FastifyReply, FastifyRequest } from "fastify";
import { handleError, sendSuccessResponse } from "../../index";
import { ScanModel } from "./model";

type ScanData = {
    classId: number | null,
    studentId: number | null,
    dayOfWeek: string | null,
    targetTime: string | null
}

const model = ScanModel;

export const scanController = {

    async getClass(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { classId } = req.params as { classId: number };
        try {
            const [rows] = await model.getClass(classId);

            if (!rows?.length) {
                res.send({ message: "No records found" });
                return;
            }

            sendSuccessResponse(res, true, "records list", rows[0], 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching records", 500);
        }
    },

    async getSessionAndProcess(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const data = req.body as ScanData;
        try {
            const [result] = await model.getSessionAndProcess(data);
            const messages = JSON.parse(result?.messages) ;
            if (messages && messages.length > 0 && messages[0].code === 0) {
                sendSuccessResponse(res, true, messages, null, 200);
            }else{
                res.send({ message: messages[0].message || "Error updating lecturer course" });
            }
        } catch (e) {
            handleError(res, e as Error, "Error fetching records", 500);
        }
    },

};