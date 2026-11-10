import app from "./app";
import { config } from "./config/config";
import { connectDB } from "./config/database";

const startServer = async (): Promise<void> => {
    await connectDB();
    app.listen(config.port, () => {
        console.log(`API escuchando en el puerto ${config.port}`);
    });
};

startServer().catch((error: unknown) => {
    console.error("No se pudo iniciar la API", error);
    process.exitCode = 1;
});