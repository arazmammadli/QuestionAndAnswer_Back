import Controller from "@/utils/interfaces/controller.interface";
import {NextFunction, Request, Response, Router} from "express";
import TagService from "@/services/tag.service";
import HttpException from "@/utils/exceptions/http.exception";
import {TagDto} from "@/dto/tag.dto";
import authenticatedMiddleware from "@/middleware/authenticated.middleware";
import {TagQueryDto} from "@/dto/tag-query.dto";

// İşimə görə Tag-in back-ni yazdım amma front-nu çatdıra bilmədim ona görə istifadə eləməmişəm
class TagController implements Controller {
    public path = "/tag";
    public router = Router();
    private TagService = new TagService();

    constructor() {
        this.initialiseRoutes();
    };

    initialiseRoutes():void {
        this.router.route(`${this.path}`)
            .post(authenticatedMiddleware,this.create)
            .get(this.tags)

        this.router.delete(`${this.path}/:id`,authenticatedMiddleware,this.delete);
        this.router.put(`${this.path}/:id`,authenticatedMiddleware,this.update)
    }

    private tags = async (
        req:Request<{},{},{},TagQueryDto>,
        res:Response,
        next:NextFunction
    ) => {
        try {
            const queryDto = req.query;
            const {tags,totalTags,success,pageQuery} = await this.TagService.getTags(queryDto);

            res.status(200).json({
                tags,
                count:totalTags,
                success,
                pageQuery
            });
        } catch (err:any) {
            next(new HttpException(400,err.message));
        }
    }

    private create = async (
        req:Request<{}, {}, TagDto>,
        res:Response,
        next:NextFunction
    ) => {
        try {
            const dto = req.body;
            const {message,tag}= await this.TagService.createTag(dto);

            res.status(201).json({
                tag,
                message:message,
                success: true
            })
        } catch (err:any) {
            next(new HttpException(400,err.message));
        }
    }

    private update = async (
        req:Request<{id:string}, {}, TagDto>,
        res:Response,
        next:NextFunction
    ) => {
        try {
            const dto = req.body;
            const {id} = req.params;

            const {message,success,updatedTag} = await this.TagService.updateTag(id,dto);

            res.status(200).json({
                message,
                success,
                updatedTag
            })

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
            const {message,success} = await this.TagService.deleteTag(id);

            res.status(200).json({
                message,
                success
            })
        } catch (err:any) {
            next(new HttpException(400,err.message));
        }
    }
}

export default TagController;