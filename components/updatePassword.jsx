import { useState } from 'react';
import Link from 'next/link';

export default function PasswordReset() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('/api/updatePassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newPassword, confirmPassword }),
            });

            if (response.ok) {
                setMessage("Password Successfully updated!")
            } else {
                alert('Failed to update password');
            }
        } catch (error) {
            console.error('Error updating password:', error);
        }
    };

    return (
        <section className="vh-100 bg-image">
            <div className="container h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-12 col-md-9 col-lg-7 col-xl-6">
                        <div className="card" style={{ borderRadius: "15px" }}>
                            {message && (
                                <div className='alert alert-success'>
                                    <p className="text-center text-black-10 mt-5 mb-0">
                                        Password Successfully updated.{"  "}
                                        <Link href={"/login"} className="font-bold text-black">
                                            login here
                                        </Link>
                                    </p>
                                </div>
                            )}
                            <div className="card-body p-5">
                                <h2 className="text-uppercase text-center mb-4">Password Reset</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-outline mb-2">
                                        <label className="form-label">New Password</label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            className="form-control"
                                            placeholder="Enter password"
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-outline mb-2">
                                        <label className="form-label">Confirm New Password</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            className="form-control"
                                            placeholder="Enter password"
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                    </div>
                                    <button type="submit">Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
