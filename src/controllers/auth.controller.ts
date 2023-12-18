import Controller from "@/utils/interfaces/controller.interface";
import {NextFunction, Router,Request,Response} from "express";
import HttpException from "@/utils/exceptions/http.exception";
import {UserRegisterDto} from "@/dto/user-register.dto";
import AuthService from "@/services/auth.service";
import {UserLoginDto} from "@/dto/user-login.dto";

class AuthController implements Controller {
    public path = "/auth";
    public router = Router();
    private AuthService = new AuthService();

    constructor() {
        this.initialiseRoutes();
    };

    private initialiseRoutes():void {
        this.router.post(`${this.path}/register`,this.register);
        this.router.post(`${this.path}/login`,this.login);
        this.router.post(`${this.path}/logout`,this.logout);
    };

    private register = async (
        req:Request<{}, {}, UserRegisterDto>,
        res:Response,
        next:NextFunction
    ):Promise<Response | void> => {
        try {
            const dto = req.body;
            const {user,token,success} = await this.AuthService.register(dto);

            res
                .status(201)
                .cookie("accessToken", token, { httpOnly: true, secure: true, sameSite: "none", maxAge: 1000 * 60 * 10 })
                .json({
                    user,
                    token,
                    success
            });
        } catch (err:any) {
            next(new HttpException(400,err.message))
        }
    }

    private login = async (
        req:Request<{}, {}, UserLoginDto>,
        res:Response,
        next:NextFunction
    ) => {
        try {
            const dto = req.body;
            const {user,token,success} = await this.AuthService.login(dto);

            res
                .status(200)
                .cookie("accessToken", token, { httpOnly: true, secure: true, sameSite: "none", maxAge: 1000 * 60 * 10 })
                .json({
                user,
                token,
                    success
            });
        } catch (err:any) {
            next(new HttpException(400,err.message))
        }
    }

    private logout = async (
        req:Request,
        res:Response,
        next:NextFunction
    ) => {
        try {
            const cookies = req.cookies;
            if (!cookies.accessToken) {
                throw new Error("No content");
            };

            // Clear the accessToken cookie with secure and httpOnly options
            res.clearCookie("accessToken", { httpOnly: true, sameSite: 'none', secure: true });

            // Send a JSON response indicating success
            res.json({ message: "Cookie cleared", success: true });
        } catch (error:any) {
            next(new HttpException(204, error.message));
        }
    }
}

export default AuthController;