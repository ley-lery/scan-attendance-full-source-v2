import { FastifyReply, FastifyRequest } from "fastify";
import { handleError, sendSuccessResponse } from "../../../index";
import { CourseProgramListModel } from "./model";

const model = CourseProgramListModel;

export const courseProgramController = {

    async getAll(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const [rows] = await model.getAll();

            if (!rows?.length) {
                res.send({ message: "No courses found" });
                return;
            }

            sendSuccessResponse(res, true, "courses list", { rows: rows }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching courses", 500);
        }
    },

};