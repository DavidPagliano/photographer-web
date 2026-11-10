import type { RequestHandler } from "express";
import { clientParamsSchema } from "../schemas/client.schema";
import * as clientService from "../services/client.service";

type ClientParams = { clientId: string };

export const createClient: RequestHandler = async (req, res, next) => {
    try {
        const client = await clientService.createClient(req.body);
        res.status(201).json(client);
    } catch (error) {
        next(error);
    }
};

export const listClients: RequestHandler = async (_req, res, next) => {
    try {
        const clients = await clientService.listClients();
        res.json({ data: clients });
    } catch (error) {
        next(error);
    }
};

export const getClient: RequestHandler<ClientParams> = async (req, res, next) => {
    const parsed = clientParamsSchema.safeParse(req.params);
    if (!parsed.success) {
        res.status(400).json({ message: "Identificador de cliente inválido" });
        return;
    }

    try {
        const client = await clientService.getClientById(parsed.data.clientId);
        res.json(client);
    } catch (error) {
        next(error);
    }
};

export const updateClient: RequestHandler<ClientParams> = async (req, res, next) => {
    const parsed = clientParamsSchema.safeParse(req.params);
    if (!parsed.success) {
        res.status(400).json({ message: "Identificador de cliente inválido" });
        return;
    }

    try {
        const client = await clientService.updateClient(parsed.data.clientId, req.body);
        res.json(client);
    } catch (error) {
        next(error);
    }
};

export const deleteClient: RequestHandler<ClientParams> = async (req, res, next) => {
    const parsed = clientParamsSchema.safeParse(req.params);
    if (!parsed.success) {
        res.status(400).json({ message: "Identificador de cliente inválido" });
        return;
    }

    try {
        await clientService.deleteClient(parsed.data.clientId);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

