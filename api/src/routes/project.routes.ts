import { Router } from "express";
import * as projectController from "../controllers/project.controller";
import { validateBody } from "../middlewares/validate";
import {
    createProjectSchema,
    updateProjectSchema
} from "../schemas/project.schema";

const router = Router();

router.post("/", validateBody(createProjectSchema), projectController.createProject);
router.get("/", projectController.listProjects);
router.get("/:projectId", projectController.getProject);
router.put("/:projectId", validateBody(updateProjectSchema), projectController.updateProject);
router.delete("/:projectId", projectController.deleteProject);

export default router;
