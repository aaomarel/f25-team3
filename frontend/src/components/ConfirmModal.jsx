import React from 'react';

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }} onClick={onCancel}>
            <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '8px',
                maxWidth: '400px',
                width: '90%',
                textAlign: 'center'
            }} onClick={(e) => e.stopPropagation()}>
                <p style={{ 
                    fontSize: '1.1rem', 
                    marginBottom: '1.5rem',
                    color: '#2D3436'
                }}>
                    {message}
                </p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button 
                        onClick={onConfirm}
                        style={{
                            padding: '10px 24px',
                            backgroundColor: '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        Yes, Confirm
                    </button>
                    <button 
                        onClick={onCancel}
                        style={{
                            padding: '10px 24px',
                            backgroundColor: '#666',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
