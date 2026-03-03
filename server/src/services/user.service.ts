import User from "../models/user.model";
import Book from "../models/book.model";

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

    static async followUser(currentUserId: string, targetUserId: string) {
        if (currentUserId === targetUserId) {
            throw new Error("You cannot follow yourself");
        }

        const targetUser = await User.findById(targetUserId);
        const currentUser = await User.findById(currentUserId);

        if (!targetUser || !currentUser) {
            throw new Error("User not found");
        }

        if (currentUser.followings.some((id: any) => id.toString() === targetUserId)) {
            throw new Error("You are already following this user");
        }

        // Add targetUser to currentUser's followings
        currentUser.followings.push(targetUserId as any);
        await currentUser.save();

        // Add currentUser to targetUser's followers
        targetUser.followers.push(currentUserId as any);
        await targetUser.save();

        return { currentUser, targetUser };
    }

    static async unfollowUser(currentUserId: string, targetUserId: string) {
        const targetUser = await User.findById(targetUserId);
        const currentUser = await User.findById(currentUserId);

        if (!targetUser || !currentUser) {
            throw new Error("User not found");
        }

        if (!currentUser.followings.some((id: any) => id.toString() === targetUserId)) {
            throw new Error("You are not following this user");
        }

        // Remove targetUser from currentUser's followings
        currentUser.followings = currentUser.followings.filter(
            (id: any) => id.toString() !== targetUserId
        );
        await currentUser.save();

        // Remove currentUser from targetUser's followers
        targetUser.followers = targetUser.followers.filter(
            (id: any) => id.toString() !== currentUserId
        );
        await targetUser.save();

        return { currentUser, targetUser };
    }

    static async getSavedBooks(userId: string) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const books = await Book.find({ _id: { $in: user.savedBooks } })
            .select("_id title image caption rating userId");
        return books;
    }

    static async removeSaveBook(userId: string, bookId: string) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const isBookSaved = user.savedBooks.some((id: any) => id.toString() === bookId);

        if (isBookSaved) {
            user.savedBooks = user.savedBooks.filter((id: any) => id.toString() !== bookId);
        } else {
            user.savedBooks.push(bookId as any);
        }

        await user.save();
        return {
            success: true
        };
    }
}

