import mongoose, { Schema, Document, Types } from "mongoose";
import bcrypt from 'bcryptjs';
export interface IUser extends Document {
    nombre: string;
    email: string,
    passwordHash: string,
    role: "admin" | "user";
    refreshToken: string[];
    sessions: Array<{
        _id: Types.ObjectId;
        token: string;
        deviceInfo: string;
        ip: string;
        createdAt: Date;
    }>;
    resetPasswordToken?: string | undefined;
    resetPasswordExpires?: Date | undefined;
    comparePassword(password: string): Promise<boolean>;
}

const userSchema: Schema = new Schema({
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    refreshToken: [{ type: String }],
    sessions: [{
        _id: { type: Schema.Types.ObjectId, default: () => new Types.ObjectId() },
        token: String,
        deviceInfo: String, // Ej: "Chrome en Windows"
        ip: String,
        createdAt: { type: Date, default: Date.now }
    }],
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
});

// Agregamos el método al esquema
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    // 'this.passwordHash' es el hash guardado en la base de datos
    return await bcrypt.compare(password, this.passwordHash);
};

export default mongoose.model<IUser>('User', userSchema);