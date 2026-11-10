import mongoose, { Schema, Document } from "mongoose";

export type EventProcessStage =
    | "Evento Confirmado"
    | "En Paquetes y Pagos"
    | "En Etapa de Entrega"
    | "Finalizado";

export interface IEventClientSnapshot {
    clientId: string;
    name: string;
    email: string;
    phone: string;
}

export interface IEventPackageItem {
    itemId: string;
    concept: string;
    price: number;
    paidAmount: number;
    isPaid: boolean;
    delivered: boolean;
}

export interface IEventDeposit {
    depositId: string;
    amount: number;
    date: string;
    method: string;
    targetItemId?: string | undefined;
    note: string;
}

export interface IEventDelivery {
    photosToDeliver: number;
    photosDelivered: number;
    deliveryLink: string;
    physicalDeliverables: string;
    isPhotosDelivered: boolean;
    isMoneySettled: boolean;
    deliveryNotes: string;
    deliveredAt?: string | undefined;
}

export interface IEvent extends Document {
    eventId: string;
    budgetId?: string | undefined;
    title: string;
    eventType: string;
    eventDate: string;
    location: string;
    stage: EventProcessStage;
    client: IEventClientSnapshot;
    packageName: string;
    packageItems: IEventPackageItem[];
    deposits: IEventDeposit[];
    totalPackageAmount: number;
    totalPaidAmount: number;
    pendingBalance: number;
    delivery: IEventDelivery;
    createdAt: Date;
    updatedAt: Date;
}

const eventClientSchema = new Schema<IEventClientSnapshot>({
    clientId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" }
}, { _id: false });

const eventPackageItemSchema = new Schema<IEventPackageItem>({
    itemId: { type: String, required: true },
    concept: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    paidAmount: { type: Number, default: 0, min: 0 },
    isPaid: { type: Boolean, default: false },
    delivered: { type: Boolean, default: false }
}, { _id: false });

const eventDepositSchema = new Schema<IEventDeposit>({
    depositId: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    date: { type: String, required: true },
    method: { type: String, default: "Transferencia" },
    targetItemId: { type: String },
    note: { type: String, default: "" }
}, { _id: false });

const eventDeliverySchema = new Schema<IEventDelivery>({
    photosToDeliver: { type: Number, default: 100, min: 0 },
    photosDelivered: { type: Number, default: 0, min: 0 },
    deliveryLink: { type: String, default: "" },
    physicalDeliverables: { type: String, default: "" },
    isPhotosDelivered: { type: Boolean, default: false },
    isMoneySettled: { type: Boolean, default: false },
    deliveryNotes: { type: String, default: "" },
    deliveredAt: { type: String }
}, { _id: false });

const eventSchema: Schema<IEvent> = new Schema<IEvent>({
    eventId: { type: String, unique: true, required: true, trim: true },
    budgetId: { type: String },
    title: { type: String, required: true, trim: true },
    eventType: { type: String, required: true, trim: true },
    eventDate: { type: String, default: "" },
    location: { type: String, required: true, trim: true },
    stage: {
        type: String,
        enum: [
            "Evento Confirmado",
            "En Paquetes y Pagos",
            "En Etapa de Entrega",
            "Finalizado"
        ],
        default: "En Paquetes y Pagos"
    },
    client: { type: eventClientSchema, required: true },
    packageName: { type: String, required: true, trim: true },
    packageItems: { type: [eventPackageItemSchema], default: [] },
    deposits: { type: [eventDepositSchema], default: [] },
    totalPackageAmount: { type: Number, default: 0, min: 0 },
    totalPaidAmount: { type: Number, default: 0, min: 0 },
    pendingBalance: { type: Number, default: 0, min: 0 },
    delivery: { type: eventDeliverySchema, default: () => ({}) }
}, {
    timestamps: true,
    versionKey: false
});

export default mongoose.model<IEvent>("Event", eventSchema);

