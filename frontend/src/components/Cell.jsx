/**
 * @fileoverview 個別セル表示コンポーネント（レゴ風）
 * @description ゲームボード上の 1 マスを表示。
 *              filled が true の場合はレゴブロック風の立体表現で描画する。
 * @author BCT Team
 * @version 1.0.0
 */
import React from 'react';

/**
 * @component
 * @param {Object}  props
 * @param {boolean} props.filled - セルが埋まっているかどうか
 * @param {string}  props.color  - セルの色（CSS カラー値）
 * @returns {React.ReactElement} セルの DOM 要素
 */
const Cell = ({ filled, color }) => {
    const cellStyle = {
        width: '30px',
        height: '30px',
        boxSizing: 'border-box',
        position: 'relative',
        backgroundColor: filled ? color : '#111',
        borderTop: filled ? '3px solid rgba(255,255,255,0.6)' : '1px solid #222',
        borderLeft: filled ? '3px solid rgba(255,255,255,0.6)' : '1px solid #222',
        borderBottom: filled ? '3px solid rgba(0,0,0,0.4)' : '1px solid #222',
        borderRight: filled ? '3px solid rgba(0,0,0,0.4)' : '1px solid #222',
    };

    const studStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -60%)',
        width: '13px',
        height: '13px',
        borderRadius: '50%',
        backgroundColor: color,
        filter: 'brightness(1.3)',
        boxShadow: '-1px -1px 2px rgba(255,255,255,0.4), 1px 1px 2px rgba(0,0,0,0.3)',
    };

    return (
        <div style={cellStyle}>
            {filled && <div style={studStyle} />}
        </div>
    );
};

export default Cell;