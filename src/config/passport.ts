import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import User from "../modules/user/user.model";
import { UserStatus } from "../modules/user/user.interfaces";

passport.use(
  "user-local",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: false,
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({
          email: email.trim().toLowerCase(),
        }).select("+password");

        if (!user) {
          return done(null, false, {
            message: "Invalid email or password",
          });
        }

        if (user.isActive !== UserStatus.ACTIVE) {
          return done(null, false, {
            message: "Your account is inactive",
          });
        }

        const isPasswordValid = await bcrypt.compare(
          password,
          user.password,
        );

        if (!isPasswordValid) {
          return done(null, false, {
            message: "Invalid email or password",
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.log(error);
    done(error);
  }
});