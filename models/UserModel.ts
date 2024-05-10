import { model, Schema } from "mongoose";
interface IDate {
  day: number;
  month: number;
  year: number;
}
export interface IUserModel {
  _id: Schema.Types.ObjectId;
  email: string;
  fullname: string;
  username: string;
  password: string;
  birthdate: IDate;
  confirm_hash: string;
  location?: string;
  confirmed: boolean;
  about?: string;
  website?: string;
}
const UserSchema = new Schema<IUserModel>(
  {
    email: {
      unique: true,
      type: String,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    username: {
      unique: true,
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    birthdate: {
      type: Object,
      day: { type: Number, required: true },
      month: { type: Number, required: true },
      year: { type: Number, required: true },
    },
    confirm_hash: {
      required: true,
      type: String,
    },
    location: {
      type: String,
    },

    confirmed: {
      type: Boolean,
      default: false,
    },
    about: String,
    website: String,
  },
  { timestamps: true }
);

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.confirm_hash;
  return userObject;
};

const UserModel = model<IUserModel>("User", UserSchema);
export default UserModel;
