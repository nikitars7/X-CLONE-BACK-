import Router from "express";
import UserController from "../controllers/UserController";
import { registerValidations } from "../validations/register";
export const router = Router();
router.get("/users", UserController.index);
router.post("/users", registerValidations, UserController.create);
router.get("/users/verify", registerValidations, UserController.verify);
