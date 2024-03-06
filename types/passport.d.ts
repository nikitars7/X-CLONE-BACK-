import { IUserModel } from "../models/UserModel";

declare module "passport" {
  interface Authenticator {
    serializeUser<TID>(
      fn: (user: IUserModel, done: (err: any, id?: TID) => void) => void
    ): void;
  }
}
