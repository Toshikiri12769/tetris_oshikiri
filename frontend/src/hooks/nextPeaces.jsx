// src/components/NextPiece.jsx

const NextPiece = ({ nextPiece }) => {
  if (!nextPiece) return null;

  const { shape, color } = nextPiece;

  return (
    <div style={{ textAlign: 'center' }}>
      <p>NEXT</p>
      <div
        style={{
          display: 'inline-block',
          padding: '4px',
          background: '#111',
          border: '2px solid #555',
        }}
      >
        {shape.map((row, y) => (
          <div key={y} style={{ display: 'flex' }}>
            {row.map((cell, x) => (
              <div
                key={x}
                style={{
                  width: 24,
                  height: 24,
                  backgroundColor: cell ? color : 'transparent',
                  border: cell ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NextPiece;