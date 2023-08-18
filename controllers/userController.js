import { user } from '../database/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const userController = {
  addUser: async (req, res) => {
    try {
      if (req.body.username && req.body.password && req.body.email && req.body.password && req.body.role) {
        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = await user.create({
          username: req.body.username,
          password: hashedPassword,
          email: req.body.email,
          role: req.body.role,
          isVerified: false, // Menandai pengguna sebagai belum terverifikasi
        });

        // Kirim OTP melalui email
        // const otp = await userController.sendOtpEmail('@annisadwifebryantipnp@gmail.com');

        res.json({
          status: 200,
          message: 'User added successfully',
          data: newUser,
          // otp, // Hanya untuk keperluan pengujian, hapus di produksi
        });
      } else {
        res.status(400).json({
          status: 400,
          message: 'Bad request',
        });
      }
    } catch (err) {
      console.log(err);
    }
  },
  loginUser: async (req, res) => {
    try {
      const findUser = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        role: req.body.role,
      };
      if (findUser) {
        // Buat token JWT setelah login berhasil
        const token = jwt.sign({ username: findUser.username, userId: findUser.id, role: findUser.role }, 'secretKey', {
          expiresIn: '1000000000s',
        });
        res.json({
          status: 200,
          message: 'User login successfully',
          data: findUser,
          token,
        });
      } else {
        res.json({
          status: 400,
          message: 'Bad request',
        });
      }
    } catch (err) {
      res.json({
        status: 400,
        message: 'Bad request',
      });
    }
  },

  getProfile: async (req, res) => {
    try {
      const userName = req.user.username; // Mengambil userId dari token
      const userProfile = await user.findOne({
        where: { username: userName },
        attributes: ['id', 'username', 'email', 'password', 'role'],
      });

      if (!userProfile) {
        return res.status(404).json({
          status: 404,
          message: 'User profile not found',
        });
      }

      res.json({
        status: 200,
        message: 'User profile retrieved successfully',
        data: userProfile,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: err,
      });
    }
  },
  changePassword: async (req, res) => {
    try {
      const userName = req.user.username; // Corrected way to extract userId from the token payload
      const { oldPassword, newPassword } = req.body;

      // Find user based on userId
      const currentUser = await user.findOne({ where: { username: userName } });

      if (!currentUser) {
        return res.status(404).json({
          status: 404,
          message: 'User not found',
        });
      }

      // Verify old password
      if (!(await bcrypt.compare(oldPassword, currentUser.password))) {
        return res.status(401).json({
          status: 401,
          message: 'Incorrect old password',
        });
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Update user's password
      await currentUser.update({
        password: hashedNewPassword,
      });

      res.json({
        status: 200,
        message: 'Password changed successfully',
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: err,
      });
    }
  },

  sendOtpEmail: async (req, res) => {
    try {
      // Generate and send OTP via email
      const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP

      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        to: 'annisadwifebryantipnp@gmail.com',
        subject: 'OTP Verification',
        text: `Your OTP for email verification is: ${otp}`,
      };

      await transporter.sendMail(mailOptions);

      res.json({
        status: 200,
        message: 'OTP sent successfully',
        data: { otp }, // Return the OTP in the response for testing (remove in production)
      });
    } catch (err) {
      console.error('Error sending email:', err);
      res.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: err,
      });
    }
  },
};

export default userController;
