import { Router } from "express";
import { isUserLoggedIn } from "../middlewares/auth.middleware";
import { userProfile } from "../controllers/user.controller";

const userRouter = Router();

userRouter.get('/:id', isUserLoggedIn, userProfile);

export default userRouter;