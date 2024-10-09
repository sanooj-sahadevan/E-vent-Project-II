import { Vendor } from "../vendor";

export interface IVendorRepository {
    createVendor(vendor: Vendor): Promise<any>
    findVendorByEmail(email: string): Promise<any>
    updateVendor(email: string, update: Partial<Vendor>): Promise<any>
    findVendorByEmailAndPassword(email: string, password: string): Promise<any>
    vendorAddressFromDB(): Promise<any>
    findVendorByEmailRepo(email: string): Promise<any>
    editVendorRepo(existingVendor: Vendor | null, vendorDetails: Vendor): Promise<any>
    findVendorByIdInDb(vendorId: string): Promise<any>
    findAuditoriumByIdInDb(auditoriumId: string): Promise<any>
    findDishesByIdInDb(dishesId: string): Promise<any>
    findFoodVendorIdInDb(vendorId: string): Promise<any>
    findAuditoriumVendorIdInDb(vendorId: string): Promise<any>
    createDishes(dishesData: any): Promise<any>
    createAuditorium(auditoriumData: any): Promise<any>
    softDeleteDishRepo(dishId: string): Promise<any>
    softDeleteAuditoriumRepo(auditoriumId: string): Promise<any>
    findDetailsByvendorId(vendorId: string): Promise<any>
    chatDB(vendorId: string): Promise<any>
    messageDB(chatIds: string[]): Promise<any>

}