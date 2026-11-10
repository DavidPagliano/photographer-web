import type { RequestHandler } from "express";
import { budgetParamsSchema } from "../schemas/budget.schema";
import * as budgetService from "../services/budget.service";

type BudgetParams = { budgetId: string };

export const createBudget: RequestHandler = async (req, res, next) => {
    try {
        const budget = await budgetService.createBudget(req.body);
        res.status(201).json(budget);
    } catch (error) {
        next(error);
    }
};

export const listBudgets: RequestHandler = async (_req, res, next) => {
    try {
        const budgets = await budgetService.listBudgets();
        res.json({ data: budgets });
    } catch (error) {
        next(error);
    }
};

export const getBudget: RequestHandler<BudgetParams> = async (req, res, next) => {
    const parsed = budgetParamsSchema.safeParse(req.params);
    if (!parsed.success) {
        res.status(400).json({ message: "Identificador de presupuesto inválido" });
        return;
    }

    try {
        const budget = await budgetService.getBudgetById(parsed.data.budgetId);
        res.json(budget);
    } catch (error) {
        next(error);
    }
};

export const updateBudget: RequestHandler<BudgetParams> = async (req, res, next) => {
    const parsed = budgetParamsSchema.safeParse(req.params);
    if (!parsed.success) {
        res.status(400).json({ message: "Identificador de presupuesto inválido" });
        return;
    }

    try {
        const budget = await budgetService.updateBudget(parsed.data.budgetId, req.body);
        res.json(budget);
    } catch (error) {
        next(error);
    }
};

export const advanceBudgetToEvent: RequestHandler<BudgetParams> = async (
    req,
    res,
    next
) => {
    const parsed = budgetParamsSchema.safeParse(req.params);
    if (!parsed.success) {
        res.status(400).json({ message: "Identificador de presupuesto inválido" });
        return;
    }

    try {
        const result = await budgetService.advanceBudgetToEvent(
            parsed.data.budgetId,
            req.body
        );
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

export const deleteBudget: RequestHandler<BudgetParams> = async (req, res, next) => {
    const parsed = budgetParamsSchema.safeParse(req.params);
    if (!parsed.success) {
        res.status(400).json({ message: "Identificador de presupuesto inválido" });
        return;
    }

    try {
        await budgetService.deleteBudget(parsed.data.budgetId);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

