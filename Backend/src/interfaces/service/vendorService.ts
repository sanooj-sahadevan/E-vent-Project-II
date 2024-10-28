import { AuditoriumDocument } from "../../models/auditoriumModel";
import { DishDocument } from "../dishes";
import { ISlot } from "../slot";
import { Vendor } from "../vendor";

export interface IVendorService {
    // getMessageService(chatId: string): Promise<any>


    registerVendor(vendor: Vendor): Promise<any>
    verifyAndSaveVendor(email: string, otp: string): Promise<any>

    loginVendor(email: string, password: string): Promise<any>

    vendorAddress(): Promise<any>
    editVendorService(vendorDetails: any): Promise<Vendor>
    uploadImage(fileName: string, fileType: string): Promise<string>

    findVendorById(vendorId: string): Promise<any>
    findAuditoriumById(auditoriumId: string): Promise<any>

    findDishesById(dishesId: string): Promise<any>

    uploadDishes(
        vendorId: string,
        data: DishDocument,
        images?: string
    ): Promise<any>
    uploadAuditorium(
        vendorId: string,
        data: AuditoriumDocument,
        images?: string
    ): Promise<any>

    findFoodVendorById(vendorId: string): Promise<any>
    findReviewsVendorById(vendorId: string): Promise<any>

    findAuditoriumVendorById(vendorId: string): Promise<any>
    softDeleteDishService(dishId: string): Promise<any>

    softDeleteAuditoriumService(auditoriumId: string): Promise<any>
    reviewIdService(reviewId: string): Promise<any>
    findBookingDetails(vendorId: string): Promise<any>
    reviewIdServiceReject(reviewId: string): Promise<any>

    findVendorByEmailService(email: string): Promise<any>


    chatServices({ vendorId }: { vendorId: string }): Promise<any>
    createWorkerSlots(vendorId: string, startDate: Date, endDate: Date): Promise<ISlot[]>
    messageService({
        chatIds,
        vendorId,
    }: {
        chatIds: string[];
        vendorId: string;
    }): Promise<any>

    getSlotsByWorkerId(vendorId: string): Promise<ISlot[]>
    saveVendorServiceImages(vendorId: string, photoUrls: string[]): Promise<void>
}