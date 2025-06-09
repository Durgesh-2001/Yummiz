import React, { useState } from 'react'
import './Login.css'
import './SuccessNotification.css'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { sendOTP, verifyOTP } from '../../services/otpService'
import { toast } from 'react-toastify'

const SuccessNotification = ({ message }) => (
    <div className="success-notification">
        <span className="thumbs-up">👍</span>
        <span>{message}</span>
    </div>
)

const Login = ({ setShowLogin }) => {
    const [currState, setCurrState] = useState({
        name: '',
        email: '',
        password: '',
        mobile: ''
    })
    const [error, setError] = useState('')
    const [isLogin, setIsLogin] = useState(true)
    const [showSuccess, setShowSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [isPhoneLogin, setIsPhoneLogin] = useState(false)
    const [otpSent, setOtpSent] = useState(false)
    const [otp, setOtp] = useState('')
    const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'

    const onChangeHandler = (e) => {
        const { name, value } = e.target
        setCurrState(prev => ({
            ...prev,
            [name]: value
        }))
        setError('')
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        // Validation check
        if ((!isLogin && !currState.name) || !currState.email || !currState.password) {
            setError('Please fill all required fields')
            return
        }

        try {
            const BASE_URL = import.meta.env.VITE_BACKEND_URL;
            const endpoint = isLogin ? '/api/user/login' : '/api/user/register'
            const response = await axios.post(`${BASE_URL}${endpoint}`, currState)

            if (response.data.success) {
                if (isLogin) {
                    if (response.data.token) {  // Check if token exists
                        localStorage.setItem('token', response.data.token)
                        localStorage.setItem('userName', response.data.user.name)
                        setShowSuccess(true)
                        // Reset state
                        setCurrState({ name: '', email: '', password: '', mobile: '' })
                        setTimeout(() => {
                            setShowSuccess(false)
                            setShowLogin(false)
                            window.location.reload() // Reload to update state
                        }, 2000)
                    } else {
                        setError('Authentication failed - No token received')
                    }
                } else {
                    setShowSuccess(true)
                    setTimeout(() => {
                        setShowSuccess(false)
                        setIsLogin(true)
                        setCurrState({ name: '', email: '', password: '', mobile: '' })
                    }, 2000)
                }
            } else {
                setError(response.data.message || 'An error occurred')
            }
        } catch (err) {
            console.error('Registration/Login Error:', err)
            setError(err.response?.data?.message || 'An error occurred during authentication')
        }
    }

    const sendOTPHandler = async () => {
        if (!currState.mobile || currState.mobile.length !== 10) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }
    
        try {
            setError('');
            const result = await sendOTP(currState.mobile);
            if (result.success) {
                setOtpSent(true);
                toast.success('OTP sent successfully! Please check your phone.');
            } else {
                if (result.trialAccount) {
                    toast.error('This number needs to be verified first in Twilio console');
                    setError('For trial account: Please verify this number in Twilio console first');
                } else {
                    setError(result.message);
                    toast.error(result.message);
                }
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message;
            setError(errorMessage);
            toast.error(errorMessage);
        }
    }

    const verifyOTPHandler = async (e) => {
        e.preventDefault()
        if (!otp || otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP')
            return
        }

        try {
            setError('')
            const result = await verifyOTP(currState.mobile, otp)
            if (result.success) {
                localStorage.setItem('token', result.token)
                localStorage.setItem('userName', result.user.name || 'User')
                toast.success('Login successful!')
                setShowSuccess(true)
                setTimeout(() => {
                    setShowSuccess(false)
                    setShowLogin(false)
                    window.location.reload()
                }, 1500)
            }
        } catch (err) {
            setError(err.message)
            toast.error(err.message)
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/api/user/login', {
                email: loginMethod === 'password' ? currState.email : null,
                password: loginMethod === 'password' ? currState.password : null,
                mobile: loginMethod === 'otp' ? currState.mobile : null
            });

            if (response.data.requireOTP) {
                setOtpSent(true);
                toast.success('OTP sent successfully');
            } else if (response.data.success) {
                // Handle successful login
                localStorage.setItem('token', response.data.token);
                setShowLogin(false);
                toast.success('Login successful');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="login-overlay">
            {showSuccess && (
                <SuccessNotification 
                    message={isLogin ? "Successfully logged in!" : "Successfully signed up!"}
                />
            )}
            <div className="login-container">
                <div className="login-title">
                    <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
                    <img 
                        src={assets.cross_icon} 
                        alt="Close" 
                        className="close-button"
                        onClick={() => setShowLogin(false)}
                    />
                </div>

                {error && <div className="error-message">{error}</div>}

                {isLogin && (
                    <div className="login-method-toggle">
                        <button 
                            className={!isPhoneLogin ? 'active' : ''}
                            onClick={() => setIsPhoneLogin(false)}
                        >
                            Email Login
                        </button>
                        <button 
                            className={isPhoneLogin ? 'active' : ''}
                            onClick={() => setIsPhoneLogin(true)}
                        >
                            Phone Login
                        </button>
                    </div>
                )}

                {isLogin && isPhoneLogin ? (
                    <form onSubmit={verifyOTPHandler} className="login-inputs">
                        <div className="phone-input-container">
                            <input
                                type="tel"
                                name="mobile"
                                placeholder="Enter your mobile number"
                                value={currState.mobile}
                                onChange={onChangeHandler}
                                maxLength="10"
                                disabled={otpSent}
                                pattern="[0-9]{10}"
                                title="Please enter a valid 10-digit mobile number"
                                required
                            />
                            {!otpSent && (
                                <button 
                                    type="button" 
                                    className="send-otp-button"
                                    onClick={sendOTPHandler}
                                >
                                    Send OTP
                                </button>
                            )}
                        </div>
                        
                        {otpSent && (
                            <>
                                <div className="otp-input-container">
                                    <input
                                        type="text"
                                        placeholder="Enter 6-digit OTP"
                                        value={otp}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/[^0-9]/g, '')
                                            if (value.length <= 6) setOtp(value)
                                        }}
                                        pattern="[0-9]{6}"
                                        maxLength="6"
                                        required
                                    />
                                    <button 
                                        type="button" 
                                        className="resend-otp-button"
                                        onClick={sendOTPHandler}
                                    >
                                        Resend OTP
                                    </button>
                                </div>
                                <button type="submit" className="submit-button">
                                    Verify & Login
                                </button>
                            </>
                        )}
                    </form>
                ) : (
                    <form onSubmit={onSubmit} className="login-inputs">
                        {!isLogin && (
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={currState.name}
                                onChange={onChangeHandler}
                                required
                            />
                        )}
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={currState.email}
                            onChange={onChangeHandler}
                            required
                        />
                        <div className="password-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={currState.password}
                                onChange={onChangeHandler}
                                required
                            />
                            <button
                                type="button"
                                className="show-password-button"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "👁️" : "👁️‍🗨️"}
                            </button>
                        </div>
                        {!isLogin && (
                            <input
                                type="tel"
                                name="mobile"
                                placeholder="Mobile"
                                value={currState.mobile}
                                onChange={onChangeHandler}
                                maxLength="10"
                            />
                        )}
                        {isLogin ? (
                            <div className="remember-me">
                                <input type="checkbox" id="remember" />
                                <label htmlFor="remember">Remember me</label>
                            </div>
                        ) : (
                            <div className="terms-privacy">
                                <div className="checkbox-wrapper">
                                    <input 
                                        type="checkbox" 
                                        id="terms" 
                                        required
                                    />
                                    <label htmlFor="terms">
                                        I agree to the <a href="/legal">Terms & Conditions</a> and <a href="/about">Privacy Policy</a>
                                    </label>
                                </div>
                            </div>
                        )}

                        <button 
                            type="submit"
                            className="submit-button"
                        >
                            {isLogin ? 'Login' : 'Sign Up'}
                        </button>

                        <p className="toggle-auth">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <span 
                                onClick={() => {
                                    setIsLogin(!isLogin)
                                    setCurrState({ name: '', email: '', password: '', mobile: '' })
                                    setError('')
                                }}
                            >
                                {isLogin ? 'Sign Up' : 'Login'}
                            </span>
                        </p>
                    </form>
                )}
            </div>
        </div>
    )
}

export default Login