import { Request, Response, NextFunction } from "express";
import { UserServices } from "../services/user.service";

export const userProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params as {
      id: string;
    };

    const profile = await UserServices.getUserProfile(id);

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (err: any) {
    console.error("Fetching User profile error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Fetching User Profile failed",
    });
  }
};

export const myProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req.user as any)._id;
    const profile = await UserServices.getMyProfile(userId.toString());

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      data: profile,
    });
  } catch (err: any) {
    console.error("Fetching My Profile error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Fetching Profile failed",
    });
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req.user as any)._id;
    const { name, email } = req.body;
    const fileData = req.file;

    const profile = await UserServices.updateUserProfile(userId.toString(), {
      name,
      email,
      fileData,
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: profile,
    });
  } catch (err: any) {
    console.error("Updating Profile error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Updating Profile failed",
    });
  }
};

export const followUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: targetUserId } = req.params as { id: string };
    const currentUserId = (req.user as any)._id;

    const result = await UserServices.followUser(
      currentUserId.toString(),
      targetUserId
    );

    return res.status(200).json({
      success: true,
      message: "User followed successfully",
      data: result,
    });
  } catch (err: any) {
    console.error("Follow User error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Following User failed",
    });
  }
};

export const unfollowUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: targetUserId } = req.params as { id: string };
    const currentUserId = (req.user as any)._id;

    const result = await UserServices.unfollowUser(
      currentUserId.toString(),
      targetUserId
    );

    return res.status(200).json({
      success: true,
      message: "User unfollowed successfully",
      data: result,
    });
  } catch (err: any) {
    console.error("Unfollow User error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Unfollowing User failed",
    });
  }
};

export const savedBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req.user as any)._id;
    const books = await UserServices.getSavedBooks(userId.toString());

    return res.status(200).json({
      success: true,
      data: books,
    });
  } catch (err: any) {
    console.error("Fetch saved books error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Fetching saved books failed",
    });
  }
};

export const removeSavedBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req.user as any)._id;
    const { id: bookId } = req.params as { id: string };

    const result = await UserServices.removeSaveBook(userId.toString(), bookId);

    return res.status(200).json({
      success: true,
      message: "Operation successful",
      data: result,
    });
  } catch (err: any) {
    console.error("Remove saved book error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Operation failed",
    });
  }
};
