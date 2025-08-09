import { useState } from 'react';
import styles from './transfer.module.css';
import { useNavigate } from 'react-router-dom';

export function Transfer() {
     const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const onTransfer = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        const fromAccount = e.target.srcId.value.trim();
        const toAccount = e.target.destId.value.trim();
        const amount = e.target.amount.value.trim();

        if (!fromAccount || !toAccount || !amount) {
            setMessage('⚠️ Please fill all fields.');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/accounts/transfer', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fromAccount,
                    toAccount,
                    amount: Number(amount)
                })
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Server error occurred.');
            }

            const data = await res.json();
            setMessage(`✅ ${data.message}`);
            e.target.reset();
        } catch (error) {
            console.error('Transfer error:', error);
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                setMessage('❌ Could not connect to server. Make sure backend is running.');
            } else {
                setMessage(`❌ ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
        <div className={styles.trnCont}>
            <h1>Transfer Amount</h1>
            <form onSubmit={onTransfer}>
                <input type='number' placeholder='Source Id' name='srcId' />
                <input type='number' placeholder='Destination Id' name='destId' />
                <input type='number' placeholder='Amount' name='amount' />
                <input type='submit' value={loading ? 'Transferring...' : 'Transfer'} disabled={loading} />
            </form>
            {message && <p>{message}</p>}
        </div>
        <button 
            onClick={() => navigate('/')} 
            style={{
                marginTop: '20px',
                padding: '8px 16px',
                backgroundColor: '#ccc',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                marginLeft: '550px',
            }}
        >
            ⬅ Back to Home
        </button>
        </div>
    );
}
