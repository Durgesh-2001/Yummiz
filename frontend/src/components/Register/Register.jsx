import React, { useState, useContext } from 'react'
import { ThemeContext } from '../../context/ThemeContext'
import './Register.css'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import api from '../../config/axios'

const Register = ({ setShowLogin, switchToLogin }) => {
    const { theme } = useContext(ThemeContext)
    const [currState, setCurrState] = useState({
        name: '',
        email: '',
        password: '',
        mobile: ''
    })
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)

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

        if (!currState.name || !currState.email || !currState.password) {
            setError('Please fill all required fields')
            return
        }

        try {
            const response = await api.post('/api/user/register', currState)

            if (response.data.success) {
                toast.success('Account created successfully!')
                setCurrState({ name: '', email: '', password: '', mobile: '' })
                
                setTimeout(() => {
                    switchToLogin()
                }, 1500)
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Registration failed'
            setError(errorMsg)
            toast.error(errorMsg)
        }
    }

    return (
        <div className={`login-overlay ${theme}`}>
            <div className={`login-container ${theme}`}>
                <div className="login-title">
                    <h2>Sign Up</h2>
                    <img 
                        src={assets.cross_icon} 
                        alt="Close" 
                        className="close-button"
                        onClick={() => setShowLogin(false)}
                    />
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={onSubmit} className="login-inputs">
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={currState.name}
                        onChange={onChangeHandler}
                        required
                    />
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
                    <input
                        type="tel"
                        name="mobile"
                        placeholder="Mobile"
                        value={currState.mobile}
                        onChange={onChangeHandler}
                        maxLength="10"
                    />
                    
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

                    <button type="submit" className="submit-button">
                        Sign Up
                    </button>

                    <p className="toggle-auth">
                        Already have an account? 
                        <span onClick={switchToLogin}>Login</span>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default Register
