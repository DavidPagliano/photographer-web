import { Router } from "express";
import * as budgetController from "../controllers/budget.controller";
import { validateBody } from "../middlewares/validate";
import {
    advanceBudgetToEventSchema,
    createBudgetSchema,
    updateBudgetSchema
} from "../schemas/budget.schema";

const router = Router();

router.post("/", validateBody(createBudgetSchema), budgetController.createBudget);
router.get("/", budgetController.listBudgets);
router.get("/:budgetId", budgetController.getBudget);
router.put("/:budgetId", validateBody(updateBudgetSchema), budgetController.updateBudget);
router.post(
    "/:budgetId/advance-to-event",
    validateBody(advanceBudgetToEventSchema),
    budgetController.advanceBudgetToEvent
);
router.delete("/:budgetId", budgetController.deleteBudget);

export default router;

