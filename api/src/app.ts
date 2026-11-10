import cors from "cors";
import express from "express";
import helmet from "helmet";
import { config } from "./config/config";
import { errorHandler } from "./middlewares/errorHandler";
import budgetRoutes from "./routes/budget.routes";
import clientRoutes from "./routes/client.routes";
import eventRoutes from "./routes/event.routes";
import projectRoutes from "./routes/project.routes";

const app = express();

app.use(helmet());
app.use(cors({
    origin: [
        config.url_web_dev,
        config.url_web_preview,
        config.url_web_production
    ]
}));
app.use(express.json({ limit: "10mb" }));

app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});

app.use("/api/projects", projectRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/events", eventRoutes);
app.use(errorHandler);

export default app;
