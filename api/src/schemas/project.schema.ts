import { z } from "zod";

const imageSchema = z.object({
    imageId: z.string().trim().min(1),
    imageName: z.string().trim().min(1),
    imageBase64: z.string().min(1)
});

export const createProjectSchema = z.object({
    projectId: z.string().trim().min(1),
    projectName: z.string().trim().min(1),
    projectDescription: z.string().trim().min(1),
    images: z.array(imageSchema).default([])
});

export const updateProjectSchema = z.object({
    projectName: z.string().trim().min(1).optional(),
    projectDescription: z.string().trim().min(1).optional(),
    images: z.array(imageSchema).optional()
}).refine((project) => Object.keys(project).length > 0, {
    message: "Debe proporcionar al menos un campo para actualizar"
});

export const projectParamsSchema = z.object({
    projectId: z.string().trim().min(1)
});

export const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10)
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
