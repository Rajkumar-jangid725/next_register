'use client'

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useRouter } from 'next/router';
import "bootstrap/dist/css/bootstrap.css";

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const login = async () => {
    setMessage('');
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setMessage("Email or password incorrect");
        return;
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('An error occurred during login:', error);
      setMessage('An unexpected error occurred. Please try again later.');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    login();
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <>
      <section className="vh-100 bg-image">
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-9 col-lg-7 col-xl-6">
              <div className="card" style={{ borderRadius: "15px" }}>
                {message && (
                  <div className="alert alert-danger" role="alert">
                    {message}
                  </div>
                )}
                <div className="card-body p-5">
                  <h2 className="text-uppercase text-center mb-4">Login</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="form-outline mb-2">
                      <label className="form-label">Your Email</label>
                      <input
                        type="text"
                        value={email}
                        className="form-control"
                        placeholder="Enter email"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="form-outline mb-2">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        value={password}
                        className="form-control"
                        placeholder="Enter password"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="d-flex justify-content-center">
                      <button type="submit">Login</button>
                      <span style={{ paddingLeft: "40%" }}>
                        <Link href="/reset" className="fw-bold text-body"><u>Reset Password</u></Link>
                      </span>
                    </div>
                    <div className='mx-auto my-4 flex text-center fw-bold'>
                      or
                    </div>
                    <div>
                      <p className='text-center text-sm text-gray-600 mt-2'>
                        If you don&apos;t have an account, please&nbsp;
                        <Link className='text-blue-500 hover:underline' href='/signup'>
                          Sign Up
                        </Link>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default LoginForm;
