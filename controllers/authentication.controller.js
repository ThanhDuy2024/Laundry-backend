import { Users } from "../models/users.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
export const registerController = async (req, res) => {
    try {
        const users = await Users.findOne({
            email: req.body.email
        });

        if(users) {
            return res.status(404).json({
                code: "error",
                message: "Email nay da duoc dang ky roi!"
            })
        };

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        req.body.password = hash;

        await Users.create(req.body);
        res.json({
            code: "success",
            message: "Dang ky thanh cong"
        })
    } catch (error) {
        res.status(400).json({
            code: "error",
            message: "Loi dang ky"
        })  
    }
}

export const loginController = async (req, res) => {
    try {
        const users = await Users.findOne({
            email: req.body.email
        });

        if(!users) {
            return res.status(404).json({
                code: "error",
                message: "Email hoac mat khau khong dung!"
            })
        };

        const decode = bcrypt.compareSync(req.body.password, users.password);

        if(!decode) {
            return res.status(404).json({
                code: "error",
                message: "Email hoac mat khau khong dung!"
            })
        }

        const token = jwt.sign({
            email: users.email,
            fullName: users.password
        }, process.env.JWT);

        res.cookie("token", token, {
            secure: false,
            httpOnly: true,
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        res.json({
            code: "success",
            message: "Dang nhap thanh cong!"
        })
    } catch (error) {
        res.status(400).json({
            code: "error",
            message: "Dang nhap that bai!"
        })       
    }
}

export const profileContoller = async (req, res) => {
    try {
        res.json({
            code: "success",
            data: req.users
        })
    } catch (error) {
        res.status(400).json({
            code: "error",
            message: "Loi profile controller"
        })
    }
}

export const updateProfileController = async (req, res) => {
    try {
        if(req.file) {
            req.body.image = req.file.path;
        } else {
            delete req.body.image;
        }

        const checkEmail = await Users.findOne({
            _id: { $ne: req.users.id },
            email: req.body.email
        });

        if(checkEmail) {
            return res.status(400).json({
                code: "error",
                message: "Email nay da duoc dang ky roi"
            })
        }

        await Users.updateOne({
            _id: req.users.id
        }, req.body);
        res.json({
            code: "success",
            message: "Chinh sua profile thanh cong"
        })
    } catch (error) {
        res.status(400).json({
            code: "error",
            message: "Chinh sua profile that bai"
        })
    }
}

export const logoutController = async (req, res) => {
    try {
        res.clearCookie("token");
        res.json({
            code: "success",
            message: "Dang xuat thanh cong"
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            code: "error",
            message: "Loi dang xuat"
        })
    }
}