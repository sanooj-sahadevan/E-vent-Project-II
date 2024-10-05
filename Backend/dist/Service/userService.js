import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendEmail } from "../utils/sendEmail.js";
import { otpGenerator } from "../utils/otpGenerator.js";
import jsSHA from "jssha";
import { createUser, userEditFromDB, updateUser, createBookedTrip, findUserByEmailupdate, fetchfromDBDishes, VendorRepository, verifyAndSaveUserRepo, fetchfromDBAuditorium, findVendorByIdInDb, findUserByEmail, findVendor, findAuditoriumByIdInDb, getBookingDetail, findFoodVendorIdInDb, findAuditoriumVendorIdInDb, finddishesByIdInDb, findDetailsByUserId, changepassword, } from "../Repository/userReop.js";
export const registerUser = async (user) => {
    try {
        const existingUser = await findUserByEmail(user.email);
        if (existingUser) {
            if (existingUser.otpVerified) {
                throw new Error("User already exists and is verified.");
            }
            else {
                console.log('Updating existing user with new OTP:', user.otp);
                await updateUser(existingUser.email, { otp: user.otp, ...user });
                return existingUser;
            }
        }
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
        return await createUser(user);
    }
    catch (error) {
        console.error("Error during user registration:", error);
        throw new Error(`Registration error: ${error.message}`);
    }
};
export const loginUser = async (email, password) => {
    const user = await findUserByEmail(email);
    if (!user) {
        throw new Error("Invalid Email/Password");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid Email/Password");
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
    return { user, token };
};
export const checkEmail = async (email) => {
    const user = await findUserByEmail(email);
    if (!user) {
        throw new Error('User not found');
    }
    const otp = otpGenerator();
    await sendEmail(email, otp);
    return { user, otp };
};
export const verifyOtpService = async (email, otp) => {
    const user = await findUserByEmail(email);
    if (!user) {
        throw new Error("User not found");
    }
    if (user.otp === otp) {
        await verifyAndSaveUserRepo(email, otp);
        return "User registered successfully";
    }
    else {
        throw new Error("Invalid OTP");
    }
};
export const update = async (email, password) => {
    try {
        console.log('Service: Calling repository to update password');
        const user = await findUserByEmailupdate(email, password);
        return user;
    }
    catch (error) {
        console.error(error);
    }
};
const vendorRepository = new VendorRepository();
export const getAllVendors = async () => {
    try {
        return await vendorRepository.getAllVendors();
    }
    catch (error) {
        throw new Error('Error fetching vendors');
    }
};
export const getAllDishes = async (vendorId) => {
    try {
        const result = await fetchfromDBDishes(vendorId);
        return result;
    }
    catch (error) {
        throw new Error('Error fetching dishes');
    }
};
export const getAllAuditorium = async (vendorId) => {
    try {
        console.log('Service: Fetching auditoriums for vendor:', vendorId);
        const result = await fetchfromDBAuditorium(vendorId);
        return result;
    }
    catch (error) {
        throw new Error('Error fetching auditoriums');
    }
};
export const editUser = async (userDetails) => {
    try {
        return await userEditFromDB(userDetails);
    }
    catch (error) {
        throw new Error('Failed to update user details');
    }
};
export const findVendorById = async (vendorId, userId) => {
    try {
        const vendor = await findVendor(vendorId); // Fetch the vendor details
        const chat = await findVendorByIdInDb(vendorId, userId); // Fetch or create chat details
        return { vendor, chatId: chat.chatId }; // Return both vendor and chat ID
    }
    catch (error) {
        throw new Error(`Error finding vendor: ${error}`);
    }
};
export const findFoodVendorById = async (vendorId) => {
    try {
        console.log('Service invoked to find dishes for vendor:', vendorId);
        const dishes = await findFoodVendorIdInDb(vendorId);
        if (!dishes || dishes.length === 0) {
            throw new Error(`Error finding vendor dishes`);
        }
        else {
            return dishes;
        }
    }
    catch (error) {
        throw new Error(`Error finding vendor dishes: ${error}`);
    }
};
export const findAuditoriumVendorById = async (vendorId) => {
    try {
        console.log('Service invoked to find dishes for vendor:', vendorId);
        const dishes = await findAuditoriumVendorIdInDb(vendorId);
        return dishes;
    }
    catch (error) {
        throw new Error(`Error finding vendor dishes: ${error}`);
    }
};
export const findAuditoriumById = async (auditoriumId) => {
    try {
        console.log('controller 2');
        const vendor = await findAuditoriumByIdInDb(auditoriumId);
        return vendor;
    }
    catch (error) {
        throw new Error(`Error finding vendor: ${error}`);
    }
};
export const finddishesById = async (dishesId) => {
    try {
        console.log('controller 2');
        const vendor = await finddishesByIdInDb(dishesId);
        return vendor;
    }
    catch (error) {
        throw new Error(`Error finding vendor: ${error}`);
    }
};
export const findEvent = async (bookingId) => {
    try {
        console.log('controler 2');
        const bookingDetails = await getBookingDetail(bookingId);
        return bookingDetails;
    }
    catch (error) {
        console.error("Error fetching booking details:", error);
        throw error;
    }
};
export const addTransactionDetails = async (email, PayUOrderId, status) => {
    try {
        // const PayUOrderData = await PayURepository.getPayUOrder(PayUOrderId);
        // if (!PayUOrderData) throw new Error("PayU Order Data not found");
        // console.log("Got order id");
        // console.log(PayUOrderData);
        // const userData = await userServices.getUserDataByEmail(email);
        // if (!userData) throw new Error("User Data not found.");
        // const userId = userData._id.toString();
        // const transaction = await adsRepository.addTransaction(
        //   userId,
        //   PayUOrderId,
        //   PayUOrderData.mihpayid,
        //   status,
        //   PayUOrderData.amount
        // );
        // console.log("Added transaction");
        // console.log(transaction);
        // if (!transaction) throw new Error("Transaction Data not found");
        // if (status === "success") {
        //   const postId = PayUOrderData?.productinfo;
        //   const WeNetAdsData = await adsRepository.createWenetAds(
        //     userId,
        //     postId,
        //     transaction._id.toString()
        //   );
        //   console.log("created WeNetAdsData");
        //   console.log(WeNetAdsData);
        //   const postData = await adsRepository.addAdDataToPost(postId);
        //   console.log("Added ad data to post ");
        //   console.log(postData);
        //   try {
        //     await adsRepository.sendPostAdDataToMQ(
        //       postData._id.toString(),
        //       postData.WeNetAds
        //     );
        //   } catch (error: any) {
        //     console.log(error.message);
        //   }
        // }
        // return transaction._id.toString();
    }
    catch (error) {
        throw new Error(error.message);
    }
};
export const fetchbookingData = async (bookingData) => {
    console.log('service');
    const bookedTrip = await createBookedTrip(bookingData);
    console.log(bookedTrip);
    return bookedTrip;
};
export const findBookingDetails = async (userId) => {
    console.log('Fetching booking details for userId:', userId);
    const bookingDetails = await findDetailsByUserId(userId); // Use the repository function
    console.log('Booking details:', bookingDetails);
    return bookingDetails; // Return the booking details
};
export const findchangePassword = async (userId, newPassword) => {
    console.log('Updating password for userId:', userId);
    const updatedPassword = await changepassword(userId, newPassword);
    return updatedPassword;
};
export const findUserByEmailService = async (email) => {
    try {
        const user = await findUserByEmail(email);
        console.log('otp service');
        return { user, email };
    }
    catch (error) {
        console.error(error);
    }
};
export const generateOtp = () => {
    const otp = otpGenerator();
    console.log(otp, "OTP-------------------");
    return otp;
};
export const generatesendEmail = async (email, otp) => {
    try {
        const result = sendEmail(email, otp);
        console.log(result);
    }
    catch (error) {
        console.error("Error sending OTP:", error);
        throw new Error("Failed to send OTP.");
    }
};
export const generatePaymentHash = async ({ txnid, amount, productinfo, username, email, udf1, udf2, udf3, udf4, udf5, udf6 }) => {
    try {
        const hashString = `${process.env.PAYU_MERCHANT_KEY}|${txnid}|${amount}|${productinfo}|${username}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}|${udf6}|||||${process.env.PAYU_SALT}`;
        // Generate hash using SHA-512
        const sha = new jsSHA("SHA-512", "TEXT");
        sha.update(hashString);
        const hash = sha.getHash("HEX");
        return hash;
    }
    catch (error) {
        throw new Error("Error generating payment hash");
    }
};
