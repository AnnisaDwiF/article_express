import { article } from '../database/db.js';

const articleController = {
  addArticle: async (req, res) => {
    try {
      const user = req.user; // Ambil informasi pengguna dari token

      if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }

      if (req.body.title && req.body.content && req.body.author && req.body.category) {
        const newArticle = await article.create({
          title: req.body.title,
          content: req.body.content,
          author: req.body.author,
          category: req.body.category,
        });
        res.json({
          endPoint: '/api/articles',
          method: 'POST',
          status: 200,
          message: 'Article added successfully',
          data: newArticle,
          Description: 'api to POST new Article',
        });
      } else {
        return res.status(400).json({
          status: 400,
          message: 'Bad request',
        });
      }
    } catch (err) {
      res.json({
        status: 500,
        message: 'Internal server error',
        data: err,
      });
    }
  },

  showArticle: async (req, res) => {
    try {
      const articles = await article.findAll();
      res.json({
        endPoint: '/api/articles',
        method: 'GET',
        status: 200,
        message: 'Articles retrieved successfully',
        data: articles,
      });
    } catch (err) {
      res.json({
        status: 500,
        message: 'Internal server error',
        data: err,
      });
    }
  },
};

export default articleController;
