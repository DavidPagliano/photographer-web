import { z } from "zod";

export const budgetStatusEnum = z.enum([
    "Pendiente",
    "En revisión",
    "Aprobado",
    "Avanzado a Evento",
    "Rechazado"
]);

export const budgetItemSchema = z.object({
    itemId: z.string().trim().min(1),
    concept: z.string().trim().min(1),
    price: z.coerce.number().min(0)
});

export const createBudgetSchema = z.object({
    budgetId: z.string().trim().min(1).optional(),
    clientId: z.string().trim().min(1).optional(),
    clientName: z.string().trim().min(1, "El nombre del cliente es obligatorio"),
    clientEmail: z.string().trim().email("El email del cliente es inválido"),
    clientPhone: z.string().trim().default(""),
    eventType: z.string().trim().min(1, "El tipo de evento es obligatorio"),
    eventDate: z.string().trim().default(""),
    location: z.string().trim().default(""),
    estimatedBudget: z.string().trim().min(1, "El paquete o presupuesto es obligatorio"),
    items: z.array(budgetItemSchema).optional(),
    totalAmount: z.coerce.number().min(0).optional(),
    message: z.string().trim().min(1, "El mensaje es obligatorio")
});

export const updateBudgetSchema = z.object({
    eventType: z.string().trim().min(1).optional(),
    eventDate: z.string().trim().optional(),
    location: z.string().trim().optional(),
    estimatedBudget: z.string().trim().min(1).optional(),
    items: z.array(budgetItemSchema).optional(),
    totalAmount: z.coerce.number().min(0).optional(),
    message: z.string().trim().min(1).optional(),
    status: budgetStatusEnum.optional()
});

export const advanceBudgetToEventSchema = z.object({
    title: z.string().trim().min(1).optional(),
    location: z.string().trim().min(1).optional(),
    eventDate: z.string().trim().optional(),
    packageName: z.string().trim().min(1).optional(),
    packageItems: z.array(budgetItemSchema).optional(),
    initialDepositAmount: z.coerce.number().min(0).default(0),
    initialDepositMethod: z.string().trim().default("Transferencia"),
    initialDepositNote: z.string().trim().default("Seña inicial de reserva"),
    photosToDeliver: z.coerce.number().int().min(0).default(120),
    physicalDeliverables: z.string().trim().default("")
});

export const budgetParamsSchema = z.object({
    budgetId: z.string().trim().min(1)
});

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
export type AdvanceBudgetToEventInput = z.infer<typeof advanceBudgetToEventSchema>;

