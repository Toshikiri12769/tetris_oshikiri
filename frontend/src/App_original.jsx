import React, { useEffect, useState } from 'react';  // useState を追加
import Board from './components/Board';
import GameInfo from './components/GameInfo';
import { useGameLogic } from './hooks/useGameLogic';

const App = () => {
    const [isStarted, setIsStarted] = useState(false); //スタートしているかどうかを判定

    const {
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
        togglePause
    } = useGameLogic();

    // ← useEffect による自動開始を削除

    const handleStart = () => {
        startGame();
        setIsStarted(true);
    };

    // キーボード入力
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (!isStarted) return;  // ← スタート前は無効化
            if (gameOver && e.key !== 'Enter') return;
            switch (e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    movePiece(-1, 0);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    movePiece(1, 0);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    movePiece(0, 1);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    rotatePiece();
                    break;
                case ' ':
                    e.preventDefault();
                    hardDrop();
                    break;
                case 'p':
                case 'P':
                    e.preventDefault();
                    togglePause();
                    break;
                default:
                    break;
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isStarted, gameOver, movePiece, rotatePiece, hardDrop, togglePause]);

    // ゲームオーバーになったらスタート画面に戻す
    useEffect(() => {
        if (gameOver) setIsStarted(false);
    }, [gameOver]);

    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    };

    const gameContainerStyle = {
        display: 'flex',
        gap: '30px',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: '30px',
        borderRadius: '16px',
        backdropFilter: 'blur(10px)',
        boxShadow: 'rgba(0, 0, 0, 0.3) 0px 20px 60px',
    };

    const titleStyle = {
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '48px',
        fontWeight: 'bold',
        color: 'white',
        textShadow: 'rgba(0, 0, 0, 0.5) 0px 4px 20px',
        letterSpacing: '4px',
    };

    // ── スタート画面 ──
    if (!isStarted) {
        return (
            <div style={containerStyle}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '40px',
                }}>
                    <div style={titleStyle}>TETRIS</div>
                    <div style={{
                        ...gameContainerStyle,
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '20px',
                    }}>
                        <div style={{ color: 'white', fontSize: '18px', lineHeight: '2' }}>
                            <h1 style={{ color: 'white', fontSize: '36px', lineHeight: '2' }}>TETRIS</h1>
                        </div>
                        <button
                            onClick={handleStart}
                            style={{
                                padding: '14px 48px',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                backgroundColor: '#667eea',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                letterSpacing: '2px',
                            }}
                        >
                            GAME<br></br>START!!
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ── ゲーム画面 ──
    return (
        <>
            <div style={titleStyle}>TETRIS</div>
            <div style={containerStyle}>
                <div style={gameContainerStyle}>
                    <Board board={board} currentPiece={currentPiece} position={position} />
                    <GameInfo
                        score={score}
                        lines={lines}
                        gameOver={gameOver}
                        isPaused={isPaused}
                        onStart={handleStart}
                        onPause={togglePause}
                        nextPiece={nextPiece}
                    />
                </div>
            </div>
        </>
    );
};

export default App;