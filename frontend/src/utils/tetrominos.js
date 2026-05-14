/**
 * @fileoverview テトロミノ（Tetris ピース）のユーティリティ
 * @description 7 種類のテトロミノの形状・色定義と、
 *              ピースの生成・回転機能を提供する。
 * @author Tetris Team
 * @version 1.0.0
 */

/**
 * @const {Object} TETROMINOS
 * @description すべてのテトロミノの形状と色を定義するオブジェクト
 */
export const TETROMINOS = {
  I: {
    shape: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    color: '#00F0F0' // モノクロ
  },
  J: {
    shape: [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
    color: '#0000F0'
  },
  L: {
    shape: [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
    color: '#F0A000'
  },
  O: {
    shape: [[1, 1], [1, 1]],
    color: '#F0F000'
  },
  S: {
    shape: [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
    color: '#00F000'
  },
  T: {
    shape: [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
    color: '#A000F0'
  },
  Z: {
    shape: [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
    color: '#F00000'
  }
};
// ランダムなテトロミノを取得
export const randomTetromino = () => {
  const keys = Object.keys(TETROMINOS);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return { ...TETROMINOS[randomKey] };
};
// ピースを90度回転
export const rotate = (tetromino) => {
  const shape = tetromino.shape;
  const n = shape.length;
  const rotated = Array.from({ length: n }, () => Array(n).fill(0));

  for (let y = 0; y < n; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      rotated[x][n - 1 - y] = shape[y][x];
    }
  }

  return { ...tetromino, shape: rotated };
};
