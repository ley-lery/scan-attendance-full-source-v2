import { FastifyReply, FastifyRequest } from "fastify";
import { handleError, sendSuccessResponse } from "../../../index";
import { LecturerCourseListModel } from "./model";

const model = LecturerCourseListModel;

export const lecturerCourseListController = {

    async getAll(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const [rows] = await model.getAll();

            if (!rows?.length) {
                res.send({ message: "No course of lecturer found" });
                return;
            }

            sendSuccessResponse(res, true, "course of lecturer list", { rows: rows }, 200);
        } catch (e) {
            handleError(res, e as Error, "Error fetching course of lecturer", 500);
        }
    },

};