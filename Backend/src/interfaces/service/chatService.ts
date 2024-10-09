export interface IChatService {
    getMessageService(chatId: string): Promise<any>
    savechatService(text: string, userId: string, vendorId: string): Promise<any>
    chatController(vendorId: string): Promise<any>
    companyAddMessageService(text: string, userId: string, vendorId: string): Promise<any>
    userchatController(userId: string): Promise<any>
    userGetMessageService(chatId: string): Promise<any>
    userCompanyAddMessageService(text: string, userId: string, vendorId: string): Promise<any>


}