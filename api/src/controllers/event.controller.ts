import type { RequestHandler } from "express";
import {
    eventItemParamsSchema,
    eventParamsSchema
} from "../schemas/event.schema";
import * as eventService from "../services/event.service";

type EventParams = { eventId: string };
type EventItemParams = { eventId: string; itemId: string };

export const createEvent: RequestHandler = async (req, res, next) => {
    try {
        const event = await eventService.createEvent(req.body);
        res.status(201).json(event);
    } catch (error) {
        next(error);
    }
};

export const listEvents: RequestHandler = async (_req, res, next) => {
    try {
        const events = await eventService.listEvents();
        res.json({ data: events });
    } catch (error) {
        next(error);
    }
};

export const getEvent: RequestHandler<EventParams> = async (req, res, next) => {
    const parsed = eventParamsSchema.safeParse(req.params);
    if (!parsed.success) {
        res.status(400).json({ message: "Identificador de evento inválido" });
        return;
    }

    try {
        const event = await eventService.getEventById(parsed.data.eventId);
        res.json(event);
    } catch (error) {
        next(error);
    }
};

export const addPackageItem: RequestHandler<EventParams> = async (
    req,
    res,
    next
) => {
    const parsed = eventParamsSchema.safeParse(req.params);
    if (!parsed.success) {
        res.status(400).json({ message: "Identificador de evento inválido" });
        return;
    }

    try {
        const event = await eventService.addPackageItemToEvent(
            parsed.data.eventId,
            req.body
        );
        res.status(201).json(event);
    } catch (error) {
        next(error);
    }
};

export const removePackageItem: RequestHandler<EventItemParams> = async (
    req,
    res,
    next
) => {
    const parsed = eventItemParamsSchema.safeParse(req.params);
    if (!parsed.success) {
        res.status(400).json({ message: "Parámetros inválidos" });
        return;
    }

    try {
        const event = await eventService.removePackageItemFromEvent(
            parsed.data.eventId,
            parsed.data.itemId
        );
        res.json(event);
    } catch (error) {
        next(error);
    }
};

export const togglePackageItemDelivered: RequestHandler<EventItemParams> = async (
    req,
    res,
    next
) => {
    const parsed = eventItemParamsSchema.safeParse(req.params);
    if (!parsed.success) {
        res.status(400).json({ message: "Parámetros inválidos" });
        return;
    }

    try {
        const event = await eventService.togglePackageItemDelivered(
            parsed.data.eventId,
            parsed.data.itemId
        );
        res.json(event);
    } catch (error) {
        next(error);
    }
};

export const addDeposit: RequestHandler<EventParams> = async (req, res, next) => {
    const parsed = eventParamsSchema.safeParse(req.params);
    if (!parsed.success) {
        res.status(400).json({ message: "Identificador de evento inválido" });
        return;
    }

    try {
        const event = await eventService.addDepositToEvent(
            parsed.data.eventId,
            req.body
        );
        res.status(201).json(event);
    } catch (error) {
        next(error);
    }
};

export const updateEventStage: RequestHandler<EventParams> = async (
    req,
    res,
    next
) => {
    const parsed = eventParamsSchema.safeParse(req.params);
    if (!parsed.success) {
        res.status(400).json({ message: "Identificador de evento inválido" });
        return;
    }

    try {
        const event = await eventService.updateEventStage(
            parsed.data.eventId,
            req.body
        );
        res.json(event);
    } catch (error) {
        next(error);
    }
};

export const updateEventDelivery: RequestHandler<EventParams> = async (
    req,
    res,
    next
) => {
    const parsed = eventParamsSchema.safeParse(req.params);
    if (!parsed.success) {
        res.status(400).json({ message: "Identificador de evento inválido" });
        return;
    }

    try {
        const event = await eventService.updateEventDelivery(
            parsed.data.eventId,
            req.body
        );
        res.json(event);
    } catch (error) {
        next(error);
    }
};

export const deleteEvent: RequestHandler<EventParams> = async (req, res, next) => {
    const parsed = eventParamsSchema.safeParse(req.params);
    if (!parsed.success) {
        res.status(400).json({ message: "Identificador de evento inválido" });
        return;
    }

    try {
        await eventService.deleteEvent(parsed.data.eventId);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

