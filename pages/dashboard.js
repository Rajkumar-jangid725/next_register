import { useEffect, useState } from 'react';

export default function Dashboard() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/getData'); 
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const data = await response.json();
                setUsers(data.data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchUserData();
    }, []); 

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (users.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>User Dashboard</h1>
            {users.map(user => (
                <div key={user.id}>
                    Hello {user.firstName} {user.lastName}!
                </div>
            ))}
        </div>
    );
}