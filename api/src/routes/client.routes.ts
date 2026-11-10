import { Router } from "express";
import * as clientController from "../controllers/client.controller";
import { validateBody } from "../middlewares/validate";
import {
    createClientSchema,
    updateClientSchema
} from "../schemas/client.schema";

const router = Router();

router.post("/", validateBody(createClientSchema), clientController.createClient);
router.get("/", clientController.listClients);
router.get("/:clientId", clientController.getClient);
router.put("/:clientId", validateBody(updateClientSchema), clientController.updateClient);
router.delete("/:clientId", clientController.deleteClient);

export default router;

