import User from "../models/user.model";

export class UserServices {
    static async getUserProfile(id: string) {
        const isUserExists = await User.findById(id).populate({
            path: "postedBooks"
        });
        if(!isUserExists) {
            throw new Error("User not found, Invalid user id");
        }

        return isUserExists;
    }
}

