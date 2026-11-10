import Project from "../models/project";
import type { CreateProjectInput, UpdateProjectInput } from "../schemas/project.schema";

export class ProjectNotFoundError extends Error {
    constructor(projectId: string) {
        super(`No se encontró el proyecto '${projectId}'`);
        this.name = "ProjectNotFoundError";
    }
}

export class ProjectConflictError extends Error {
    constructor() {
        super("Ya existe un proyecto con ese identificador");
        this.name = "ProjectConflictError";
    }
}

export const createProject = async (input: CreateProjectInput) => {
    try {
        return await Project.create(input);
    } catch (error) {
        if (isDuplicateKeyError(error)) {
            throw new ProjectConflictError();
        }
        throw error;
    }
};

export const listProjects = async (page: number, limit: number) => {
    const [projects, total] = await Promise.all([
        Project.find({})
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .exec(),
        Project.countDocuments({}).exec()
    ]);

    return {
        projects,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
};

export const getProjectById = async (projectId: string) => {
    const project = await Project.findOne({ projectId }).exec();
    if (!project) {
        throw new ProjectNotFoundError(projectId);
    }
    return project;
};

export const updateProject = async (projectId: string, input: UpdateProjectInput) => {
    const project = await Project.findOneAndUpdate(
        { projectId },
        { $set: input },
        { new: true, runValidators: true }
    ).exec();

    if (!project) {
        throw new ProjectNotFoundError(projectId);
    }
    return project;
};

export const deleteProject = async (projectId: string) => {
    const project = await Project.findOneAndDelete({ projectId }).exec();
    if (!project) {
        throw new ProjectNotFoundError(projectId);
    }
};

const isDuplicateKeyError = (error: unknown): error is { code: number } =>
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000;
