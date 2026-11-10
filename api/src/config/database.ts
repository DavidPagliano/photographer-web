import mongoose from "mongoose";
import { config } from "./config";
import project from "../models/project";

export const connectDB = async () => {
    try {
        const db = await mongoose.connect(config.mongoDB);

        const dbName = db.connection.db?.databaseName;
        console.log(`✅ Conectado a: ${dbName}`);

        if (!db.connection.db) {
            throw new Error("La base no está disponible");
        }

        const collections = await db.connection.db?.listCollections().toArray();
        collections?.forEach(c => console.log("📂", c.name));
        const names = collections?.map(c => c.name) || [];

        const expected = [
            'projects'
        ];

        const missing = expected.filter(name => !names.includes(name));

        /* ---- Crear colecciones que no existan ---- */
        if (missing.length > 0) {
            console.log(`🚧 Creando: ${missing.join(', ')}`);

            if (missing.includes('projects')) await project.init();
        } else {
            console.log(`✅ Todas las colecciones ya existen en ${dbName}`);
        }

        /* ---- Verificar si tienen data o están vacías ---- */
        console.log(`\n📊 Estado de las colecciones en ${dbName}:\n`);

        const collectionStatus = [];

        for (const name of expected) {
            const exists = (collections || []).some(c => c.name === name);

            let count = 0;

            if (exists) {
                count = await db.connection.db
                    ?.collection(name)
                    .countDocuments() || 0;
            }

            collectionStatus.push({
                Colección: name,
                Existe: exists ? '✅ Sí' : '❌ No',
                Estado: exists
                    ? count > 0
                        ? '✅ Con datos'
                        : '📭 Vacía'
                    : '—',
                Registros: exists ? count : '—'
            });
        }

        console.table(collectionStatus);

        console.log("\n✅ MongoDB listo y verificado");

    } catch (error) {
        throw error;
    }
}