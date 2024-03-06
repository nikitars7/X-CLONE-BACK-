import express from "express";
import TweetModel, { ITweetModel } from "../models/TweetModel";
import { isValidObjectId } from "../utils/isValidObjid";
import { validationResult } from "express-validator";
import { IUserModel } from "../models/UserModel";

class TweetsController {
  async index(req: express.Request, res: express.Response): Promise<void> {
    try {
      const tweets = await TweetModel.find({}).exec();
      if (!tweets) {
        throw new Error("Tweets were not found");
      }
      res.json({
        status: "success",
        data: tweets,
      });
    } catch (e) {
      res.status(500).json(e);
    }
  }
  async show(req: express.Request, res: express.Response): Promise<void> {
    try {
      const tweetId = req.params.id;
      if (!isValidObjectId(tweetId)) {
        res.status(404).json({ message: "Error" });
      }
      const tweet = await TweetModel.findById(tweetId).exec();
      if (!tweet) {
        throw new Error("User was not found");
      }
      res.json({
        status: "success",
        data: tweet,
      });
    } catch (e) {
      res.status(500).json(e);
    }
  }
  async create(req: express.Request, res: express.Response) {
    try {
      const user = req.user as IUserModel;
      if (!user) {
        throw new Error("User was not found");
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Error occured during register", errors });
      }
      const data: ITweetModel = {
        text: req.body.text,
        user: user._id,
      };
      const tweet = await TweetModel.create(data);
      res.json({
        status: "success",
        tweet,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error occured" });
    }
  }
  async delete(req: express.Request, res: express.Response) {
    try {
      const user = req.user as IUserModel;
      if (user) {
        const tweetId = req.params.id;
        if (!isValidObjectId(tweetId)) {
          res.status(404).json({ message: "Error" });
        }
        const tweet = await TweetModel.findById(tweetId);
        if (tweet) {
          if (tweet.user.toString() === user._id.toString()) {
            const tweet = await TweetModel.findByIdAndDelete(tweetId);
            return res.json(tweet);
          } else {
            res.status(403).send();
          }
        } else {
          res.status(404).send();
        }
      }
    } catch (error) {
      res.status(500).json({ message: "Error occured" });
    }
  }
  async update(req: express.Request, res: express.Response) {
    try {
      const user = req.user as IUserModel;
      console.log(user);
      if (user) {
        const tweet = req.body;
        if (!tweet._id) {
          throw new Error("tweet is not found");
        }
        if (tweet.user.toString() === user._id.toString()) {
          const updatedTweet = await TweetModel.findByIdAndUpdate(
            tweet._id,
            tweet,
            {
              new: true,
            }
          );
          return res.json(updatedTweet);
        } else {
          res.status(403).send();
        }
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new TweetsController();
