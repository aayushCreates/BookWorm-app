import { getJWT, getPasswordHash, validatePassword } from "../utils/auth.utils";
import User from "../models/user.model";

export default class AuthServices {
  static async registerService(
    name: string,
    email: string,
    password: string
  ) {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await getPasswordHash(password);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword as string,
    });

    const token = await getJWT((newUser._id).toString(), newUser.email);

    return {
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
      },
      token,
    };
  }

  static async loginService(email: string, password: string) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await validatePassword(
      password,
      user.password
    );

    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    const token = await getJWT((user._id).toString(), user.email);

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      token,
    };
  }
}
