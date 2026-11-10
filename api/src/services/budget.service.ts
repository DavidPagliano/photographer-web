import Budget from "../models/budget";
import type {
    AdvanceBudgetToEventInput,
    CreateBudgetInput,
    UpdateBudgetInput
} from "../schemas/budget.schema";
import { findOrCreateClientByEmail } from "./client.service";
import {
    addDepositToEvent,
    buildDefaultPackageItems,
    createEvent
} from "./event.service";

export class BudgetNotFoundError extends Error {
    constructor(budgetId: string) {
        super(`No se encontró el presupuesto '${budgetId}'`);
        this.name = "BudgetNotFoundError";
    }
}

export class BudgetConflictError extends Error {
    constructor(message = "Ya existe un presupuesto con ese identificador") {
        super(message);
        this.name = "BudgetConflictError";
    }
}

export const createBudget = async (input: CreateBudgetInput) => {
    // 1. Registrar o actualizar automáticamente el cliente en la colección de clientes
    const client = await findOrCreateClientByEmail({
        clientId: input.clientId,
        name: input.clientName,
        email: input.clientEmail,
        phone: input.clientPhone
    });

    // 2. Generar los ítems iniciales según el paquete si no vinieron personalizados
    const defaultItems = buildDefaultPackageItems(input.estimatedBudget).map(
        (it) => ({
            itemId: it.itemId,
            concept: it.concept,
            price: it.price
        })
    );

    const items =
        input.items && input.items.length > 0 ? input.items : defaultItems;

    const totalAmount =
        input.totalAmount !== undefined
            ? input.totalAmount
            : items.reduce((sum, it) => sum + it.price, 0);

    const budgetId =
        input.budgetId?.trim() ||
        `pres-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

    return await Budget.create({
        budgetId,
        clientId: client.clientId,
        clientName: client.name,
        clientEmail: client.email,
        clientPhone: client.phone,
        eventType: input.eventType,
        eventDate: input.eventDate || "",
        location: input.location || "",
        estimatedBudget: input.estimatedBudget,
        items,
        totalAmount,
        message: input.message,
        status: "Pendiente"
    });
};

export const listBudgets = async () => {
    return await Budget.find({}).sort({ createdAt: -1 }).exec();
};

export const getBudgetById = async (budgetId: string) => {
    const budget = await Budget.findOne({ budgetId }).exec();
    if (!budget) {
        throw new BudgetNotFoundError(budgetId);
    }
    return budget;
};

export const updateBudget = async (
    budgetId: string,
    input: UpdateBudgetInput
) => {
    const budget = await getBudgetById(budgetId);

    if (input.eventType !== undefined) budget.eventType = input.eventType;
    if (input.eventDate !== undefined) budget.eventDate = input.eventDate;
    if (input.location !== undefined) budget.location = input.location;
    if (input.estimatedBudget !== undefined) {
        budget.estimatedBudget = input.estimatedBudget;
    }
    if (input.items !== undefined) {
        budget.items = input.items;
        budget.totalAmount = input.items.reduce((sum, it) => sum + it.price, 0);
    } else if (input.totalAmount !== undefined) {
        budget.totalAmount = input.totalAmount;
    }
    if (input.message !== undefined) budget.message = input.message;
    if (input.status !== undefined) budget.status = input.status;

    return await budget.save();
};

/**
 * Avanza un Presupuesto a la etapa de Evento:
 * Crea el Evento con el cliente, lugar, paquete dinámico (con sus ítems para ir pagando por cada cosa),
 * registra una seña/depósito inicial opcional y vincula el presupuesto con el nuevo evento.
 */
export const advanceBudgetToEvent = async (
    budgetId: string,
    options: AdvanceBudgetToEventInput
) => {
    const budget = await getBudgetById(budgetId);

    if (budget.linkedEventId) {
        throw new BudgetConflictError(
            `El presupuesto '${budgetId}' ya fue avanzado al evento '${budget.linkedEventId}'`
        );
    }

    const packageName = options.packageName || budget.estimatedBudget;
    const rawItems =
        options.packageItems && options.packageItems.length > 0
            ? options.packageItems
            : budget.items && budget.items.length > 0
              ? budget.items
              : buildDefaultPackageItems(packageName);

    const createdEvent = await createEvent({
        budgetId: budget.budgetId,
        title:
            options.title ||
            `${budget.eventType} · ${budget.clientName}`,
        eventType: budget.eventType,
        eventDate: options.eventDate || budget.eventDate || "",
        location: options.location || budget.location || "Por definir",
        stage: "En Paquetes y Pagos",
        client: {
            clientId: budget.clientId,
            name: budget.clientName,
            email: budget.clientEmail,
            phone: budget.clientPhone
        },
        packageName,
        packageItems: rawItems.map((it) => ({
            itemId: it.itemId,
            concept: it.concept,
            price: it.price,
            paidAmount: 0,
            isPaid: false,
            delivered: false
        })),
        photosToDeliver: options.photosToDeliver ?? 120,
        physicalDeliverables:
            options.physicalDeliverables ||
            (packageName.toLowerCase().includes("premium")
                ? "Fotolibro 30x30 + Pendrive en Caja"
                : "Galería Digital Alta Resolución")
    });

    if (options.initialDepositAmount && options.initialDepositAmount > 0) {
        await addDepositToEvent(createdEvent.eventId, {
            amount: options.initialDepositAmount,
            method: options.initialDepositMethod || "Transferencia",
            note: options.initialDepositNote || "Seña inicial al confirmar presupuesto"
        });
    }

    const updatedEvent = await createOrFetchUpdatedEvent(createdEvent.eventId);

    budget.status = "Avanzado a Evento";
    budget.linkedEventId = createdEvent.eventId;
    await budget.save();

    return {
        budget,
        event: updatedEvent
    };
};

const createOrFetchUpdatedEvent = async (eventId: string) => {
    const { getEventById } = await import("./event.service");
    return await getEventById(eventId);
};

export const deleteBudget = async (budgetId: string) => {
    const budget = await Budget.findOneAndDelete({ budgetId }).exec();
    if (!budget) {
        throw new BudgetNotFoundError(budgetId);
    }
};

