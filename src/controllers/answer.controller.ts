import Controller from "@/utils/interfaces/controller.interface";
import {NextFunction, Request, Response, Router} from "express";
import AnswerService from "@/services/answer.service";
import {AnswerCreateDto} from "@/dto/answer-create.dto";
import HttpException from "@/utils/exceptions/http.exception";
import {AnswerUpdateDto} from "@/dto/answer-update.dto";
import authenticatedMiddleware from "@/middleware/authenticated.middleware";

class AnswerController implements Controller {
    public path = "/answer";
    public router = Router();

    private AnswerService = new AnswerService();
    
    constructor() {
        this.initialiseRoutes();
    }
    
    private initialiseRoutes() {
        this.router.post(`${this.path}`,authenticatedMiddleware,this.create);
        this.router.route(`${this.path}/:answerId`)
            .get(authenticatedMiddleware,this.answer)
            .delete(authenticatedMiddleware,this.delete)
            .put(authenticatedMiddleware,this.update)
    }
    
    private create = async (
        req:Request<{},{},AnswerCreateDto>,
        res:Response,
        next:NextFunction
    ) => {
        try {
            const dto = req.body;
            const userId = req.user._id;

            const {message,success,answer} = await this.AnswerService.createAnswer(dto,userId);

            res.status(201).json({
                message,
                success,
                answer
            })

        } catch (err:any) {
            next(new HttpException(400,err.message));
        }
    }

    private answer = async (
        req:Request<{answerId:string}>,
        res:Response,
        next:NextFunction
    ) => {
        try {
            const {answerId} = req.params;

            const {message,success,answer} = await this.AnswerService.getAnswer(answerId);
            res.status(200).json({
                message,
                success,
                answer
            });
        } catch (err:any) {
            next(new HttpException(400,err.message));
        }
    }

    private update = async (
        req:Request<{answerId:string},{},AnswerUpdateDto>,
        res:Response,
        next:NextFunction
    ) => {
        try {
            const dto = req.body;
            const {answerId} = req.params;

            const {answer,message,success} = await this.AnswerService.updateAnswer(answerId,dto);
            res.status(200).json({
                message,
                success,
                answer
            })
        } catch (err:any) {
            next(new HttpException(400,err.message));
        }
    }

    private delete = async (
        req:Request<{answerId:string}>,
        res:Response,
        next:NextFunction
    ) => {
        try {
            const {answerId} = req.params;

            const {message,success} = await this.AnswerService.deleteAnswer(answerId);
            res.status(200).json({
                message,
                success
            });
        } catch (err:any) {
            next(new HttpException(400,err.message));
        }
    }
}

export default AnswerController;