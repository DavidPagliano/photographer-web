import mongoose, { Schema, Document } from "mongoose";

export type BudgetStatus =
    | "Pendiente"
    | "En revisión"
    | "Aprobado"
    | "Avanzado a Evento"
    | "Rechazado";

export interface IBudgetItem {
    itemId: string;
    concept: string;
    price: number;
}

export interface IBudget extends Document {
    budgetId: string;
    clientId: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    eventType: string;
    eventDate: string;
    location: string;
    estimatedBudget: string;
    items: IBudgetItem[];
    totalAmount: number;
    message: string;
    status: BudgetStatus;
    linkedEventId?: string | undefined;
    createdAt: Date;
    updatedAt: Date;
}

const budgetItemSchema: Schema<IBudgetItem> = new Schema<IBudgetItem>({
    itemId: { type: String, required: true },
    concept: { type: String, required: true },
    price: { type: Number, required: true, min: 0 }
}, { _id: false });

const budgetSchema: Schema<IBudget> = new Schema<IBudget>({
    budgetId: { type: String, unique: true, required: true, trim: true },
    clientId: { type: String, required: true, trim: true },
    clientName: { type: String, required: true, trim: true },
    clientEmail: { type: String, required: true, trim: true, lowercase: true },
    clientPhone: { type: String, default: "", trim: true },
    eventType: { type: String, required: true, trim: true },
    eventDate: { type: String, default: "" },
    location: { type: String, default: "", trim: true },
    estimatedBudget: { type: String, required: true, trim: true },
    items: { type: [budgetItemSchema], default: [] },
    totalAmount: { type: Number, default: 0, min: 0 },
    message: { type: String, required: true, trim: true },
    status: {
        type: String,
        enum: ["Pendiente", "En revisión", "Aprobado", "Avanzado a Evento", "Rechazado"],
        default: "Pendiente"
    },
    linkedEventId: { type: String }
}, {
    timestamps: true,
    versionKey: false
});

export default mongoose.model<IBudget>("Budget", budgetSchema);

