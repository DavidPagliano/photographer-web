import type { ErrorRequestHandler } from "express";
import {
    BudgetConflictError,
    BudgetNotFoundError
} from "../services/budget.service";
import {
    ClientConflictError,
    ClientNotFoundError
} from "../services/client.service";
import {
    EventConflictError,
    EventNotFoundError
} from "../services/event.service";
import {
    ProjectConflictError,
    ProjectNotFoundError
} from "../services/project.service";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
    if (
        error instanceof ProjectNotFoundError ||
        error instanceof ClientNotFoundError ||
        error instanceof BudgetNotFoundError ||
        error instanceof EventNotFoundError
    ) {
        res.status(404).json({ message: error.message });
        return;
    }

    if (
        error instanceof ProjectConflictError ||
        error instanceof ClientConflictError ||
        error instanceof BudgetConflictError ||
        error instanceof EventConflictError
    ) {
        res.status(409).json({ message: error.message });
        return;
    }

    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
};
