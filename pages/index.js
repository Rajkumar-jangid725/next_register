"use client";

import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Link from "next/link";
import bcrypt from "bcryptjs";

export default function Home() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setErrorMessage("Invalid email format.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    setErrorMessage("");

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const response = await fetch("/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password: hashedPassword,
        }),
      });

      if (response.ok) {
        setIsRegistered(true);
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          setIsRegistered(false);
        }, 3000);
      } else {
        alert("An error occurred");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    }
  };

  return (
    <section className="vh-100 bg-image">
      <div className="container h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-9 col-lg-7 col-xl-6">
            <div className="card" style={{ borderRadius: "15px" }}>
              {isRegistered && (
                <div className="alert alert-success" role="alert">
                  Welcome! You have successfully registered.
                  <Link href="/login" className="fw-bold text-body">
                    Login here
                  </Link>
                </div>
              )}
              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}
              <div className="card-body p-5">
                <h2 className="text-uppercase text-center mb-4">Registration</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-row mb-2">
                    <div className="col">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        value={firstName}
                        className="form-control"
                        placeholder="Enter first name"
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="col">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        value={lastName}
                        className="form-control"
                        placeholder="Enter last name"
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  </div>
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
                  <div className="form-outline mb-2">
                    <label className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      className="form-control"
                      placeholder="Confirm password"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <div className="d-flex justify-content-center">
                    <button type="submit">Register</button>
                  </div>
                  <p className="text-center text-muted mt-5 mb-0">
                    Have already an account?{" "}
                    <Link href="/login" className="fw-bold text-body">
                      Login here
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
