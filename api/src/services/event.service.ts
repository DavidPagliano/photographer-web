import EventModel, {
    type IEvent,
    type IEventPackageItem
} from "../models/event";
import type {
    AddDepositInput,
    AddPackageItemInput,
    CreateEventInput,
    UpdateDeliveryInput,
    UpdateEventStageInput
} from "../schemas/event.schema";

export class EventNotFoundError extends Error {
    constructor(eventId: string) {
        super(`No se encontró el evento '${eventId}'`);
        this.name = "EventNotFoundError";
    }
}

export class EventConflictError extends Error {
    constructor() {
        super("Ya existe un evento con ese identificador");
        this.name = "EventConflictError";
    }
}

/**
 * Genera el desglose dinámico inicial de ítems según el paquete elegido
 */
export const buildDefaultPackageItems = (
    packageName: string
): IEventPackageItem[] => {
    const normalized = packageName.toLowerCase();

    if (normalized.includes("básico") || normalized.includes("basico")) {
        return [
            {
                itemId: "item-cobertura-2h",
                concept: "Cobertura Fotográfica (2 hs)",
                price: 85000,
                paidAmount: 0,
                isPaid: false,
                delivered: false
            },
            {
                itemId: "item-edicion-50",
                concept: "Edición Fine-Art (50 fotografías digitales)",
                price: 45000,
                paidAmount: 0,
                isPaid: false,
                delivered: false
            }
        ];
    }

    if (normalized.includes("premium")) {
        return [
            {
                itemId: "item-cobertura-full",
                concept: "Cobertura Fotográfica Completa del Evento",
                price: 240000,
                paidAmount: 0,
                isPaid: false,
                delivered: false
            },
            {
                itemId: "item-sesion-previa",
                concept: "Sesión Pre-Evento / Book Exterior",
                price: 85000,
                paidAmount: 0,
                isPaid: false,
                delivered: false
            },
            {
                itemId: "item-fotolibro",
                concept: "Fotolibro Impreso 30x30 + Caja Artesanal",
                price: 120000,
                paidAmount: 0,
                isPaid: false,
                delivered: false
            },
            {
                itemId: "item-pendrive-galeria",
                concept: "Pendrive + Galería Web Alta Resolución (300+ fotos)",
                price: 55000,
                paidAmount: 0,
                isPaid: false,
                delivered: false
            }
        ];
    }

    // Estándar o A Medida por defecto
    return [
        {
            itemId: "item-cobertura-4h",
            concept: "Cobertura Fotográfica (4 hs)",
            price: 150000,
            paidAmount: 0,
            isPaid: false,
            delivered: false
        },
        {
            itemId: "item-edicion-120",
            concept: "Edición y Revelado Digital (120 fotos)",
            price: 65000,
            paidAmount: 0,
            isPaid: false,
            delivered: false
        },
        {
            itemId: "item-galeria-online",
            concept: "Galería Online Privada para Invitados",
            price: 35000,
            paidAmount: 0,
            isPaid: false,
            delivered: false
        }
    ];
};

/**
 * Recalcula los montos pagados por ítem y los totales del evento a partir de sus paquetes y depósitos
 */
export const recalculateEventFinancials = (event: IEvent): void => {
    // Reiniciar pagos acumulados de cada ítem
    for (const item of event.packageItems) {
        item.paidAmount = 0;
        item.isPaid = false;
    }

    let unassignedPool = 0;

    // 1. Aplicar primero los depósitos dirigidos a un ítem específico (targetItemId)
    for (const dep of event.deposits) {
        if (dep.targetItemId) {
            const target = event.packageItems.find(
                (it) => it.itemId === dep.targetItemId
            );
            if (target) {
                const needed = Math.max(0, target.price - target.paidAmount);
                const applied = Math.min(needed, dep.amount);
                target.paidAmount += applied;
                unassignedPool += dep.amount - applied;
            } else {
                unassignedPool += dep.amount;
            }
        } else {
            unassignedPool += dep.amount;
        }
    }

    // 2. Distribuir cualquier saldo de depósitos generales entre los ítems pendientes en orden
    for (const item of event.packageItems) {
        if (unassignedPool <= 0) break;
        const needed = Math.max(0, item.price - item.paidAmount);
        if (needed > 0) {
            const applied = Math.min(needed, unassignedPool);
            item.paidAmount += applied;
            unassignedPool -= applied;
        }
    }

    // 3. Marcar ítems saldados
    for (const item of event.packageItems) {
        item.isPaid = item.paidAmount >= item.price && item.price >= 0;
    }

    const totalPackageAmount = event.packageItems.reduce(
        (sum, it) => sum + it.price,
        0
    );
    const totalPaidAmount = event.deposits.reduce(
        (sum, dep) => sum + dep.amount,
        0
    );
    const pendingBalance = Math.max(0, totalPackageAmount - totalPaidAmount);

    event.totalPackageAmount = totalPackageAmount;
    event.totalPaidAmount = totalPaidAmount;
    event.pendingBalance = pendingBalance;
    event.delivery.isMoneySettled =
        totalPackageAmount > 0 && pendingBalance === 0;
};

export const createEvent = async (input: CreateEventInput) => {
    const eventId =
        input.eventId?.trim() ||
        `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

    const items: IEventPackageItem[] =
        input.packageItems && input.packageItems.length > 0
            ? input.packageItems.map((it, idx) => ({
                  itemId: it.itemId || `item-${Date.now()}-${idx}`,
                  concept: it.concept,
                  price: it.price,
                  paidAmount: it.paidAmount || 0,
                  isPaid: it.isPaid || false,
                  delivered: it.delivered || false
              }))
            : buildDefaultPackageItems(input.packageName);

    const newEvent = new EventModel({
        eventId,
        budgetId: input.budgetId,
        title: input.title,
        eventType: input.eventType,
        eventDate: input.eventDate,
        location: input.location,
        stage: input.stage || "En Paquetes y Pagos",
        client: input.client,
        packageName: input.packageName,
        packageItems: items,
        deposits: [],
        delivery: {
            photosToDeliver: input.photosToDeliver ?? 120,
            photosDelivered: 0,
            deliveryLink: "",
            physicalDeliverables: input.physicalDeliverables || "",
            isPhotosDelivered: false,
            isMoneySettled: false,
            deliveryNotes: ""
        }
    });

    recalculateEventFinancials(newEvent);
    return await newEvent.save();
};

export const listEvents = async () => {
    return await EventModel.find({}).sort({ createdAt: -1 }).exec();
};

export const getEventById = async (eventId: string) => {
    const event = await EventModel.findOne({ eventId }).exec();
    if (!event) {
        throw new EventNotFoundError(eventId);
    }
    return event;
};

/**
 * Agrega un nuevo ítem dinámico al paquete de un evento
 */
export const addPackageItemToEvent = async (
    eventId: string,
    itemInput: AddPackageItemInput
) => {
    const event = await getEventById(eventId);

    const newItem: IEventPackageItem = {
        itemId:
            itemInput.itemId?.trim() ||
            `item-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        concept: itemInput.concept.trim(),
        price: itemInput.price,
        paidAmount: 0,
        isPaid: false,
        delivered: false
    };

    event.packageItems.push(newItem);
    recalculateEventFinancials(event);
    return await event.save();
};

/**
 * Elimina un ítem dinámico del paquete del evento
 */
export const removePackageItemFromEvent = async (
    eventId: string,
    itemId: string
) => {
    const event = await getEventById(eventId);
    event.packageItems = event.packageItems.filter(
        (it) => it.itemId !== itemId
    );
    recalculateEventFinancials(event);
    return await event.save();
};

/**
 * Alterna el estado de entrega de un ítem específico del paquete
 */
export const togglePackageItemDelivered = async (
    eventId: string,
    itemId: string
) => {
    const event = await getEventById(eventId);
    const target = event.packageItems.find((it) => it.itemId === itemId);
    if (target) {
        target.delivered = !target.delivered;
    }
    return await event.save();
};

/**
 * Registra un depósito / pago (general o para una cosa específica del paquete)
 */
export const addDepositToEvent = async (
    eventId: string,
    depositInput: AddDepositInput
) => {
    const event = await getEventById(eventId);

    event.deposits.push({
        depositId: `dep-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        amount: depositInput.amount,
        date:
            depositInput.date?.trim() ||
            new Date().toISOString().slice(0, 10),
        method: depositInput.method || "Transferencia",
        targetItemId: depositInput.targetItemId,
        note: depositInput.note || ""
    });

    recalculateEventFinancials(event);
    return await event.save();
};

/**
 * Actualiza la etapa del evento (Ej: pasar de "En Paquetes y Pagos" a "En Etapa de Entrega" o "Finalizado")
 */
export const updateEventStage = async (
    eventId: string,
    input: UpdateEventStageInput
) => {
    const event = await getEventById(eventId);
    event.stage = input.stage;
    if (input.location !== undefined) event.location = input.location;
    if (input.eventDate !== undefined) event.eventDate = input.eventDate;
    if (input.packageName !== undefined) event.packageName = input.packageName;

    return await event.save();
};

/**
 * Actualiza el control de la Etapa de Entrega (fotos entregadas, link, entregables físicos, saldo de dinero)
 */
export const updateEventDelivery = async (
    eventId: string,
    input: UpdateDeliveryInput
) => {
    const event = await getEventById(eventId);

    if (input.photosToDeliver !== undefined) {
        event.delivery.photosToDeliver = input.photosToDeliver;
    }
    if (input.photosDelivered !== undefined) {
        event.delivery.photosDelivered = input.photosDelivered;
    }
    if (input.deliveryLink !== undefined) {
        event.delivery.deliveryLink = input.deliveryLink;
    }
    if (input.physicalDeliverables !== undefined) {
        event.delivery.physicalDeliverables = input.physicalDeliverables;
    }
    if (input.isPhotosDelivered !== undefined) {
        event.delivery.isPhotosDelivered = input.isPhotosDelivered;
        if (input.isPhotosDelivered && !event.delivery.deliveredAt) {
            event.delivery.deliveredAt = new Date().toISOString();
        }
    }
    if (input.isMoneySettled !== undefined) {
        event.delivery.isMoneySettled = input.isMoneySettled;
    }
    if (input.deliveryNotes !== undefined) {
        event.delivery.deliveryNotes = input.deliveryNotes;
    }

    if (
        input.advanceStageToFinalizado ||
        (event.delivery.isPhotosDelivered && event.delivery.isMoneySettled)
    ) {
        event.stage = "Finalizado";
    } else if (event.stage === "En Paquetes y Pagos") {
        event.stage = "En Etapa de Entrega";
    }

    return await event.save();
};

export const deleteEvent = async (eventId: string) => {
    const event = await EventModel.findOneAndDelete({ eventId }).exec();
    if (!event) {
        throw new EventNotFoundError(eventId);
    }
};

