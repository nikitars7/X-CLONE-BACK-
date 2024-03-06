import passport from "passport";
import bcrypt from "bcrypt";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import UserModel, { IUserModel } from "../models/UserModel";
passport.use(
  new LocalStrategy(async (username, password, done): Promise<void> => {
    try {
      const user = await UserModel.findOne({
        $or: [{ email: username }, { username }],
      }).exec();
      if (!user) {
        return done(null, false);
      }
      const storedHashedPassword = user.password;
      const isPasswordValid = await bcrypt.compare(
        password,
        storedHashedPassword
      );
      if (isPasswordValid) {
        done(null, user);
      } else {
        done(null, false);
      }
    } catch (err) {
      done(err, false);
    }
  })
);
passport.serializeUser((user: IUserModel, done) => {
  done(null, user?._id);
});

passport.deserializeUser((id, done) => {
  UserModel.findById(id, (err: any, user: IUserModel) => {
    done(err, user);
  });
});

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: (process.env.SECRET_KEY as string) || "123",
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const user = await UserModel.findById(payload._doc._id).exec();
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      done(error, false);
    }
  })
);
export { passport };
