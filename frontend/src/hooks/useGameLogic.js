/**
 * @fileoverview ゲームロジックを管理するカスタムフック
 * @description Tetris ゲームの状態管理と核となる処理を実装。
 *              ピースの移動・回転、衝突検出、ライン消去などを担当する。
 * @author BCT Team
 * @version 1.0.0
 */
import { useState, useEffect, useCallback } from 'react';
import { randomTetromino, rotate } from '../utils/tetrominos';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const INITIAL_SPEED = 1000;

const createEmptyBoard = () =>
    Array.from({ length: BOARD_HEIGHT }, () =>
        Array.from({ length: BOARD_WIDTH }, () => ({ filled: false, color: '' }))
    );

export const useGameLogic = () => {
    const [board, setBoard] = useState(createEmptyBoard());
    const [currentPiece, setCurrentPiece] = useState(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [score, setScore] = useState(0);
    const [lines, setLines] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [speed, setSpeed] = useState(INITIAL_SPEED);
    const [nextPiece, setNextPiece] = useState(null);

    // 衝突検出関数
    const checkCollision = useCallback((piece, pos, gameBoard) => {
        if (!piece) return false;

        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    const newY = pos.y + y;
                    const newX = pos.x + x;

                    if (
                        newX < 0 ||
                        newX >= BOARD_WIDTH ||
                        newY >= BOARD_HEIGHT ||
                        (newY >= 0 && gameBoard[newY][newX].filled)
                    ) {
                        return true;
                    }
                }
            }
        }
        return false;
    }, []);

    // ラインを消去
    const clearLines = useCallback((gameBoard) => {
        let linesCleared = 0;
        const newBoard = gameBoard.filter(row => {
            const isFull = row.every(cell => cell.filled);
            if (isFull) linesCleared++;
            return !isFull;
        });

        while (newBoard.length < BOARD_HEIGHT) {
            newBoard.unshift(
                Array.from({ length: BOARD_WIDTH }, () => ({ filled: false, color: '' }))
            );
        }

        if (linesCleared > 0) {
            setLines(prev => prev + linesCleared);
            const points = [0, 100, 300, 500, 800][linesCleared] || 0;
            setScore(prev => prev + points);
        }

        return { clearedBoard: newBoard, linesCleared };
    }, []);

    // スコア送信
    const saveScore = async (finalScore, finalLines) => {
        try {
            await fetch('http://localhost:3001/api/scores', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ score: finalScore, lines: finalLines }),
            });
            console.log('サーバーへ送信完了');
        } catch (error) {
            console.error('送信失敗:', error);
        }
    };

    // ピースを即時固定して次ピースへ切り替える
    const lockPiece = useCallback((landedPosition) => {
        if (!currentPiece) return;

        // 着地位置を引数から直接使用してボードを生成（stateのpositionに依存しない）
        const mergedBoard = (() => {
            const b = board.map(row => [...row]);
            for (let y = 0; y < currentPiece.shape.length; y++) {
                for (let x = 0; x < currentPiece.shape[y].length; x++) {
                    if (currentPiece.shape[y][x]) {
                        const boardY = landedPosition.y + y;
                        const boardX = landedPosition.x + x;
                        if (boardY >= 0 && boardY < BOARD_HEIGHT) {
                            b[boardY][boardX] = { filled: true, color: currentPiece.color };
                        }
                    }
                }
            }
            return b;
        })();

        const { clearedBoard, linesCleared } = clearLines(mergedBoard);
        const spawned = nextPiece || randomTetromino();
        const spawnPos = { x: 3, y: 0 };

        // ゲームオーバー判定
        if (checkCollision(spawned, spawnPos, clearedBoard)) {
            setBoard(clearedBoard);
            setGameOver(true);
            // clearLines内でsetLinesが走るため、最新値はprevで算出
            setLines(prev => {
                const finalLines = prev;
                setScore(prevScore => {
                    saveScore(prevScore, finalLines);
                    return prevScore;
                });
                return prev;
            });
            return;
        }

        // ボード・ピース・位置を一括更新 → 次ピースが即座に出現
        setBoard(clearedBoard);
        setCurrentPiece(spawned);
        setNextPiece(randomTetromino());
        setPosition(spawnPos);
    }, [currentPiece, board, nextPiece, clearLines, checkCollision]);

    // ゲーム開始
    const startGame = useCallback(() => {
        setBoard(createEmptyBoard());
        setCurrentPiece(randomTetromino());
        setNextPiece(randomTetromino());
        setPosition({ x: 3, y: 0 });
        setScore(0);
        setLines(0);
        setGameOver(false);
        setIsPaused(false);
        setSpeed(INITIAL_SPEED);
    }, []);

    // ピースの移動
    const movePiece = useCallback((dx, dy) => {
        if (gameOver || isPaused || !currentPiece) return;

        const newPos = { x: position.x + dx, y: position.y + dy };
        if (!checkCollision(currentPiece, newPos, board)) {
            setPosition(newPos);
            return false;
        }
        return true;
    }, [currentPiece, position, board, gameOver, isPaused, checkCollision]);

    // ピースの回転
    const rotatePiece = useCallback(() => {
        if (gameOver || isPaused || !currentPiece) return;

        const rotated = rotate(currentPiece);
        if (!checkCollision(rotated, position, board)) {
            setCurrentPiece(rotated);
        }
    }, [currentPiece, position, board, gameOver, isPaused, checkCollision]);

    // ハードドロップ
    const hardDrop = useCallback(() => {
        if (gameOver || isPaused || !currentPiece) return;

        let newY = position.y;
        while (!checkCollision(currentPiece, { x: position.x, y: newY + 1 }, board)) {
            newY++;
        }
        // 着地位置を確定してそのまま即固定
        lockPiece({ x: position.x, y: newY });
    }, [currentPiece, position, board, gameOver, isPaused, checkCollision, lockPiece]);

    // 一時停止
    const togglePause = useCallback(() => {
        if (!gameOver) setIsPaused(prev => !prev);
    }, [gameOver]);

    // 落下ループ
    useEffect(() => {
        if (gameOver || isPaused || !currentPiece) return;

        const interval = setInterval(() => {
            setPosition(prev => {
                const newPos = { x: prev.x, y: prev.y + 1 };

                if (checkCollision(currentPiece, newPos, board)) {
                    // 着地：現在位置を渡して即固定・次ピースへ切り替え
                    lockPiece(prev);
                    return prev; // positionはlockPiece内でリセットされる
                }

                return newPos; // 通常落下
            });
        }, speed);

        return () => clearInterval(interval);
    }, [currentPiece, board, gameOver, isPaused, speed, checkCollision, lockPiece]);

    return {
        board,
        score,
        lines,
        gameOver,
        isPaused,
        currentPiece,
        position,
        nextPiece,
        startGame,
        movePiece,
        rotatePiece,
        hardDrop,
        togglePause,
    };
};