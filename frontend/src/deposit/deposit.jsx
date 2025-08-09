import { useState } from 'react';
import styles from './deposit.module.css';
import { useNavigate } from 'react-router-dom';

export function Deposit() {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const onDeposit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        const acId = e.target.acId.value.trim();
        const amount = e.target.amount.value.trim();

        if (!acId || !amount) {
            setMessage('⚠️ Please fill all fields.');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('https://bank-system-backend-2fdm.onrender.com/api/accounts/deposit', {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    accountNumber: Number(acId),
                    amount: Number(amount)
                })
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Server error.');
            }

            const data = await res.json();
            setMessage(`✅ Deposit successful! New Balance: ${data.balance}`);
            e.target.reset();
        } catch (err) {
            console.error('Deposit error:', err);
            if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
                setMessage('❌ Could not connect to server. Make sure the backend is running.');
            } else {
                setMessage(`❌ ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
        <div className={styles.depCont}>
            <h1>Deposit Amount</h1>
            <form onSubmit={onDeposit}>
                <input type="number" placeholder="Account Id" name="acId" />
                <input type="number" placeholder="Amount" name="amount" />
                <input type="submit" value={loading ? 'Depositing...' : 'Deposit'} disabled={loading} />
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
