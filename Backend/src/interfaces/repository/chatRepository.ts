
export interface IChatRepository {
    savechatDB(text: string, userId: string, vendorId: string): Promise<any>
    companyAddMessageDB(text: string, userId: string, vendorId: string): Promise<any>
    getMessagesByChatId(chatId: string): Promise<any>
    markMessagesAsRead(chatId: string): Promise<any>
    chatService (vendorId: string): Promise<any>
    userchatService(userId: string): Promise<any>
    userGetMessagesByChatId(chatId: string): Promise<any>
    userCompanyAddMessageDB(text: string, userId: string, vendorId: string): Promise<any>

}



