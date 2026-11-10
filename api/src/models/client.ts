import mongoose, { Schema, Document } from "mongoose";

export interface IClient extends Document {
    clientId: string;
    name: string;
    email: string;
    phone: string;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}

const clientSchema: Schema<IClient> = new Schema<IClient>({
    clientId: { type: String, unique: true, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, trim: true, lowercase: true },
    phone: { type: String, default: "", trim: true },
    notes: { type: String, default: "", trim: true }
}, {
    timestamps: true,
    versionKey: false
});

export default mongoose.model<IClient>("Client", clientSchema);

