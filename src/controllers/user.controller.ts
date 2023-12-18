import Controller from "@/utils/interfaces/controller.interface";
import {NextFunction, Request, Response, Router} from "express";
import UserService from "@/services/user.service";
import HttpException from "@/utils/exceptions/http.exception";
import {UserUpdateDto} from "@/dto/user-update.dto";
import authenticatedMiddleware from "@/middleware/authenticated.middleware";
import {UserQueryDto} from "@/dto/user-query.dto";

class UserController implements Controller {
    public path = "/user";
    public router = Router();

    private UserService = new UserService();

    constructor() {
        this.initialiseRoutes();
    };

    private initialiseRoutes() {
        this.router.route(`${this.path}`)
            .get(this.users)
            .put(authenticatedMiddleware,this.update)
            .delete(authenticatedMiddleware,this.delete)

        this.router.get(`${this.path}/profile`,authenticatedMiddleware,this.profile);

        this.router.get(`${this.path}/:userId`,this.user);
    };

    private users = async (
        req:Request<{},{},{},UserQueryDto>,
        res:Response,
        next:NextFunction
    ) => {
        try {
            const queryDto = req.query;
            const {message,success,users,totalUsers,pageQuery} = await this.UserService.getUsers(queryDto);

            res.status(200).json({
                message,
                success,
                users,
                count:totalUsers,
                page:pageQuery
            });
        } catch (err:any) {
            next(new HttpException(400,err.message));
        }
    }

    private profile = async (
        req:Request,
        res:Response,
        next:NextFunction
    )=> {
        try {
            const userId = req.user._id;
            const {message,success,user} = await this.UserService.getProfile(userId);

            res.status(200).json({
                message,
                success,
                user
            });
        } catch (err:any) {
            next(new HttpException(400,err.message));
        }
    }

    private user = async (
        req:Request<{userId:string}>,
        res:Response,
        next:NextFunction
    ) => {
        try {
            const {userId} = req.params;
            const {message,success,user} = await this.UserService.getUser(userId);

            res.status(200).json({
                message,
                success,
                user
            });
        } catch (err:any) {
            next(new HttpException(400,err.message));
        }
    }

    private update = async  (
        req:Request<{},{},UserUpdateDto>,
        res:Response,
        next:NextFunction
    ) => {
        try {
            const dto = req.body;
            const userId = req.user._id;
            const {message,success,updatedUser} = await this.UserService.updateUser(userId,dto);

            res.status(200).json({
                message,
                success,
                user:updatedUser
            });
        } catch (err:any) {
            next(new HttpException(400,err.message));
        }
    }

    private delete = async (
        req:Request,
        res:Response,
        next:NextFunction
    ) => {
        try {
            const userId = req.user._id;
            const {message,success} = await this.UserService.deleteUser(userId);

            res.status(200).json({
                message,
                success
            });
        } catch (err:any) {
            next(new HttpException(400,err.message));
        }
    }
}

export default UserController;