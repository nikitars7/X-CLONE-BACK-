import express from "express";
import UserModel, { IUserModel } from "../models/UserModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { generateHash } from "../utils/generateHash";
import { sendEmail } from "../utils/sendMail";
import { isValidObjectId } from "../utils/isValidObjid";
const generateAccessToken = (user: IUserModel) => {
  const payload = {
    ...user,
  };
  return jwt.sign(payload, (process.env.SECRET_KEY as string) || "123", {
    expiresIn: "24h",
  });
};
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
  async show(req: express.Request, res: express.Response): Promise<void> {
    try {
      const userId = req.params.id;
      if (!isValidObjectId(userId)) {
        res.status(404).json({ message: "Error" });
      }
      const user = await UserModel.findById(userId).exec();
      if (!user) {
        throw new Error("User was not found");
      }
      res.json({
        status: "success",
        data: user,
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
      const salt = await bcrypt.genSalt(15);
      const hashPassword = bcrypt.hashSync(req.body.password, salt);
      const data = {
        email: req.body.email,
        fullname: req.body.fullname,
        username: req.body.username,
        birthdate: req.body.birthdate,
        password: hashPassword,
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
          }/x-clone/auth/verify?hash=${data.confirm_hash}">this link</a> `,
        },
        (err: Error | null) => {
          if (err) {
            res.status(500).json({ status: "error", message: err });
          } else {
            res.json({
              message: "user has been successfully registered",
              data: user,
            });
          }
        }
      );
    } catch (e) {
      res.status(500).json({ message: "Error occured" });
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
      // await
      user.save();
      res.json({
        status: "success",
      });
    } catch (e) {
      res.status(500).json(e);
    }
  }
  async loginToken(req: express.Request, res: express.Response): Promise<void> {
    try {
      if (!req.user) {
        throw new Error("Error");
      }
      res.json({
        status: "success",
        data: {
          user: req.user,
          token: generateAccessToken(req.user as IUserModel),
        },
      });
    } catch (e) {
      res.status(500).json(e);
    }
  }
  async getUserData(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      if (!req.user) {
        throw new Error("Error");
      }
      res.json({
        status: "success",
        data: req.user,
      });
    } catch (e) {
      res.status(500).json(e);
    }
  }
}

export default new UserController();
