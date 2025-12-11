import React, { useEffect } from 'react';

const Notification = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 4000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return '#4CAF50';
            case 'error':
                return '#f44336';
            case 'warning':
                return '#FF9800';
            case 'info':
                return '#2196F3';
            default:
                return '#333';
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: getBackgroundColor(),
            color: 'white',
            padding: '16px 24px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 9999,
            minWidth: '300px',
            maxWidth: '500px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            animation: 'slideIn 0.3s ease-out'
        }}>
            <span style={{ flex: 1 }}>{message}</span>
            <button
                onClick={onClose}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    fontSize: '20px',
                    cursor: 'pointer',
                    marginLeft: '16px',
                    padding: '0',
                    lineHeight: '1'
                }}
            >
                ×
            </button>
            <style>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};

export default Notification;
