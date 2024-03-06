import { model, Schema, Document } from "mongoose";
import { IUserModel } from "./UserModel";

export interface ITweetModel {
  _id?: string;
  text: string;
  user: IUserModel | Schema.Types.ObjectId;
}

const TweetSchema = new Schema<ITweetModel>({
  text: {
    type: String,
    required: true,
    maxlength: 280,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const TweetModel = model<ITweetModel>("Tweet", TweetSchema);
export default TweetModel;
