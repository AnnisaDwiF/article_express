import express from 'express';
import articleController from '../controllers/articleController.js';

const articleRouter = express.Router();
import jwt from 'jsonwebtoken';

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

const authorize = (requiredRole) => {
  return (req, res, next) => {
    const user = req.user;
    if (user && user.role === requiredRole) {
      next();
    } else {
      res.status(403).json({ message: 'Access denied' });
    }
  };
};

articleRouter.post('/', verifyToken, authorize('admin'), articleController.addArticle);

articleRouter.get('/', articleController.showArticle);

export default articleRouter;
