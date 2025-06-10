import React, { useState } from 'react'
import './Login.css'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import api from '../../config/axios'

const Login = ({ setShowLogin, switchToRegister }) => {
    const [currState, setCurrState] = useState({
        email: '',
        password: '',
        mobile: ''
    })
    const [error, setError] = useState('')
    const [isLogin, setIsLogin] = useState(true)
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

        if (!currState.email || !currState.password) {
            setError('Please fill all required fields')
            return
        }

        try {
            const response = await api.post('/api/user/login', currState)
            
            if (response.data.success) {
                const { token, user } = response.data
                localStorage.setItem('token', token)
                localStorage.setItem('userName', user.name)
                
                toast.success('Welcome back!')
                
                setTimeout(() => {
                    setShowLogin(false)
                    window.location.reload()
                }, 1500)
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Login failed'
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
                
                setTimeout(() => {
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

    return (
        <div className="login-overlay">
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
                            Don't have an account? 
                            <span onClick={switchToRegister}>Sign Up</span>
                        </p>
                    </form>
                )}
            </div>
        </div>
    )
}

export default Login