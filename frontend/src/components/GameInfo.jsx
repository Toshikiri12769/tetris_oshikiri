import React from 'react';

// ── SVGアイコン ──────────────────────────────
const PlayIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5,3 19,12 5,21" />
    </svg>
);

const PauseIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <rect x="5" y="3" width="4" height="18" />
        <rect x="15" y="3" width="4" height="18" />
    </svg>
);
// ────────────────────────────────────────────

const GameInfo = ({ score, lines, highscore,gameOver, isPaused, onStart, onPause, nextPiece }) => {

    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        color: '#333',
        minWidth: '200px'
    };
    const cardStyle = {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: '20px',
        borderRadius: '8px',
    };
    const titleStyle = {
        color: 'white',
        fontSize: '14px',
        fontWeight: 'bold',
        marginBottom: '10px',
        textAlign: 'left',
        opacity: '1'
    };
    const valueStyle = {
        fontSize: '28px',
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'left',
    };
    const buttonStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        border: 'none',
        backgroundColor: 'transparent',
        border: '3px solid rgba(255,255,255,0.95)',
        color: 'rgba(255,255,255,0.95)',    // ← SVGは currentColor なのでこれで白になる
        cursor: 'pointer',
    };

    return (
        <div style={containerStyle}>

            {/* ── NEXT ピース表示 ── */}
            <div style={cardStyle}>
                <div style={titleStyle}>NEXT</div>
                {nextPiece && (
                    <div
                        style={{
                            display: 'inline-block',
                            padding: 12,
                            backgroundColor: '#000',
                            border: '1px solid #111',
                            borderRadius: 4,
                        }}
                    >
                        {nextPiece.shape
                            .filter(row => row.some(cell => cell))
                            .map((row, y) => (
                                <div key={y} style={{ display: 'flex' }}>
                                    {row.map((cell, x) => (
                                        <div
                                            key={x}
                                            style={{
                                                width: 24,
                                                height: 24,
                                                backgroundColor: cell ? nextPiece.color : '#111',
                                                border: cell
                                                    ? '1px solid rgba(255,255,255,0.3)'
                                                    : '1px solid #222',
                                            }}
                                        />
                                    ))}
                                </div>
                            ))}
                    </div>
                )}
            </div>

            {/* ── スコア ── */}
            <div style={cardStyle}>
                <div style={titleStyle}>スコア</div>
                <div style={valueStyle}>🏆{score}</div>
            </div>

            {/* ── ラインクリア ── */}
            <div style={cardStyle}>
                <div style={titleStyle}>ラインクリア</div>
                <div style={valueStyle}>{lines}</div>
            </div>
            <div style={cardStyle}>
                <div style={titleStyle}>ハイスコア</div>
                <div style={valueStyle}>{highscore}</div>
            </div>

            {/* ── 操作方法 ── */}
            <div style={cardStyle}>
                <div style={titleStyle}>操作方法</div>
                <div style={{ fontSize: '12px', lineHeight: '1.8', textAlign: 'left', color: 'white' }}>
                    <div>←→: 移動</div>
                    <div>↑: 回転</div>
                    <div>↓: 落下加速</div>
                    <div>Space: 一気落ち</div>
                    <div>P: 一時停止</div>
                </div>
            </div>

            {/* ── ゲームオーバー ── */}
            {gameOver && (
                <div style={{ ...cardStyle, backgroundColor: '#ffcccc' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center' }}>
                        ゲームオーバー
                    </div>
                </div>
            )}

            {/* ── ボタン ── */}
            <button style={buttonStyle} onClick={gameOver ? onStart : onPause}>
                {gameOver || isPaused ? <PlayIcon /> : <PauseIcon />}
            </button>

        </div>
    );
};

export default GameInfo;