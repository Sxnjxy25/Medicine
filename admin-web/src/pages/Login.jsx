import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import authService from '../services/authService';

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('ADMIN'); // 'ADMIN' or 'STAFF'
  const [form, setForm] = useState({ username: 'admin', password: 'admin123' });
  const [loading, setLoading] = useState(false);

  // Pre-fill credentials based on tab for easy testing
  const handleTabSwitch = (role) => {
    setActiveTab(role);
    if (role === 'ADMIN') setForm({ username: 'admin', password: 'admin123' });
    else setForm({ username: 'staff', password: 'staff123' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = await authService.login(form.username, form.password);
      // Ensure the user role matches the tab they are trying to log into (optional check)
      if (userData.role !== activeTab) {
         toast.error('Access Denied', `You do not have ${activeTab} privileges.`);
         setLoading(false);
         return;
      }
      toast.success('Welcome Back!', `Logged in successfully as ${userData.username}`);
      login(userData);
    } catch (err) {
      toast.error('Login Failed', err.response?.data || 'Invalid username or password');
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
          <div className="login-logo">💊</div>
          <h2>Welcome Back</h2>
          <p>Sign in to MediStock System</p>
        </div>

        {/* Role Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: 'var(--space-lg)', background: 'var(--bg-elevated)', padding: '4px', borderRadius: 'var(--radius-md)' }}>
          <button 
            type="button"
            className={`btn ${activeTab === 'ADMIN' ? 'btn-primary' : 'btn-ghost'}`} 
            style={{ flex: 1 }}
            onClick={() => handleTabSwitch('ADMIN')}
          >
            Admin Login
          </button>
          <button 
            type="button"
            className={`btn ${activeTab === 'STAFF' ? 'btn-primary' : 'btn-ghost'}`} 
            style={{ flex: 1 }}
            onClick={() => handleTabSwitch('STAFF')}
          >
            Staff Login
          </button>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter your username"
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
                placeholder="Enter your password"
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

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }}></span>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 'var(--space-lg)', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
          MediStock v1.0 — Medicine Stock Management
        </p>
      </div>
    </div>
  );
}
