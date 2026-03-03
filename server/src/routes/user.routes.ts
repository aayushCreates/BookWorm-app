import { Router } from "express";
import { isUserLoggedIn } from "../middlewares/auth.middleware";
import {
  followUser,
  myProfile,
  removeSavedBook,
  savedBooks,
  unfollowUser,
  userProfile,
  updateProfile
} from "../controllers/user.controller";
import upload from "../middlewares/upload.middleware";

const userRouter = Router();

userRouter.get("/me", isUserLoggedIn, myProfile);
userRouter.patch("/me", isUserLoggedIn, upload.single("avatar"), updateProfile);

userRouter.get("/save/books", isUserLoggedIn, savedBooks);

userRouter.get("/:id", isUserLoggedIn, userProfile);

userRouter.post("/follow/:id", isUserLoggedIn, followUser);
userRouter.post("/unfollow/:id", isUserLoggedIn, unfollowUser);

userRouter.delete("/save/:id", isUserLoggedIn, removeSavedBook);

export default userRouter;
