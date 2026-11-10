import Client from "../models/client";
import type { CreateClientInput, UpdateClientInput } from "../schemas/client.schema";

export class ClientNotFoundError extends Error {
    constructor(clientId: string) {
        super(`No se encontró el cliente '${clientId}'`);
        this.name = "ClientNotFoundError";
    }
}

export class ClientConflictError extends Error {
    constructor() {
        super("Ya existe un cliente con ese identificador o correo electrónico");
        this.name = "ClientConflictError";
    }
}

export const findOrCreateClientByEmail = async (data: {
    clientId?: string | undefined;
    name: string;
    email: string;
    phone?: string | undefined;
}) => {
    const normalizedEmail = data.email.trim().toLowerCase();
    const existing = await Client.findOne({ email: normalizedEmail }).exec();

    if (existing) {
        if (data.name.trim()) existing.name = data.name.trim();
        if (data.phone?.trim()) existing.phone = data.phone.trim();
        await existing.save();
        return existing;
    }

    const generatedId =
        data.clientId?.trim() ||
        `cli-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

    return await Client.create({
        clientId: generatedId,
        name: data.name.trim(),
        email: normalizedEmail,
        phone: data.phone?.trim() || "",
        notes: ""
    });
};

export const createClient = async (input: CreateClientInput) => {
    const clientId =
        input.clientId?.trim() ||
        `cli-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

    try {
        return await Client.create({
            ...input,
            clientId,
            email: input.email.trim().toLowerCase()
        });
    } catch (error) {
        if (isDuplicateKeyError(error)) {
            throw new ClientConflictError();
        }
        throw error;
    }
};

export const listClients = async () => {
    return await Client.find({}).sort({ createdAt: -1 }).exec();
};

export const getClientById = async (clientId: string) => {
    const client = await Client.findOne({ clientId }).exec();
    if (!client) {
        throw new ClientNotFoundError(clientId);
    }
    return client;
};

export const updateClient = async (clientId: string, input: UpdateClientInput) => {
    const cleanUpdate: Record<string, unknown> = {};
    if (input.name !== undefined) cleanUpdate.name = input.name;
    if (input.email !== undefined) cleanUpdate.email = input.email.toLowerCase();
    if (input.phone !== undefined) cleanUpdate.phone = input.phone;
    if (input.notes !== undefined) cleanUpdate.notes = input.notes;

    const client = await Client.findOneAndUpdate(
        { clientId },
        { $set: cleanUpdate },
        { new: true, runValidators: true }
    ).exec();

    if (!client) {
        throw new ClientNotFoundError(clientId);
    }
    return client;
};

export const deleteClient = async (clientId: string) => {
    const client = await Client.findOneAndDelete({ clientId }).exec();
    if (!client) {
        throw new ClientNotFoundError(clientId);
    }
};

const isDuplicateKeyError = (error: unknown): error is { code: number } =>
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000;

