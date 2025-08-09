import { useState } from 'react';
import styles from './withdraw.module.css';
import { useNavigate } from 'react-router-dom';

export function Withdraw() {
     const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const onWithdraw = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        const accountNumber = e.target.acId.value.trim();
        const amount = e.target.amount.value.trim();

        if (!accountNumber || !amount) {
            setMessage('⚠️ Please fill all fields.');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('https://bank-system-backend-2fdm.onrender.com/api/accounts/withdraw', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    accountNumber,
                    amount
                }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Server error.');
            }

            const data = await res.json();
            setMessage(`✅ Withdraw successful! New balance: ${data.balance}`);
            e.target.reset();
        } catch (error) {
            console.error('Error withdrawing:', error);
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                setMessage('❌ Could not connect to server. Make sure the backend is running.');
            } else {
                setMessage(`❌ Error: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
        <div className={styles.wthCont}>
            <h1>Withdraw Amount</h1>
            <form onSubmit={onWithdraw}>
                <input type="number" placeholder="Account Id" name="acId" />
                <input type="number" placeholder="Amount" name="amount" />
                <input type="submit" value={loading ? 'Processing...' : 'Withdraw'} disabled={loading} />
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
