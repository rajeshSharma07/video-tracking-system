import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    firstName: '',
    lastName: ''
  });
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const { register, isAuthenticated, error, clearError } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
    }

    // Set form error from context error
    if (error) {
      setFormError(error);
      setIsLoading(false);
      clearError();
    }
    // eslint-disable-next-line
  }, [isAuthenticated, error]);

  const { username, email, password, password2, firstName, lastName } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validateStep1 = () => {
    if (!username || !email || !password || !password2) {
      setFormError('Please fill in all required fields');
      return false;
    }

    if (password !== password2) {
      setFormError('Passwords do not match');
      return false;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return false;
    }

    return true;
  };

  const nextStep = () => {
    if (validateStep1()) {
      setFormError('');
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    setFormError('');
    setCurrentStep(1);
  };

  const onSubmit = async e => {
    e.preventDefault();

    if (currentStep === 1 && !validateStep1()) {
      return;
    }

    setIsLoading(true);

    try {
      // Remove password2 from data sent to server
      const registerData = { ...formData };
      delete registerData.password2;

      await register(registerData);
    } catch (err) {
      console.error('Registration error:', err);
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join VideoTracker to track your learning progress</p>
          </div>

          {formError && (
            <div className="auth-alert">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <span>{formError}</span>
            </div>
          )}

          <div className="steps-indicator">
            <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-text">Account</div>
            </div>
            <div className="step-line"></div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-text">Profile</div>
            </div>
          </div>

          <form className="auth-form" onSubmit={onSubmit}>
            {currentStep === 1 && (
              <div className="step-content">
                <div className="form-group">
                  <label htmlFor="username">Username*</label>
                  <div className="input-group">
                    <span className="input-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </span>
                    <input
                      id="username"
                      type="text"
                      placeholder="Choose a username"
                      name="username"
                      value={username}
                      onChange={onChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address*</label>
                  <div className="input-group">
                    <span className="input-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                      </svg>
                    </span>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      name="email"
                      value={email}
                      onChange={onChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password*</label>
                  <div className="input-group">
                    <span className="input-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                      </svg>
                    </span>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      name="password"
                      value={password}
                      onChange={onChange}
                      className="form-control"
                      minLength="6"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={toggleShowPassword}
                      tabIndex="-1"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                          <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <div className="password-hint">Password must be at least 6 characters</div>
                </div>

                <div className="form-group">
                  <label htmlFor="password2">Confirm Password*</label>
                  <div className="input-group">
                    <span className="input-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                      </svg>
                    </span>
                    <input
                      id="password2"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      name="password2"
                      value={password2}
                      onChange={onChange}
                      className="form-control"
                      minLength="6"
                      required
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="auth-button"
                  onClick={nextStep}
                >
                  Continue
                </button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="step-content">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <div className="input-group">
                    <span className="input-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </span>
                    <input
                      id="firstName"
                      type="text"
                      placeholder="Enter your first name"
                      name="firstName"
                      value={firstName}
                      onChange={onChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <div className="input-group">
                    <span className="input-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </span>
                    <input
                      id="lastName"
                      type="text"
                      placeholder="Enter your last name"
                      name="lastName"
                      value={lastName}
                      onChange={onChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-buttons">
                  <button
                    type="button"
                    className="auth-button-secondary"
                    onClick={prevStep}
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    className={`auth-button ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner"></span>
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="auth-footer">
            <p>
              Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .auth-page {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
          padding: 2rem 1rem;
        }

        .auth-container {
          width: 100%;
          max-width: 500px;
        }

        .auth-card {
          background-color: var(--background-light);
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          padding: 2.5rem;
          animation: fadeIn 0.5s ease-in-out;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .auth-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: var(--text-color);
        }

        .auth-subtitle {
          color: var(--text-light);
          font-size: 1rem;
        }

        .auth-alert {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background-color: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border-radius: var(--border-radius);
          margin-bottom: 1.5rem;
        }

        .steps-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .step-number {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: var(--background-dark);
          color: var(--text-light);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          transition: var(--transition);
        }

        .step.active .step-number {
          background-color: var(--primary-color);
          color: white;
        }

        .step-text {
          font-size: 0.875rem;
          color: var(--text-light);
          font-weight: 500;
        }

        .step.active .step-text {
          color: var(--primary-color);
        }

        .step-line {
          flex-grow: 1;
          height: 2px;
          background-color: var(--background-dark);
          margin: 0 1rem;
          position: relative;
          max-width: 100px;
        }

        .step-line::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: ${currentStep > 1 ? '100%' : '0'};
          background-color: var(--primary-color);
          transition: width 0.3s ease;
        }

        .auth-form {
          margin-bottom: 1.5rem;
        }

        .step-content {
          animation: fadeIn 0.3s ease-in-out;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .input-group {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          color: var(--text-lighter);
        }

        .form-control {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.75rem;
          font-size: 1rem;
          border: 1px solid #d1d5db;
          border-radius: var(--border-radius);
          transition: var(--transition);
        }

        .form-control:focus {
          border-color: var(--primary-color);
          outline: none;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          background: none;
          border: none;
          color: var(--text-lighter);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .password-toggle:hover {
          color: var(--text-light);
        }

        .password-hint {
          font-size: 0.75rem;
          color: var(--text-lighter);
          margin-top: 0.5rem;
        }

        .form-buttons {
          display: flex;
          gap: 1rem;
        }

        .auth-button, .auth-button-secondary {
          padding: 0.875rem 1.5rem;
          font-size: 1rem;
          font-weight: 500;
          border: none;
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .auth-button {
          width: 100%;
          color: white;
          background-color: var(--primary-color);
        }

        .auth-button:hover {
          background-color: var(--primary-dark);
        }

        .auth-button-secondary {
          background-color: var(--background-dark);
          color: var(--text-color);
        }

        .auth-button-secondary:hover {
          background-color: #e5e7eb;
        }

        .auth-button:disabled, .auth-button-secondary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .auth-button.loading {
          background-color: var(--primary-dark);
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .auth-footer {
          text-align: center;
          color: var(--text-light);
        }

        .auth-link {
          color: var(--primary-color);
          font-weight: 500;
        }

        .auth-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .auth-card {
            padding: 1.5rem;
          }

          .auth-title {
            font-size: 1.75rem;
          }

          .form-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Register;