import Router from "express";
import UserController from "../controllers/UserController";
import { registerValidations } from "../validations/register";
import { passport } from "../core/passport";
import TweetsController from "../controllers/TweetsController";
import { createTweetValidations } from "../validations/tweets";
export const router = Router();
router.get("/users", UserController.index);
router.get(
  "/users/me",
  passport.authenticate("jwt", { session: false }),
  UserController.getUserData
);
router.get("/users/:id", UserController.show);
router.post("/auth/signup", registerValidations, UserController.create);
router.get("/auth/verify", registerValidations, UserController.verify);
router.post(
  "/auth/signin",
  passport.authenticate("local", { session: false }),
  UserController.loginToken
);

router.get("/tweets", TweetsController.index);
router.get("/tweets/:id", TweetsController.show);
router.delete(
  "/tweets/:id",
  passport.authenticate("jwt", { session: false }),
  TweetsController.delete
);
router.put(
  "/tweets",
  passport.authenticate("jwt", { session: false }),
  createTweetValidations,
  TweetsController.update
);
router.post(
  "/tweets",
  passport.authenticate("jwt", { session: false }),
  createTweetValidations,
  TweetsController.create
);
