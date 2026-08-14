import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './src/config/db.js';
import routes from './src/routes/index.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api', routes);

// 健康检查
app.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// 先启动服务，再连接数据库
app.listen(port, "0.0.0.0", () => {
  console.log(`服务器运行在 0.0.0.0:${port}`);
  
  // 异步连接数据库，不阻塞服务启动
  sequelize.authenticate()
    .then(() => {
      console.log('数据库连接成功');
      return sequelize.sync({ alter: true });
    })
    .then(() => {
      console.log('数据库同步完成');
    })
    .catch(err => {
      console.error('数据库连接失败:', err);
    });
});
