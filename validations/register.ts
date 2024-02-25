import { body } from "express-validator";
import UserModel from "../models/UserModel";

export const registerValidations = [
  body("email", "Enter your E-mail")
    .isEmail()
    .withMessage("Incorrect E-mail")
    .isString()
    .isLength({ min: 10, max: 40 })
    .withMessage("Incorrect E-mail length")
    .custom(async (value) => {
      const existingUser = await UserModel.findOne({ email: value }).exec();
      if (existingUser) {
        throw new Error("E-mail already in use");
      }
    }),
  body("fullname", "Enter your name")
    .isString()
    .isLength({ min: 2, max: 40 })
    .withMessage("Incorrect name length"),
  body("username", "Enter your login")
    .isString()
    .isLength({ min: 2, max: 40 })
    .withMessage("Incorrect login length"),
  body("password", "Enter your password")
    .isString()
    .isLength({ min: 6 })
    .withMessage(
      "Incorrect password length , password should be at least 6 characters"
    )
    .custom((value, { req }) => {
      if (value !== req.body.password2) {
        throw new Error("Passwords are not the same ");
      } else {
        return value;
      }
    }),
];
