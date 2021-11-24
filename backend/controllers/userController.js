const ErrorHander = require('../utils/errorhander');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto');
const cloudinary = require('cloudinary');

//Register a user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: "150",
        crop: "scale"
    });
    const { name, email, password } = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    });

    sendToken(user, 201, res);
});

//Login a user
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    //1. Check if email and password exist
    if (!email || !password) {
        return next(new ErrorHander("Please provide email and password", 400));
    }
    const user = await User.findOne({ email }).select('+password'); //find user by email
    if (!user) {
        return next(new ErrorHander("Invalid email or password", 401));
    }
    const isPasswordMatched = await user.comparePassword(password); //check if password matches
    if (!isPasswordMatched) {
        return next(new ErrorHander("Invalid email or password", 401));
    }


    sendToken(user, 200, res);
});


//logout a user
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        message: 'User logged out successfully',
    });
});

//Forgot password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    //1. Get user based on posted email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHander("There is no user with that email address", 404));
    }
    //2. Generate the token
    const resetToken = user.getResetPasswordToken();    //get token from user model
    await user.save({ validateBeforeSave: false }); //save user without validating
    //3. Send it to user's email
    const resetPasswordUrl = `${req.protocol}://${req.get(
        "host"
    )}/password/reset/${resetToken}`;

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
    try {
        await sendEmail({
            email: user.email,
            subject: `Let's Cart Password Recovery `,
            message,
        });
        res.status(200).json({
            success: true,
            message: `Email send to ${user.email} successfully`
        });
    } catch (err) {
        user.passwordResetToken = undefined;    //remove token from user which is saved in the data base when click on the forgot password
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false }); //save user without validating
        return next(new ErrorHander(err.message, 500));    //send error to error handler
    }
});


//Reset password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    //1. Get user based on the token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });
    //2. If token has not expired, and there is user, set the new password
    if (!user) {
        return next(new ErrorHander("Reset password token is invalid or has expired", 400));
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHander("Passwords do not match", 400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    //3. Update changedPasswordAt property for the user
    //4. Log the user in, send JWT
    sendToken(user, 200, res);
}
);

//get user details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    });
});

//change password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if (!isPasswordMatched) {
        return next(new ErrorHander("Old password is incorrect", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHander("Passwords do not match", 400));
    }
    user.password = req.body.newPassword;
    await user.save();
    //4. Log user in, send JWT
    sendToken(user, 200, res);
});

//Update Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };
    if (req.body.avatar !== "") {
        const user = await User.findById(req.user.id);

        const imageId = user.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: "150",
            crop: "scale"
        });

        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        };
    }
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    res.status(200).json({
        success: true,
    });
});

//get all users -- admin
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users
    });
});

//get user details -- admin
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHander("User not found", 400));
    }
    res.status(200).json({
        success: true,
        user
    });
});

//update user role -- admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    };

    await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
    });
});


//Delete User --admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHander("User not found", 404));
    }

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);


    await user.remove();
    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    });
});