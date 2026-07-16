import { useState } from 'react';
import { Store, User, Bell, Save, Users, UserPlus } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';

const settingsSections = [
  { key: 'store', label: 'Store Profile', icon: Store },
  { key: 'staff', label: 'Manage Staff', icon: Users },
  { key: 'account', label: 'Account', icon: User },
  { key: 'notifications', label: 'Notifications', icon: Bell },
];

export default function Settings() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('store');
  const [loading, setLoading] = useState(false);
  const [staffForm, setStaffForm] = useState({ username: '', password: '' });
  const [accountForm, setAccountForm] = useState({ currentPassword: '', newPassword: '' });
  const toast = useToast();

  const [storeForm, setStoreForm] = useState(() => {
    const saved = localStorage.getItem('store_settings');
    return saved ? JSON.parse(saved) : {
      name: 'MediStock Pharmacy & Medicals',
      address: 'Suite 101, Medical Plaza, Mumbai',
      phone: '+91 98765 43210',
      email: 'admin@medistock.com',
      gstNumber: '27AAAAA1111A1Z1',
      licenseNumber: 'DL-90210/26',
    };
  });

  const handleSave = async () => {
    if (activeSection === 'store') {
      localStorage.setItem('store_settings', JSON.stringify(storeForm));
      toast.success('Settings Saved', 'Your settings have been updated.');
    } else if (activeSection === 'account') {
      if (!accountForm.currentPassword || !accountForm.newPassword) {
        toast.error('Validation Error', 'Please enter both current and new password.');
        return;
      }
      setLoading(true);
      try {
        await authService.changePassword(
          user?.username || 'admin',
          accountForm.currentPassword,
          accountForm.newPassword
        );
        toast.success('Password Changed', 'Your password has been changed successfully.');
        setAccountForm({ currentPassword: '', newPassword: '' });
      } catch (err) {
        toast.error('Error Changing Password', err.response?.data || 'Failed to update password. Make sure current password is correct.');
      } finally {
        setLoading(false);
      }
    } else {
      toast.success('Settings Saved', 'Your settings have been updated.');
    }
  };

  return (
    <div className="animate-in">
      <div className="settings-layout">
        {/* Settings Nav */}
        <div className="card" style={{ alignSelf: 'flex-start', padding: 'var(--space-md)' }}>
          <div className="settings-nav">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.key}
                  className={`settings-nav-item ${activeSection === section.key ? 'active' : ''}`}
                  onClick={() => setActiveSection(section.key)}
                >
                  <Icon size={18} /> {section.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Settings Content */}
        <div className="card">
          {activeSection === 'store' && (
            <>
              <div className="card-header">
                <h3 className="card-title">Store Profile</h3>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Store Name</label>
                  <input
                    className="form-input"
                    value={storeForm.name}
                    onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    className="form-input"
                    value={storeForm.phone}
                    onChange={(e) => setStoreForm({ ...storeForm, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    className="form-input"
                    value={storeForm.email}
                    onChange={(e) => setStoreForm({ ...storeForm, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">GST Number</label>
                  <input
                    className="form-input"
                    value={storeForm.gstNumber}
                    onChange={(e) => setStoreForm({ ...storeForm, gstNumber: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Drug License Number</label>
                  <input
                    className="form-input"
                    value={storeForm.licenseNumber}
                    onChange={(e) => setStoreForm({ ...storeForm, licenseNumber: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Address</label>
                  <input
                    className="form-input"
                    value={storeForm.address}
                    onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
                  />
                </div>
              </div>
            </>
          )}

          {activeSection === 'account' && (
            <>
              <div className="card-header">
                <h3 className="card-title">Account Settings</h3>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input className="form-input" value={user?.username || ''} disabled />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" defaultValue={user?.username === 'staff' ? 'staff@medistock.in' : 'admin@medistock.in'} disabled />
                </div>
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="Enter current password"
                    value={accountForm.currentPassword}
                    onChange={(e) => setAccountForm({ ...accountForm, currentPassword: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="Enter new password"
                    value={accountForm.newPassword}
                    onChange={(e) => setAccountForm({ ...accountForm, newPassword: e.target.value })}
                  />
                </div>
              </div>
            </>
          )}



          {activeSection === 'notifications' && (
            <>
              <div className="card-header">
                <h3 className="card-title">Notification Preferences</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                {[
                  'Low stock alerts',
                  'Expiry date reminders',
                  'New purchase order notifications',
                  'Daily sales summary',
                  'System updates',
                ].map((label) => (
                  <label key={label} className="form-checkbox">
                    <input type="checkbox" defaultChecked />
                    <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>{label}</span>
                  </label>
                ))}
              </div>
            </>
          )}

          {activeSection === 'staff' && (
            <>
              <div className="card-header">
                <h3 className="card-title">Manage Staff</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-md)' }}>
                Create new staff accounts. Staff can access the dashboard and billing but cannot access reports or settings.
              </p>
              
              <div className="card" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', marginBottom: 'var(--space-xl)' }}>
                <h4 style={{ marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <UserPlus size={18} color="var(--accent-primary)" />
                  Create New Staff Account
                </h4>
                
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!staffForm.username || !staffForm.password) {
                       toast.error('Missing Info', 'Please provide a username and password.');
                       return;
                    }
                    setLoading(true);
                    try {
                       await authService.registerStaff(staffForm.username, staffForm.password);
                       toast.success('Staff Created', `Staff account '${staffForm.username}' has been successfully created.`);
                       setStaffForm({ username: '', password: '' });
                    } catch (err) {
                       toast.error('Creation Failed', err.response?.data || 'Failed to create staff account.');
                    } finally {
                       setLoading(false);
                    }
                  }}
                  className="form-grid"
                >
                  <div className="form-group">
                    <label className="form-label">Username</label>
                    <input 
                      className="form-input" 
                      placeholder="e.g. counter_staff_1"
                      value={staffForm.username}
                      onChange={(e) => setStaffForm({ ...staffForm, username: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input 
                      className="form-input" 
                      type="password" 
                      placeholder="Enter a secure password"
                      value={staffForm.password}
                      onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-start', marginTop: 'var(--space-sm)' }}>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Creating...' : 'Create Account'}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-xl)', paddingTop: 'var(--space-lg)', borderTop: '1px solid var(--border-color)' }}>
            <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
              <Save size={16} /> {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
