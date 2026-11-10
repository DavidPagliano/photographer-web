import mongoose, { Schema, Document } from "mongoose";

export interface IImage {
    imageId: string;
    imageName: string;
    imageBase64: string;
}

export interface IProject extends Document {
    projectId: string;
    projectName: string;
    projectDescription: string;
    images: IImage[];
    createdAt: Date;
    updatedAt: Date;
}

const imageSchema: Schema<IImage> = new Schema<IImage>({
    imageId: { type: String, required: true },
    imageName: { type: String, required: true },
    imageBase64: { type: String, required: true }
}, {
    timestamps: true,
    versionKey: false
});

const projectSchema: Schema<IProject> = new Schema<IProject>({
    projectId: { type: String, unique: true, required: true },
    projectName: { type: String, required: true },
    projectDescription: { type: String, required: true },
    images: { type: [imageSchema], default: [] }
}, {
    timestamps: true,
    versionKey: false
});

export default mongoose.model<IProject>("Project", projectSchema);
