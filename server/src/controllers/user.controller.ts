import { Request, Response, NextFunction } from "express"
import { UserServices } from "../services/user.service";


export const userProfile = async (req: Request, res: Response, next: NextFunction)=> {
    try {
        const { id } = req.params as {
            id: string
        };

        const profile = await UserServices.getUserProfile(id);

        return profile;
    }catch(err: any) {
        console.error("Fetching User profile error:", err);
        return res.status(500).json({
          success: false,
          message: err.message || "Fetching User Profile failed",
        });
    }
}

