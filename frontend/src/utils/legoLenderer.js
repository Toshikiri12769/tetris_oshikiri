/**
 * @fileoverview テトロミノのレゴ風描画ユーティリティ
 * @description TETROMINOS の形状を Canvas にレゴブロック風で描画する。
 */

/**
 * 16進カラーを RGB オブジェクトに変換する
 * @param {string} hex - '#RRGGBB' 形式のカラーコード
 * @returns {{ r: number, g: number, b: number }}
 */
const hexToRgb = (hex) => ({
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
});

/**
 * RGB 値を明度調整して16進カラーに変換する
 * @param {{ r: number, g: number, b: number }} rgb
 * @param {number} factor - 1.0 より大きいと明るく、小さいと暗くなる
 * @returns {string} '#RRGGBB' 形式
 */
const adjustBrightness = ({ r, g, b }, factor) => {
    const clamp = (v) => Math.min(255, Math.max(0, Math.round(v * factor)));
    return `rgb(${clamp(r)}, ${clamp(g)}, ${clamp(b)})`;
};

/**
 * 1 つのレゴ風ブロックセルを描画する
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x       - 描画先 X 座標（px）
 * @param {number} y       - 描画先 Y 座標（px）
 * @param {number} size    - セルサイズ（px）
 * @param {string} color   - ベースカラー（'#RRGGBB'）
 */
const drawLegoCell = (ctx, x, y, size, color) => {
    const rgb = hexToRgb(color);
    const highlight = adjustBrightness(rgb, 1.6);  // 左上ハイライト
    const shadow = adjustBrightness(rgb, 0.5);  // 右下シャドウ
    const studColor = adjustBrightness(rgb, 1.3);  // スタッド面
    const border = 3;                            // 縁取り幅（px）
    const studRadius = size * 0.22;                  // スタッド半径
    const studOffsetY = size * 0.08;                 // スタッドをやや上寄りに

    // ── ベース塗りつぶし ──────────────────────────────
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);

    // ── 左・上ハイライト ─────────────────────────────
    ctx.fillStyle = highlight;
    // 上辺
    ctx.fillRect(x, y, size, border);
    // 左辺
    ctx.fillRect(x, y, border, size);

    // ── 右・下シャドウ ───────────────────────────────
    ctx.fillStyle = shadow;
    // 下辺
    ctx.fillRect(x, y + size - border, size, border);
    // 右辺
    ctx.fillRect(x + size - border, y, border, size);

    // ── スタッド（円形）─────────────────────────────
    const cx = x + size / 2;
    const cy = y + size / 2 - studOffsetY;

    // スタッド本体
    ctx.beginPath();
    ctx.arc(cx, cy, studRadius, 0, Math.PI * 2);
    ctx.fillStyle = studColor;
    ctx.fill();

    // スタッド上部ハイライト（小さな白い三日月）
    ctx.beginPath();
    ctx.arc(cx - studRadius * 0.2, cy - studRadius * 0.2, studRadius * 0.55, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.fill();

    // スタッド下部シャドウ
    ctx.beginPath();
    ctx.arc(cx + studRadius * 0.15, cy + studRadius * 0.15, studRadius * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fill();
};

/**
 * テトロミノをレゴ風に Canvas へ描画する
 * @param {CanvasRenderingContext2D} ctx
 * @param {{ shape: number[][], color: string }} tetromino
 * @param {number} originX  - 描画開始 X 座標（px）
 * @param {number} originY  - 描画開始 Y 座標（px）
 * @param {number} cellSize - 1 セルあたりのサイズ（px）。デフォルト 40
 */
export const drawLegoTetromino = (ctx, tetromino, originX = 0, originY = 0, cellSize = 40) => {
    const { shape, color } = tetromino;

    shape.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell !== 0) {
                drawLegoCell(
                    ctx,
                    originX + colIndex * cellSize,
                    originY + rowIndex * cellSize,
                    cellSize,
                    color
                );
            }
        });
    });
};