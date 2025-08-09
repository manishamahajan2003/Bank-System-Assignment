import { useState } from 'react';
import styles from './new-customer.module.css';
import { useNavigate } from 'react-router-dom';

export function NewCustomer() {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const onNewCustomer = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        const acId = e.target.acId.value.trim();
        const acNm = e.target.acNm.value.trim();
        const balance = e.target.balance.value.trim();

        if (!acId || !acNm || !balance) {
            setMessage('⚠️ Please fill all fields.');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/accounts/create', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    accountNumber: acId,
                    accountName: acNm,
                    balance
                }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Server returned an error.');
            }

            await res.json();
            setMessage('✅ Customer created successfully!');
            e.target.reset();
        } catch (error) {
            console.error('Error creating customer:', error);
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
        <div className={styles.custCont}>
            <h1>Create New Customer</h1>
            <form onSubmit={onNewCustomer}>
                <input type="number" placeholder="Account Id" name="acId" />
                <input type="text" placeholder="Account Name" name="acNm" />
                <input type="number" placeholder="Balance" name="balance" />
                <input type="submit" value={loading ? 'Creating...' : 'Create'} disabled={loading} />
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
