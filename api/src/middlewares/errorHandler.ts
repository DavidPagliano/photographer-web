import type { ErrorRequestHandler } from "express";
import {
    ProjectConflictError,
    ProjectNotFoundError
} from "../services/project.service";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
    if (error instanceof ProjectNotFoundError) {
        res.status(404).json({ message: error.message });
        return;
    }

    if (error instanceof ProjectConflictError) {
        res.status(409).json({ message: error.message });
        return;
    }

    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
};
