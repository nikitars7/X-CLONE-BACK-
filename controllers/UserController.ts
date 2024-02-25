import express from "express";
import UserModel from "../models/UserModel";
import { validationResult } from "express-validator";
import { generateHash } from "../utils/generateHash";
import { sendEmail } from "../utils/sendMail";
class UserController {
  async index(req: express.Request, res: express.Response): Promise<void> {
    try {
      const users = await UserModel.find({}).exec();
      if (!users) {
        throw new Error("Users were not found");
      }
      res.json({
        status: "success",
        data: users,
      });
    } catch (e) {
      res.status(500).json(e);
    }
  }
  async create(req: express.Request, res: express.Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Error occured during register", errors });
      }
      const { username } = req.body;
      const candidate = await UserModel.findOne({ username });
      if (candidate) {
        return res.status(400).json({ message: "username is already in use" });
      }
      const data = {
        email: req.body.email,
        fullname: req.body.fullname,
        username: req.body.username,
        password: req.body.password,
        confirm_hash: generateHash(
          process.env.SECRET_KEY || Math.random().toString()
        ),
      };
      const user = await UserModel.create(data);
      sendEmail(
        {
          emailFrom: "admin@x-clone.com",
          emailTo: data.email,
          subject: "Confirmation message X-clone",
          html: `To confirm your E-mail , go to <a href="http://localhost:${
            process.env.PORT || 8888
          }/users/verify?hash=${data.confirm_hash}">this link</a> `,
        },
        (err: Error | null) => {
          if (err) {
            res.json({ status: "error", message: err });
          } else {
            res.json({
              message: "user has been successfully registered",
              data: user,
            });
          }
        }
      );
    } catch (e) {
      res.status(500).json(e);
    }
  }
  async verify(req: express.Request, res: express.Response): Promise<void> {
    try {
      const hash = req.query.hash;
      if (!hash) {
        res.status(400).send();
        return;
      }
      const user = await UserModel.findOne({ confirm_hash: hash }).exec();
      if (!user) {
        throw new Error("User were not found");
      }
      user.confirmed = true;
      user.save();
      res.json({
        status: "success",
      });
    } catch (e) {
      res.status(500).json(e);
    }
  }
}

export default new UserController();
