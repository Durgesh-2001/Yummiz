import React, { useState } from 'react'
import './Login.css'
import './SuccessNotification.css'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import api from '../../config/axios'

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
            const endpoint = `/api/user/${isLogin ? 'login' : 'register'}`
            const response = await api.post(endpoint, currState)

            if (response.data.success) {
                const { token, user } = response.data
                // Store auth data
                localStorage.setItem('token', token)
                localStorage.setItem('userName', user.name)
                localStorage.setItem('userEmail', user.email)
                
                // Show success message
                setShowSuccess(true)
                toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!')
                
                // Reset form
                setCurrState({ name: '', email: '', password: '', mobile: '' })
                
                // Redirect after delay
                setTimeout(() => {
                    setShowSuccess(false)
                    setShowLogin(false)
                    window.location.reload()
                }, 1500)
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 
                           (isLogin ? 'Login failed' : 'Registration failed')
            setError(errorMsg)
            toast.error(errorMsg)
        }
    }

    const sendOTPHandler = async () => {
        if (!currState.mobile || currState.mobile.length !== 10) {
            setError('Please enter a valid 10-digit mobile number')
            return
        }

        try {
            setError('')
            const response = await api.post('/api/user/send-otp', { mobile: currState.mobile })
            
            if (response.data.success) {
                setOtpSent(true)
                toast.success('OTP sent successfully!')
            } else {
                throw new Error(response.data.message)
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message
            setError(errorMsg)
            toast.error(errorMsg)
        }
    }

    const verifyOTPHandler = async (e) => {
        e.preventDefault()
        if (!otp || otp.length !== 6) {
            setError('Please enter a valid 6-digit OTP')
            return
        }

        try {
            const response = await api.post('/api/user/verify-otp', {
                mobile: currState.mobile,
                otp
            })

            if (response.data.success) {
                const { token, user } = response.data
                localStorage.setItem('token', token)
                localStorage.setItem('userName', user.name || 'User')
                localStorage.setItem('userEmail', user.email)
                
                toast.success('Login successful!')
                setShowSuccess(true)
                
                setTimeout(() => {
                    setShowSuccess(false)
                    setShowLogin(false)
                    window.location.reload()
                }, 1500)
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'OTP verification failed'
            setError(errorMsg)
            toast.error(errorMsg)
        }
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/user/login', {
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
                localStorage.setItem('userName', response.data.user.name);
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                    setShowLogin(false);
                    window.location.reload();
                }, 2000);
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