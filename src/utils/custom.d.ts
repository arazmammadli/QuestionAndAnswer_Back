import IUser from "@/utils/interfaces/user.interface";

declare global {
    namespace Express {
        export interface Request {
            user: IUser;
        }
    }
}