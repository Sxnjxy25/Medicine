import { useState } from 'react';
import { Eye, EyeOff, UserPlus, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import authService from '../services/authService';

export default function Register() {
  const navigate = useNavigate();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Validation Error', 'Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Validation Error', 'Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await authService.registerStaff(form.username, form.password);
      toast.success('Account Created!', `Staff account for ${form.username} created successfully.`);
      navigate('/login');
    } catch (err) {
      toast.error('Registration Failed', err.response?.data || 'Failed to create staff account. Try another username.');
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-orb orb-1"></div>
      <div className="login-bg-orb orb-2"></div>
      <div className="login-bg-orb orb-3"></div>

      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <UserPlus size={36} color="var(--accent-primary)" />
          </div>
          <h2>Create Staff Account</h2>
          <p>Join the MediStock inventory system</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter a username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                style={{ width: '100%', paddingRight: '44px' }}
                placeholder="Create a password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  color: 'var(--text-muted)',
                  padding: '4px',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className="form-input"
                style={{ width: '100%', paddingRight: '44px' }}
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  color: 'var(--text-muted)',
                  padding: '4px',
                }}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></span>
                Registering...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-lg)' }}>
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
