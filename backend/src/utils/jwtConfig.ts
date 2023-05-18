import { PrismaClient, User } from "@prisma/client";
import {
  ExtractJwt,
  Strategy as JwtStrategy,
  StrategyOptions,
} from "passport-jwt";

const prisma = new PrismaClient();

// EXLUDE FIELDS FROM PRISMA OBJECT
function exclude<User, Key extends keyof User>(
  user: User,
  keys: Key[]
): Omit<User, Key> {
  for (let key of keys) {
    delete user[key];
  }
  return user;
}

// OPTIONS FOR STRATEGY
const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || "secret",
};

// STRATEGY
export const jwtStrategy = new JwtStrategy(opts, async (payload, done) => {
  try {
    const foundUser: User = await prisma.user.findUniqueOrThrow({
      where: { id: payload.id },
    });

    const user = exclude(foundUser, ["password"]);

    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err, false);
  }
});
