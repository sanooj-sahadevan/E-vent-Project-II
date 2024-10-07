
export interface IChatRepository{
    savechatDB(text: string, userId: string, vendorId: string): Promise<any>
    companyAddMessageDB(text: string, userId: string, vendorId: string): Promise<any>
}



