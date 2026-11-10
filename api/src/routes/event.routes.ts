import { Router } from "express";
import * as eventController from "../controllers/event.controller";
import { validateBody } from "../middlewares/validate";
import {
    addDepositInputSchema,
    createEventSchema,
    eventPackageItemInputSchema,
    updateDeliveryInputSchema,
    updateEventStageSchema
} from "../schemas/event.schema";

const router = Router();

router.post("/", validateBody(createEventSchema), eventController.createEvent);
router.get("/", eventController.listEvents);
router.get("/:eventId", eventController.getEvent);
router.patch(
    "/:eventId/stage",
    validateBody(updateEventStageSchema),
    eventController.updateEventStage
);
router.post(
    "/:eventId/package-items",
    validateBody(eventPackageItemInputSchema),
    eventController.addPackageItem
);
router.delete(
    "/:eventId/package-items/:itemId",
    eventController.removePackageItem
);
router.patch(
    "/:eventId/package-items/:itemId/toggle-delivered",
    eventController.togglePackageItemDelivered
);
router.post(
    "/:eventId/deposits",
    validateBody(addDepositInputSchema),
    eventController.addDeposit
);
router.put(
    "/:eventId/delivery",
    validateBody(updateDeliveryInputSchema),
    eventController.updateEventDelivery
);
router.delete("/:eventId", eventController.deleteEvent);

export default router;

