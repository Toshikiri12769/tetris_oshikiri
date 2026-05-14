/**
 * @fileoverview ゲーム情報表示コンポーネント
 * @description スコア、ライン数、操作方法、ゲーム状態を表示。
 *              ゲーム開始・再開・一時停止ボタンを提供する。
 * @author BCT Team
 * @version 1.0.0
 */

import React from 'react';

/**
 * @component
 * @param {Object} props - コンポーネントのプロップス
 * @param {number} props.score - 現在のスコア
 * @param {number} props.lines - クリアしたラインの数
 * @param {number} props.highscore - ハイスコア
 * @param {boolean} props.gameOver - ゲームオーバー状態
 * @param {boolean} props.isPaused - ゲーム一時停止状態
 * @param {Function} props.onStart - ゲーム開始時のコールバック
 * @param {Function} props.onPause - 一時停止/再開時のコールバック
 * @returns {React.ReactElement} ゲーム情報パネルの DOM 要素
 */
const GameInfo = ({ score, lines, highscore, gameOver, isPaused, onStart, onPause }) => {
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        color: '#333',
        minWidth: '200px'
    };
    const cardStyle = {
        backgroundColor: '#f0f0f0',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #ddd'
    };
    const titleStyle = {
        fontSize: '14px',
        fontWeight: 'bold',
        marginBottom: '10px'
    };
    const valueStyle = {
        fontSize: '28px',
        fontWeight: 'bold'
    };
    const buttonStyle = {
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: '#333',
        color: 'white',
        border: 'none',
        borderRadius: '4px'
    };
    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <div style={titleStyle}>スコア</div>
                <div style={valueStyle}>{score}</div>
            </div>
            <div style={cardStyle}>
                <div style={titleStyle}>ラインクリア</div>
                <div style={valueStyle}>{lines}</div>
            </div>
            <div style={cardStyle}>
                <div style={titleStyle}>ハイスコア</div>
                <div style={valueStyle}>{highscore}</div>
            </div>
            <div style={cardStyle}>
                <div style={titleStyle}>操作方法</div>
                <div style={{ fontSize: '12px', lineHeight: '1.8' }}>
                    <div>←→: 移動</div>
                    <div>↑: 回転</div>
                    <div>↓: 落下加速</div>
                    <div>Space: 一気落ち</div>
                    <div>P: 一時停止</div>
                </div>
            </div>
            {gameOver && (
                <div style={{ ...cardStyle, backgroundColor: '#ffcccc' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>
                        ゲームオーバー
                    </div>
                </div>
            )}
            <button style={buttonStyle} onClick={gameOver ? onStart : onPause}>
                {gameOver ? 'スタート' : isPaused ? '再開' : '一時停止'}
            </button>
        </div>
    );
};
export default GameInfo;