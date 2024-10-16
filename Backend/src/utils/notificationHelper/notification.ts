// import { createNotification, getAllUsers } from '../../Repository/notificationRepositry'; // Correct the import path

// export default async function notifyDishAdded(vendorId: string, dishId: string, dishName: string) {
//     const message = `New dish "${dishName}" has been added by Vendor ${vendorId}.`;

//     const users = await getAllUsers();

//     const notificationPromises = users.map(user =>
//         createNotification({
//             userId: user._id,
//             vendorId: vendorId,  // Ensure vendorId is included
//             notificationMessage: message,
//             dishId: dishId,  
//             type: "dish_added",  // Set the type to "dish_added"
//         })
//     );

//     await Promise.all(notificationPromises);

//     console.log('Notifications sent for dish:', dishName);
// }
