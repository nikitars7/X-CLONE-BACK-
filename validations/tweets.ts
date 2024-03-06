import { body } from "express-validator";

export const createTweetValidations = [
  body("text", "Enter your text")
    .isString()
    .isLength({ max: 280 })
    .withMessage("Message can not be more than 280 characters in length"),
];
