export interface UserType {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  postedBooks: string[];
  savedBooks: string[];
  followers: string[];
  followings: string[];
  createdAt: Date;
  updatedAt: Date;
}
