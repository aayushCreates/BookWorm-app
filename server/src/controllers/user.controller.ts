import { Request, Response, NextFunction } from "express"
import { UserServices } from "../services/user.service";


export const userProfile = async (req: Request, res: Response, next: NextFunction)=> {
    try {
        const { id } = req.params as {
            id: string
        };

        const profile = await UserServices.getUserProfile(id);

        return res.status(200).json({
            success: true,
            data: profile,
        });
    }catch(err: any) {
        console.error("Fetching User profile error:", err);
        return res.status(500).json({
          success: false,
          message: err.message || "Fetching User Profile failed",
        });
    }
}

export const followUser = async (req: Request, res: Response, next: NextFunction)=> {
    try {
        const { id: targetUserId } = req.params as { id: string };
        const currentUserId = (req.user as any)._id;

        const result = await UserServices.followUser(currentUserId.toString(), targetUserId);

        return res.status(200).json({
            success: true,
            message: "User followed successfully",
            data: result,
        });
    }catch(err: any) {
        console.error("Follow User error:", err);
        return res.status(500).json({
          success: false,
          message: err.message || "Following User failed",
        });
    }
}

export const unfollowUser = async (req: Request, res: Response, next: NextFunction)=> {
    try {
        const { id: targetUserId } = req.params as { id: string };
        const currentUserId = (req.user as any)._id;

        const result = await UserServices.unfollowUser(currentUserId.toString(), targetUserId);

        return res.status(200).json({
            success: true,
            message: "User unfollowed successfully",
            data: result,
        });
    }catch(err: any) {
        console.error("Unfollow User error:", err);
        return res.status(500).json({
          success: false,
          message: err.message || "Unfollowing User failed",
        });
    }
}
