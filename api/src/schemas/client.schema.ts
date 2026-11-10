import { z } from "zod";

export const createClientSchema = z.object({
    clientId: z.string().trim().min(1).optional(),
    name: z.string().trim().min(1, "El nombre es obligatorio"),
    email: z.string().trim().email("Email inválido"),
    phone: z.string().trim().default(""),
    notes: z.string().trim().default("")
});

export const updateClientSchema = z.object({
    name: z.string().trim().min(1).optional(),
    email: z.string().trim().email().optional(),
    phone: z.string().trim().optional(),
    notes: z.string().trim().optional()
}).refine((data) => Object.keys(data).length > 0, {
    message: "Debe proporcionar al menos un campo para actualizar"
});

export const clientParamsSchema = z.object({
    clientId: z.string().trim().min(1)
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;

