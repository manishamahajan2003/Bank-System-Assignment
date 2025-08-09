import { useState } from "react";
import styles from './balance.module.css';
import { useNavigate } from 'react-router-dom';

export function Balance() {
     const navigate = useNavigate();
    const [bal, setBal] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const onBalance = async (e) => {
        e.preventDefault();
        setMessage('');
        setBal(null);
        setLoading(true);

        const acId = e.target.acId.value.trim();

        if (!acId) {
            setMessage('⚠️ Please enter an account ID.');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/api/accounts/balance/${acId}`);
            
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Server returned an error.');
            }

            const data = await res.json();
            setBal(data.balance);
        } catch (error) {
            console.error('Error fetching balance:', error);
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
        <div className={styles.balCont}>
            <h1>
                {bal !== null ? `Balance is: INR ${bal}` : 'Check Account Balance'}
            </h1>
            <form onSubmit={onBalance}>
                <input type='number' placeholder='Account Id' name='acId' />
                <input type='submit' value={loading ? 'Checking...' : 'Check Balance'} disabled={loading} />
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
