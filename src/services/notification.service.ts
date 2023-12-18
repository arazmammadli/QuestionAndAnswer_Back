import NotificationSchema from "@/models/notification.schema";

class NotificationService {
    private notificationModel = NotificationSchema;
    
    public async createNotification(
        userId:string,
        desc:string,
    ) {
        try {
            const notification = await this.notificationModel.create({user:userId,desc});
            //     notificaton push user array
        } catch (err:unknown) {
            if(err instanceof Error) {
                throw new Error(err.message)
            }
        }
    }
}