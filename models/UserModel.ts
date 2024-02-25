import { model, Schema } from "mongoose";
interface IUserModel {
  email: string;
  fullname: string;
  username: string;
  password: string;
  confirm_hash: string;
  location?: string;
  confirmed: boolean;
  about?: string;
  website?: string;
}
const UserSchema = new Schema<IUserModel>({
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
});

const UserModel = model<IUserModel>("User", UserSchema);
export default UserModel;
