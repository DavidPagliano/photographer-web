import type { RequestHandler } from "express";
import type { ZodType } from "zod";

export const validateBody = <T>(schema: ZodType<T>): RequestHandler =>
    (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            res.status(400).json({
                message: "Solicitud inválida",
                errors: result.error.issues.map((issue) => ({
                    path: issue.path.join("."),
                    message: issue.message
                }))
            });
            return;
        }

        req.body = result.data;
        next();
    };