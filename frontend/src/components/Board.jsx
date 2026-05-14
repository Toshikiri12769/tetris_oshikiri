/**
 * @fileoverview ゲームボード表示コンポーネント
 * @description Tetris ゲームの 10x20 グリッドを表示。
 *              固定されたセルと現在落下中のピースを描画する。
 * @author BCT Team
 * @version 1.0.0
 */

import React from 'react';
import Cell from './Cell';

/**
 * @component
 * @param {Object} props - コンポーネントのプロップス
 * @param {Array<Array<Object>>} props.board - ゲームボード（10x20 のグリッド）
 * @param {Object} props.currentPiece - 現在落下中のピース
 * @param {Array<Array<number>>} props.currentPiece.shape - ピースの形状
 * @param {string} props.currentPiece.color - ピースの色
 * @param {Object} props.position - ピースの位置 { x, y }
 * @returns {React.ReactElement} ゲームボードの DOM 要素
 */
const Board = ({ board, currentPiece, position }) => {
    // 現在のピースを描画用ボードに追加
    const displayBoard = board.map(row => [...row]);

    if (currentPiece) {
        for (let y = 0; y < currentPiece.shape.length; y++) {
            for (let x = 0; x < currentPiece.shape[y].length; x++) {
                if (currentPiece.shape[y][x]) {
                    const boardY = position.y + y;
                    const boardX = position.x + x;
                    if (boardY >= 0 && boardY < board.length) {
                        displayBoard[boardY][boardX] = {
                            filled: true,
                            color: currentPiece.color
                        };
                    }
                }
            }
        }
    }
    const boardStyle = {
        display: 'grid',
        gridTemplateColumns: `repeat(10, 30px)`,
        gap: '0px',
        border: '2px solid #333'
    };
    return (
        <div style={boardStyle}>
            {displayBoard.map((row, y) =>
                row.map((cell, x) => (
                    <Cell key={`${y}-${x}`} filled={cell.filled} color={cell.color} />
                ))
            )}
        </div>
    );
};
export default Board;
