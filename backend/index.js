// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());           // フロントからの通信を許可
app.use(express.json()); // JSON データを受け取れるようにする

// MySQL 接続プール設定
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// POST /api/scores を受け取り gamedata テーブルへ score を挿入
app.post('/api/scores', async (req, res) => {
  const { score } = req.body;

  if (typeof score !== 'number') {
    return res.status(400).json({ error: 'score must be a number' });
  }

  try {
    const InsertScoresql = 'INSERT INTO gamedata (score) VALUES (?);';
    const [result] = await pool.execute(InsertScoresql, [score]);

    // 返却内容は必要に応じて調整
    return res.status(201).json({ insertedId: result.insertId, score });
  } catch (err) {
    console.error('DB insert error:', err);
    return res.status(500).json({ error: 'Database error' });
  }
});

// GET /api/highscore - practice_db.gamedata の最大 score を返す
app.get('/api/highscore', async (req, res) => {
  try {
    const [highscorerows] = await pool.query('SELECT MAX(score) AS highscore FROM gamedata;');
    const highscore = highscorerows?.[0]?.highscore ?? 0;
    return res.json({ highscore });
  } catch (err) {
    console.error('DB query error (highscore):', err);
    return res.status(500).json({ error: 'Database error' });
  }
});

// 簡易ヘルスチェック
app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});