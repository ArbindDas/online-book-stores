import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, fs } from '../config/Config';
import './SignUp.css';
import { useSelector } from 'react-redux';

const SignUp = () => {
    const navigate = useNavigate();

    const [fullName, setFullname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errormsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const [nameError, setNameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [emailError, setEmailError] = useState("");

    const { isAuthenticated } = useSelector(state => state.user);



    const handleFullNameChange = (e) => {
        const value = e.target.value;
        setFullname(value);
        const invalidCharsRegex = /[\'\"\d\+\-_/=@#\$\%\^\&\*\(\)\!\[\]\{\}\|\\~`]/;

        if (invalidCharsRegex.test(value)) {
            setNameError("Invalid name: Name should not contain numbers, special characters, or quotes.");
        } else if (value.trim() === '') {
            setNameError("Full name is required.");
        } else if (value.length < 3) {
            setNameError("Full name must be at least 3 characters long.");
        } else {
            setNameError('');
        }
    };

    // const handleEmailChange = (e) => {
    //     const value = e.target.value;
    //     setEmail(value);
    //     const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //     if (/^[0#]/.test(value)) {
    //         setEmailError('Email should not start with 0 or special characters like #');
    //     } else if (!emailRegex.test(value)) {
    //         setEmailError('Please enter a valid email address.');
    //     } else if (value === '') {
    //         setEmailError("Email is required.");
    //     } else {
    //         setEmailError('');
    //     }
    // };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
    
        // Regular expression for valid email
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
        // Check for invalid starting characters after '@'
        const domainCheck = value.split('@')[1]; // Get the part after '@'
        const invalidDomainRegex = /^[^a-zA-Z]/; // Checks if domain starts with anything other than a letter
    
        if (/^[0#]/.test(value)) {
            setEmailError('Email should not start with 0 or special characters like #');
        } else if (domainCheck && invalidDomainRegex.test(domainCheck)) {
            setEmailError('The domain part (after @) should not contain numbers or special characters.');
        } else if (!emailRegex.test(value)) {
            setEmailError('Please enter a valid email address.');
        } else if (value === '') {
            setEmailError("Email is required.");
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

    const handleSignup = (e) => {
        e.preventDefault();


        if (!fullName) {
            setNameError("Full name is required.");
        }
        if (!email) {
            setEmailError("Email is required.");
        }
        if (!password) {
            setPasswordError("Password is required.");
        }


        if (passwordError || nameError || emailError || !fullName || !email || !password) {
            setErrorMsg("Please fix the errors before submitting.");
            return;
        }


        auth.createUserWithEmailAndPassword(email, password).then((credentials) => {
            console.log(credentials.user.uid);

            fs.collection('users').doc(credentials.user.uid).set({
                fullName: fullName,
                email: email,
                password: password
            }).then(() => {
                setSuccessMsg('Signup successful. You will now be redirected to Login');
                setFullname('');
                setEmail('');
                setPassword('');
                setErrorMsg('');

                setTimeout(() => {
                    setSuccessMsg('');
                    navigate('/login');
                }, 1500);
            }).catch(error => {
                console.log("nested catch", error);

                setErrorMsg(error.message)
            });

        }).catch((error) => {
            console.log("outer catch", error);

            setErrorMsg(error.message);
        });
    };

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/");
        }
    }, [])

    return (
        <div className="signup-container">
            <div className="signup-form">
                <h2>Sign Up</h2>
                {successMsg && <>
                    <div className='success-msg'>
                        {successMsg}
                    </div>
                </>}
                <form onSubmit={handleSignup}>
                    <div className="form-group">
                        <label htmlFor="fullName">Full Name</label>
                        <input
                            type="text"
                            id="fullName"
                            value={fullName}
                            placeholder="Enter your full name"
                            onChange={handleFullNameChange}
                        />
                        <span className='nameError'>{nameError}</span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            placeholder="Enter your email"
                            onChange={handleEmailChange}
                        />
                        <span className='emailError'>{emailError}</span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            placeholder="Enter your password"
                            onChange={handlePasswordChange}
                        />
                        <span className='passwordError'>{passwordError}</span>
                    </div>

                    <button type="submit">Sign Up</button>
                </form>
                {errormsg && <>
                    <div className='error-msg'>
                        {errormsg}
                    </div>
                </>}

                <p>
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
