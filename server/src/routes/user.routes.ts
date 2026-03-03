import { Router } from "express";
import { isUserLoggedIn } from "../middlewares/auth.middleware";
import {
  followUser,
  myProfile,
  removeSavedBook,
  savedBooks,
  unfollowUser,
  userProfile,
} from "../controllers/user.controller";

const userRouter = Router();

userRouter.get("/me", isUserLoggedIn, myProfile);
userRouter.get("/save/books", isUserLoggedIn, savedBooks);

userRouter.get("/:id", isUserLoggedIn, userProfile);

userRouter.post("/follow/:id", isUserLoggedIn, followUser);
userRouter.post("/unfollow/:id", isUserLoggedIn, unfollowUser);

userRouter.patch("/me", isUserLoggedIn, updateProfile);

userRouter.delete("/save/:id", isUserLoggedIn, removeSavedBook);

export default userRouter;
