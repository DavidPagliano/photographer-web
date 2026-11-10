import { z } from "zod";

export const eventStageEnum = z.enum([
    "Evento Confirmado",
    "En Paquetes y Pagos",
    "En Etapa de Entrega",
    "Finalizado"
]);

export const eventPackageItemInputSchema = z.object({
    itemId: z.string().trim().min(1).optional(),
    concept: z.string().trim().min(1, "El concepto del ítem es obligatorio"),
    price: z.coerce.number().min(0),
    paidAmount: z.coerce.number().min(0).default(0),
    isPaid: z.boolean().default(false),
    delivered: z.boolean().default(false)
});

export const addDepositInputSchema = z.object({
    amount: z.coerce.number().positive("El monto del depósito debe ser mayor a 0"),
    date: z.string().trim().optional(),
    method: z.string().trim().default("Transferencia"),
    targetItemId: z.string().trim().optional(),
    note: z.string().trim().default("")
});

export const updateDeliveryInputSchema = z.object({
    photosToDeliver: z.coerce.number().int().min(0).optional(),
    photosDelivered: z.coerce.number().int().min(0).optional(),
    deliveryLink: z.string().trim().optional(),
    physicalDeliverables: z.string().trim().optional(),
    isPhotosDelivered: z.boolean().optional(),
    isMoneySettled: z.boolean().optional(),
    deliveryNotes: z.string().trim().optional(),
    advanceStageToFinalizado: z.boolean().optional()
});

export const createEventSchema = z.object({
    eventId: z.string().trim().min(1).optional(),
    budgetId: z.string().trim().optional(),
    title: z.string().trim().min(1),
    eventType: z.string().trim().min(1),
    eventDate: z.string().trim().default(""),
    location: z.string().trim().min(1, "El lugar del evento es obligatorio"),
    stage: eventStageEnum.default("En Paquetes y Pagos"),
    client: z.object({
        clientId: z.string().trim().min(1),
        name: z.string().trim().min(1),
        email: z.string().trim().email(),
        phone: z.string().trim().default("")
    }),
    packageName: z.string().trim().min(1),
    packageItems: z.array(eventPackageItemInputSchema).default([]),
    photosToDeliver: z.coerce.number().int().min(0).default(100),
    physicalDeliverables: z.string().trim().default("")
});

export const updateEventStageSchema = z.object({
    stage: eventStageEnum,
    location: z.string().trim().min(1).optional(),
    eventDate: z.string().trim().optional(),
    packageName: z.string().trim().min(1).optional()
});

export const eventParamsSchema = z.object({
    eventId: z.string().trim().min(1)
});

export const eventItemParamsSchema = z.object({
    eventId: z.string().trim().min(1),
    itemId: z.string().trim().min(1)
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type AddPackageItemInput = z.infer<typeof eventPackageItemInputSchema>;
export type AddDepositInput = z.infer<typeof addDepositInputSchema>;
export type UpdateDeliveryInput = z.infer<typeof updateDeliveryInputSchema>;
export type UpdateEventStageInput = z.infer<typeof updateEventStageSchema>;

