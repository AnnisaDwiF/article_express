import { Sequelize } from 'sequelize';
import dbConfig from '../config/dbConfig.js';

import articleModel from '../models/articleModel.js';
import userModel from '../models/userModel.js';

const db = new Sequelize(dbConfig.name, dbConfig.username, dbConfig.password, dbConfig.options);

export const article = articleModel(db);
export const user = userModel(db);

export default db;
