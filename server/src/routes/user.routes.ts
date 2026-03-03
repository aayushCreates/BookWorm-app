import { Router } from "express";
import { isUserLoggedIn } from "../middlewares/auth.middleware";
import { followUser, unfollowUser, userProfile } from "../controllers/user.controller";

const userRouter = Router();

userRouter.get('/:id', isUserLoggedIn, userProfile);
userRouter.post('/:id/follow', isUserLoggedIn, followUser);
userRouter.post('/:id/unfollow', isUserLoggedIn, unfollowUser);

export default userRouter;