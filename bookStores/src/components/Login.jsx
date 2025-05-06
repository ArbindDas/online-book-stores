import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { useSelector } from "react-redux";

const Login = () => {
    const navigate = useNavigate();
    const auth = getAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [errormsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const { isAuthenticated } = useSelector(state => state.user);

    const handleLogin = (e) => {
        e.preventDefault();

        setErrorMsg('');
        setEmailError('');
        setPasswordError('');

        if (!email) {
            setEmailError('Email is required.');
        }
        if (!password) {
            setPasswordError('Password is required.');
        }
        if (!email || !password) {
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                setSuccessMsg('Login successful. You will now be redirected to the Home page');
                setEmail('');
                setPassword('');
                setErrorMsg('');

                setTimeout(() => {
                    setSuccessMsg('');
                    navigate('/');
                }, 1500);
            })
            .catch(error => setErrorMsg(error.message));
    };
    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
    
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const domainPart = value.split('@')[1]; // Extract the part after '@'
    
        if (/^[0#]/.test(value)) {
            setEmailError('Email should not start with 0 or special characters like #');
        } else if (domainPart && /[^a-zA-Z.]/.test(domainPart)) {
            setEmailError('The domain part (after @) should not contain numbers or special characters.');
        } else if (!emailRegex.test(value)) {
            setEmailError('Please enter a valid email address.');
        } else {
            setEmailError('');
        }
    };
    

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);

        if (value.length < 6) {
            setPasswordError("Password must be at least 6 characters long.");
        } else if (!/[A-Z]/.test(value)) {
            setPasswordError("Password must contain at least one uppercase letter.");
        } else if (!/[0-9]/.test(value)) {
            setPasswordError("Password must contain at least one number.");
        } else if (!/[!@#$%^&*]/.test(value)) {
            setPasswordError("Password must contain at least one special character.");
        } else if (value === '') {
            setPasswordError("Password is required.");
        } else {
            setPasswordError("");
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [])
    return (
        <div className="login-container">
            <div className="login-form">
                <h2>Login</h2>
                {successMsg && (
                    <div className="success-msg">
                        {successMsg}
                    </div>
                )}
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            placeholder="Enter your email"
                            onChange={handleEmailChange}
                        />
                    </div>
                    {emailError && <span className='emailError'>{emailError}</span>}

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            placeholder="Enter your password"
                            onChange={handlePasswordChange}
                        />
                    </div>
                    {passwordError && <span className='passwordError'>{passwordError}</span>}

                    {errormsg && (
                        <div className="error-msg">
                            {errormsg}
                        </div>
                    )}

                    <button type="submit">Login</button>
                </form>
                <p>
                    Don't have an account? <Link to="/signup">Sign Up here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
