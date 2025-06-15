import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bycrypt from "bcrypt"
import validator from 'validator'

//login function
const loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "User Doesn't Exist" })
        }
        const isMatch = await bycrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid Creds" })
        }
        const token = createToken(user._id)
        res.json({ success: true, token })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}

// create a token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

// register function
const registerUser = async (req, res) => {
    const { username, password, email } = req.body

    try {
        const exist = await userModel.findOne({ email })
        if (exist) {
            return res.json({ success: false, message: "User Already Exists" })
        }

        //validation
        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Please enter a valid Email"
            })
        }

        if (password.length < 8) {
            return res.json({
                success: false,
                message: "Please enter a Strong Password"
            })
        }

        // if everything works
        const salt = await bycrypt.genSalt(10)
        const hashedPassword = await bycrypt.hash(password, salt)

        // New user
        const newUser = new userModel({
            username: username,
            email: email,
            password: hashedPassword
        })

        const user = await newUser.save()

        const token = createToken(user._id)
        res.json({
            success: true, token
        })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}

export { loginUser, registerUser }