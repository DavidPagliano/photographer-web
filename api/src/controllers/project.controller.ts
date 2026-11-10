import type { RequestHandler } from "express";
import { paginationSchema, projectParamsSchema } from "../schemas/project.schema";
import * as projectService from "../services/project.service";

type ProjectParams = { projectId: string };

export const createProject: RequestHandler = async (req, res, next) => {
    try {
        const project = await projectService.createProject(req.body);
        res.status(201).json(project);
    } catch (error) {
        next(error);
    }
};

export const listProjects: RequestHandler = async (req, res, next) => {
    const parsedQuery = paginationSchema.safeParse(req.query);
    if (!parsedQuery.success) {
        res.status(400).json({
            message: "Parámetros de paginación inválidos",
            errors: parsedQuery.error.issues.map((issue) => ({
                path: issue.path.join("."),
                message: issue.message
            }))
        });
        return;
    }

    try {
        const result = await projectService.listProjects(parsedQuery.data.page, parsedQuery.data.limit);
        res.json({
            data: result.projects,
            pagination: result.pagination
        });
    } catch (error) {
        next(error);
    }
};

export const getProject: RequestHandler<ProjectParams> = async (req, res, next) => {
    const parsedParams = projectParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
        res.status(400).json({ message: "Identificador de proyecto inválido" });
        return;
    }

    try {
        const project = await projectService.getProjectById(parsedParams.data.projectId);
        res.json(project);
    } catch (error) {
        next(error);
    }
};

export const updateProject: RequestHandler<ProjectParams> = async (req, res, next) => {
    const parsedParams = projectParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
        res.status(400).json({ message: "Identificador de proyecto inválido" });
        return;
    }

    try {
        const project = await projectService.updateProject(parsedParams.data.projectId, req.body);
        res.json(project);
    } catch (error) {
        next(error);
    }
};

export const deleteProject: RequestHandler<ProjectParams> = async (req, res, next) => {
    const parsedParams = projectParamsSchema.safeParse(req.params);
    if (!parsedParams.success) {
        res.status(400).json({ message: "Identificador de proyecto inválido" });
        return;
    }

    try {
        await projectService.deleteProject(parsedParams.data.projectId);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};
