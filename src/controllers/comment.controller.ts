import Controller from "@/utils/interfaces/controller.interface";
import {NextFunction, Request, Response, Router} from "express";
import CommentService from "@/services/comment.service";
import HttpException from "@/utils/exceptions/http.exception";
import {CommentDto} from "@/dto/comment.dto";
import authenticatedMiddleware from "@/middleware/authenticated.middleware";

class CommentController implements Controller {
    public path = "/comment";
    public router = Router();

    private CommentService = new CommentService();

    constructor() {
        this.initialiseRoutes();
    };

    private initialiseRoutes() {
        this.router.post(`${this.path}`,authenticatedMiddleware,this.create);
        this.router.get(`${this.path}/:questionId`,this.comments);
        this.router.delete(`${this.path}/:id/:questionId`,authenticatedMiddleware,this.delete);
    }

    private create = async (
        req:Request<{},{},CommentDto>,
        res:Response,
        next:NextFunction
    ) => {
        try {
            const dto =  req.body;
            const userId = req.user._id;
            const {message,success,newComment} = await this.CommentService.createComment(dto,userId);

            res.status(201).json({
                message,
                success,
                comment:newComment
            })
        } catch (err:any) {
            next(new HttpException(400,err.message));
        }
    }

    private comments = async (
        req:Request<{questionId:string}>,
        res:Response,
        next:NextFunction
    ) => {
        try {
            const {questionId} = req.params;
            const {message,success,data} = await this.CommentService.getComments(questionId);

            res.status(200).json({
                message,
                success,
                data
            })
        } catch (err:any) {
            next(new HttpException(400,err.message));
        }
    }

    private delete = async (
        req:Request<{id:string,questionId:string}>,
        res:Response,
        next:NextFunction
    ) => {
        try {
            const {id,questionId} = req.params;
            const {message,success} = await this.CommentService.deleteComment(id,questionId);

            success ? res.status(200).json({
                success,
                message
            }) : res.status(404).json({
                message,
                success
            })
        } catch (err:any) {
            next(new HttpException(400,err.message));
        }
    }
}

export default CommentController;