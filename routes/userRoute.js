import express from 'express';
import userController from '../controllers/userController.js';
import jwt from 'jsonwebtoken';

const userRouter = express.Router();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Ambil token dari header permintaan

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  try {
    const decodedToken = jwt.verify(token, 'secretKey'); // Ganti dengan kunci rahasia yang sama saat membuat token

    // Simpan informasi pengguna dari token di objek permintaan
    req.user = decodedToken;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

userRouter.post('/register', userController.addUser);
userRouter.post('/login', userController.loginUser);
userRouter.get('/profile', verifyToken, userController.getProfile);
userRouter.post('/change-password', verifyToken, userController.changePassword);
userRouter.get('/sendEmail', userController.sendOtpEmail);

export default userRouter;
