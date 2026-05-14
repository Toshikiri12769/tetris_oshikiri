/**
 * @fileoverview メインアプリケーションコンポーネント
 * @description Tetris ゲームの主要コンポーネント。
 *              ゲームボード、ゲーム情報、キーボード操作を統合して管理。
 * @author BCT Team
 * @version 1.0.0
 */
import React, { useEffect } from 'react';
import Board from './components/Board';
import GameInfo from './components/GameInfo';
import { useGameLogic } from './hooks/useGameLogic';
import useHighScore from './hooks/useHighScore';

const App = () => {
  const {
    board,
    score,
    lines,
    gameOver,
    isPaused,
    currentPiece,
    position,
    startGame,
    movePiece,
    rotatePiece,
    hardDrop,
    togglePause,
    saveScore
  } = useGameLogic();

  // ハイスコア取得フック
  const { 
    highscore, 
    loading: highLoading, 
    error: highError, 
    refresh 
  } = useHighScore();

  // キーボード入力
  useEffect(() => {
    const handleKeyPress = (e) => {
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
  }, [gameOver, movePiece, rotatePiece, hardDrop, togglePause]);
  // ゲーム開始
  useEffect(() => {
    startGame();
  }, [startGame]);

  // 追加: ゲームオーバー時にスコア送信してからハイスコアを再取得
  useEffect(() => {
    if (!gameOver) return;
    (async () => {
      try {
        // saveScore は true/false を返す実装のまま想定
        const ok = await saveScore(score, lines);
        if (ok) {
          // 再取得（成功時のみ）
          await refresh();
        } else {
          // 送信失敗でも一応再取得しておく（任意）
          await refresh();
        }
      } catch (err) {
        console.error('game over save/refresh error:', err);
      }
    })();
  }, [gameOver]); // gameOver が true になったタイミングで実行

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

  return (
    <>
      <div style={titleStyle}>TETRIS</div>
      <div style={containerStyle}>
        <div style={gameContainerStyle}>
          <Board board={board} currentPiece={currentPiece} position={position} />
          <GameInfo
            score={score}
            lines={lines}
            highscore={highLoading ? '読み込み中...' : (highError ? '取得失敗' : highscore)}
            gameOver={gameOver}
            isPaused={isPaused}
            onStart={startGame}
            onPause={togglePause}
          />
        </div>
      </div>
    </>
  );
};
export default App;
