import Controller from "@/utils/interfaces/controller.interface";
import {NextFunction, Request, Response, Router} from "express";
import QuestionService from "@/services/question.service";
import HttpException from "@/utils/exceptions/http.exception";
import {QuestionCreateDto} from "@/dto/question-create.dto";
import {QuestionUpdateDto} from "@/dto/question-update.dto";
import {QuestionQueryDto} from "@/dto/question-query.dto";
import authenticatedMiddleware from "@/middleware/authenticated.middleware";

class QuestionController implements Controller {
    public path = "/question";
    public router = Router();

    private QuestionService = new QuestionService();

    constructor() {
        this.initialiseRoutes();
    }

    private initialiseRoutes() {
        this.router.route(`${this.path}`)
            .post(authenticatedMiddleware,this.create)
            .get(this.questions)

        this.router.get(`${this.path}/:slug`,this.question);
        this.router.put(`${this.path}/:id`,authenticatedMiddleware,this.update);
        this.router.delete(`${this.path}/:id`,authenticatedMiddleware,this.delete);
    }

    private create = async (
        req:Request<{},{},QuestionCreateDto>,
        res:Response,
        next:NextFunction
    ) => {
        try {
            const dto = req.body;
            const userId = req.user._id;
            const {question,message,success} = await this.QuestionService.createQuestion(dto,userId);
            
            res.status(201).json({
                success,
                message,
                question
            });
        } catch (err:any) {
            next(new HttpException(400,err.message));
        }
    }

    private update = async (
        req:Request<{id:string},{},QuestionUpdateDto>,
        res:Response,
        next:NextFunction
    ) => {
        try {
            const dto = req.body;
            const {id} = req.params;
            const {message,success,updatedQuestion} = await this.QuestionService.updateQuestion(id,dto);

            success ? res.status(200).json({
                message,
                success,
                data:updatedQuestion
            }) : res.status(404).json({
                message,
                success
            });
        } catch (err:any) {
            next(new HttpException(400,err.message));
        }
    }

    private delete = async (
        req:Request<{id:string}>,
        res:Response,
        next:NextFunction
    ) => {
        try {
            const {id} = req.params;
            const {message,success} = await this.QuestionService.deleteQuestion(id);

            res.json(200).json({
                message,
                success
            })
        } catch (err:any) {
            next(new HttpException(404,err.message))
        }
    }

    private questions = async  (
        req:Request<{},{},{},QuestionQueryDto>,
        res:Response,
        next:NextFunction
    ) => {
        try {
            const dto = req.query;
            const {questions,success,totalPost,message,totalPages} = await this.QuestionService.getQuestions(dto);

            res.status(200).json({
                success,
                data: {
                    count:totalPost,
                    questions,
                    totalPages
                },
                message
            })
        } catch (err:any) {
            next(new HttpException(400,err.message));
        }
    }

    private question = async  (
        req:Request<{slug:string}>,
        res:Response,
        next:NextFunction
    ) => {
        try {
            const {slug} = req.params;
            const {question,message,success} = await this.QuestionService.getQuestion(slug);

            res.status(200).json({
                message,
                success,
                data:question
            })
        } catch (err:any) {
            next(new HttpException(400,err.message));
        }
    }
}

export default QuestionController;