
    try {
        const { email, password } = req.body; // Get email and password from the request body
        console.log(email, password + 'main content ithil ind');
        // Update the user's password
        const user = await update(email, password);
        if (!user) {
            return res.status(HttpStatus.BAD_REQUEST).json({ error: "User not found" });
        }
        // Respond with the updated user data
        res.status(HttpStatus.OK).json({ message: "Password updated successfully", user });
    }
    catch (error) {

    }
};
