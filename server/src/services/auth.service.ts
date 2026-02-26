import { getJWT, getPasswordHash, validatePassword } from "../utils/auth.utils";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class AuthServices {
  static async registerService(
    name: string,
    email: string,
    password: string
  ) {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await getPasswordHash(password);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword as string,
      },
    });

    const token = await getJWT(newUser.id as string, newUser.email);

    return {
      user: newUser,
      token,
    };
  }

  static async loginService(email: string,
    password: string) {
        const user = await prisma.user.findUnique({
            where: { email },
          });
        
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
        
          const token = await getJWT(user.id as string, user.email);
        
          return {
            user,
            token,
          };
  }
}