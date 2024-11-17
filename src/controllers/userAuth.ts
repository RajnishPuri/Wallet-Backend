import User from '../models/userModel';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import sendVerificationEmail from '../utils/sendMails';
import Wallet from '../models/userWallet';

interface userData {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    verificationToken: number
}

const JWT_SECRET = process.env.JWT_SECRET || 'MY_SECRET';

export const Register = async (req: Request, res: Response): Promise<Response> => {
    const { firstName, lastName, email, password }: userData = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(300).json({
            success: false,
            message: "All Fields are Required"
        })
    }

    const user = await User.findOne({ email: email });

    if (user) {
        return res.status(301).json({
            success: false,
            message: "User is Already Registered with this Email"
        })
    }

    try {

        const hashedPassword: string = await bcrypt.hash(password, 10);

        const verificationToken: number = Math.floor(100000 + Math.random() * 900000);


        const user = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            verificationToken: verificationToken,
            verificationTokenExpire: Date.now()
        };

        const token = await jwt.sign({ user: user }, JWT_SECRET);

        await sendVerificationEmail(email, verificationToken);

        res.cookie('verification_token', token, {
            httpOnly: true,
            maxAge: 10 * 60 * 1000, // 10 minutes
            secure: process.env.NODE_ENV === 'production' // Use only over HTTPS in production
        });

        return res.status(200).json({
            success: true,
            message: "User Successfully Registered Confirm the Verification!",
        })
    }
    catch (e) {
        return res.status(200).json({
            success: false,
            message: "Error While Creating User!",
        })
    }

}


export const verificationEmail = async (req: Request, res: Response): Promise<Response> => {
    const { otp } = req.body;

    const token = req.cookies.verification_token;
    console.log(token);
    if (!token) {
        return res.status(400).json({ success: false, message: "Verification token not found." });
    }

    try {
        const data = await jwt.verify(token, JWT_SECRET) as JwtPayload;

        const expirationTime = data.user.verificationTokenExpire + 10 * 60 * 1000;

        if (
            data.user &&
            data.user.verificationToken == otp &&
            Date.now() <= expirationTime
        ) {

            const generateAccountNumber = (): string => {
                const timestamp = Date.now().toString().slice(-6);
                const randomDigits = Math.floor(1000 + Math.random() * 9000);
                return `${timestamp}${randomDigits}`;
            };

            const walletData = new Wallet({
                balance: 0,
                AccountNumber: generateAccountNumber(),
            });
            const savedWallet = await walletData.save();

            const userValue = new User({
                firstName: data.user.firstName,
                lastName: data.user.lastName,
                email: data.user.email,
                password: data.user.password,
                verificationToken: undefined,
                verificationTokenExpire: undefined,
                isVerified: true,
                wallet: savedWallet._id,
            });

            await userValue.save();

            res.clearCookie('verification_token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production'
            });

            return res.status(200).json({
                success: true,
                message: "User is now verified! Please login.",
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "OTP is invalid or has expired.",

            });
        }
    } catch (e) {
        return res.status(500).json({
            success: false,
            message: "Error while verifying the user!",
        });
    }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;

    try {

        if (!email || !password) {
            return res.status(300).json({
                success: false,
                message: "All Fields are Required"
            })
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(301).json({
                success: false,
                message: "User is Not Registered with this Email!, Register First"
            })
        }

        const response: any = await User.findOne({ email: email });

        const passwordValid = await bcrypt.compare(password, response.password);
        if (!passwordValid) {
            return res.status(401).json({
                success: false,
                message: "Password is Incorrect",
            });
        }

        const token = await jwt.sign({ email }, JWT_SECRET);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 6 * 10 * 24 * 60 * 1000 * 7,
            secure: process.env.NODE_ENV === 'production'
        })

        return res.status(200).json({
            success: true,
            message: "User is Loggedin",
        });
    }
    catch (e) {
        return res.status(500).json({
            success: false,
            message: "Error while login the user!",
        });
    }

}

export const loggedOut = async (req: Request, res: Response): Promise<Response> => {

    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });
        return res.status(200).json({
            success: true,
            message: "User is Successfully LoggedOut",
        });
    }
    catch (e) {
        return res.status(500).json({
            success: false,
            message: "Error while loggedOut the user!",
        });
    }
}