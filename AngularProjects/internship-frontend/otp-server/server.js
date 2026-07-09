const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

const otpStore = {};
const transporter = nodemailer.createTransport({

    service: "gmail",

    auth: {

        user: "maheshgoyal20032004@gmail.com",

        pass: "zujaibapuqjtprad"

    }

});
transporter.verify(function (error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log("Mail Server Ready");
    }
});
app.post("/send-otp", async (req, res) => {

    const { email } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000);

    otpStore[email] = otp;

    await transporter.sendMail({

        from: "maheshgoyal20032004@gmail.com",

        to: email,

        subject: "Login OTP",

        text: `Your OTP is ${otp}`

    });

    res.json({

        success: true,

        message: "OTP Sent"

    });
    console.log("OTP:", otp);

});
app.post("/verify-otp", (req, res) => {

    const { email, otp } = req.body;

    if (otpStore[email] == otp) {

        delete otpStore[email];

        return res.json({

            success: true,

            message: "OTP Verified"

        });

    }

    res.status(400).json({

        success: false,

        message: "Invalid OTP"

    });

});
app.listen(5000, () => {

    console.log("OTP Server Running on Port 5000");

});