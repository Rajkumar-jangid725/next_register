import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ResetSuccess from './ResetSuccess';

function Reset() {
    const [email, setEmail] = useState('');
    const [user, setUser] = useState(null);
    const [alert, setAlert] = useState('');
    const [error, setError] = useState('');

    const resetPassword = async () => {
        if (!validateEmail(email)) {
            setError('Email is invalid');
            return;
        }

        try {
            const response = await fetch('/api/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setUser(data);
                setAlert("Reset password email sent successfully");
            } else if (data.error) {
                setError(data.error);
            } else {
                setError(data.message || 'An unexpected error occurred.');
            }
        } catch (error) {
            console.error('An error occurred:', error);
            setError('An unexpected error occurred. Please try again.');
        }
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
        resetPassword();
    };

    useEffect(() => {
        if (alert || error) {
            const timer = setTimeout(() => {
                setAlert('');
                setError('');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [alert, error]);

    return (
        <section className="vh-100 bg-image">
            <div className="container h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-12 col-md-9 col-lg-7 col-xl-6">
                        <div className="card" style={{ borderRadius: '15px' }}>
                            <div className="card-body p-5">
                                {(alert || error) && (
                                    <div className={`alert ${error ? 'alert-danger' : 'alert-success'} my-10`} role="alert">
                                        {error || alert}
                                    </div>
                                )}
                                {user ? (
                                    <ResetSuccess />
                                ) : (
                                    <>
                                        <h2 className="text-uppercase text-center mb-4">Reset Password</h2>
                                        <form onSubmit={handleResetPassword}>
                                            <div className="form-outline mb-2">
                                                <label className="form-label">Your Email</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    placeholder="Enter email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="d-flex justify-content-center my-3">
                                                <button type="submit" className="btn btn-primary">Reset</button>
                                            </div>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Reset;
