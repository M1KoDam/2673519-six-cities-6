export default function LoadingPage(): JSX.Element {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: 'white'
    }}
    >
      <div style={{
        width: '48px',
        height: '48px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 2s linear infinite',
        marginBottom: '16px'
      }}
      />
      <p style={{
        fontSize: '16px',
        color: '#2c3e50',
        fontWeight: '500'
      }}
      >
        Loading...
      </p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}
      </style>
    </div>
  );
}
