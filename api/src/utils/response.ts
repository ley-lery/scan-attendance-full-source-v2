import { FastifyReply } from "fastify";

const handleError = (
    res: FastifyReply,
    error: Error,
    message: string = "An error occurred",
    statusCode: number = 500
): void => {
    console.log(error);
    res.status(statusCode).send({
        error: error.message || "Internal Server Error",
        message: message,
    });
};

const sendSuccessResponse = (
    res: FastifyReply,
    success: boolean,
    message: string,
    data: any = null,
    statusCode: number = 200
): void => {
    res.status(statusCode).send({
        success: success,
        message: message,
        data: data,
    });
};

const notFoundResponse = (
    res: FastifyReply,
    success: boolean,
    message: string,
    statusCode: number = 200,
    id?: number
): void => {
    res.status(statusCode).send({
        ...(id !== undefined && { id }),
        success,
        message,
    });
};

const sendAlreadyResponse = (res: FastifyReply, success: boolean, message: string): void => {
    res.status(400).send({ res, success, message: message, already: true });
};

const showValidation = (err: unknown, res: FastifyReply) => {
    if (err instanceof Error && err.message.startsWith("{")) {
        return res.send({
            success: false,
            message: "Validation failed",
            errors: JSON.parse(err.message),
        });
    }
};
// const showValidationError = (error: unknown, rp: FastifyReply) => {
//     if (error instanceof ZodError) {
//         // Format validation errors
//         const formattedErrors = error.errors.map(err => ({
//             path: err.path.join('.'),
//             message: err.message,
//         }));

//         return rp.status(400).send({
//             success: false,
//             message: "Validation failed",
//             errors: formattedErrors,
//         });
//     }
// }

export { handleError, sendSuccessResponse, notFoundResponse, sendAlreadyResponse, showValidation };
