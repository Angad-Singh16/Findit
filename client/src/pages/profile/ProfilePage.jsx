import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiEdit2, FiSave, FiX, FiBell, FiPackage, FiLock } from 'react-icons/fi';
import useAuthStore from '../../store/authStore.js';
import useNotifStore from '../../store/notifStore.js';
import { updateProfileApi, changePasswordApi } from '../../api/user.api.js';
import { getMyItemsApi } from '../../api/item.api.js';
import { formatDate, timeAgo } from '../../utils/formatDate.js';
import { ITEM_STATUS } from '../../utils/constants.js';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { user, setUser }                     = useAuthStore();
  const { notifications, fetchNotifications,
          markAsRead, markAllAsRead,
          fetchUnreadCount }                  = useNotifStore();

  const [tab, setTab]           = useState('profile');
  const [editing, setEditing]   = useState(false);
  const [myItems, setMyItems]   = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);

  const [form, setForm] = useState({
    name:  user?.name  || '',
    phone: user?.phone || '',
  });
  const [pwForm, setPwForm] = useState({
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  });
  const [saving,    setSaving]    = useState(false);
  const [savingPw,  setSavingPw]  = useState(false);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
    loadMyItems();
  }, []);

  const loadMyItems = async () => {
    setLoadingItems(true);
    try {
      const data = await getMyItemsApi();
      setMyItems(data.items);
    } catch {}
    finally { setLoadingItems(false); }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name',  form.name);
      fd.append('phone', form.phone);
      const data = await updateProfileApi(fd);
      setUser(data.user);
      toast.success('Profile updated!');
      setEditing(false);
    } catch {
      toast.error('Failed to update profile.');
    } finally { setSaving(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error('Passwords do not match.'); return;
    }
    if (pwForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.'); return;
    }
    setSavingPw(true);
    try {
      await changePasswordApi({
        currentPassword: pwForm.currentPassword,
        newPassword:     pwForm.newPassword,
      });
      toast.success('Password changed!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to change password.');
    } finally { setSavingPw(false); }
  };

  const tabs = [
    { id: 'profile',  label: 'Profile',       icon: <FiEdit2 size={14} /> },
    { id: 'items',    label: 'My Items',       icon: <FiPackage size={14} /> },
    { id: 'notifs',   label: 'Notifications',  icon: <FiBell size={14} /> },
    { id: 'password', label: 'Password',       icon: <FiLock size={14} /> },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Avatar + Name */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">{user?.name}</h1>
          <p className="text-slate-400 text-sm">{user?.email}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs bg-blue-600/20 text-blue-400 px-2.5 py-0.5 rounded-full border border-blue-500/30">
              {user?.role}
            </span>
            <span className="text-xs text-slate-500">{user?.campus_id}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors ${
              tab === t.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === 'profile' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white">Edit Profile</h2>
            {!editing ? (
              <button onClick={() => setEditing(true)}
                className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                <FiEdit2 size={14} /> Edit
              </button>
            ) : (
              <button onClick={() => setEditing(false)} className="text-sm text-slate-400 hover:text-white">
                <FiX size={16} />
              </button>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Full Name</label>
              <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                disabled={!editing}
                className="w-full bg-slate-800 disabled:bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Phone</label>
              <input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                disabled={!editing}
                className="w-full bg-slate-800 disabled:bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 disabled:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Campus ID</label>
              <input value={user?.campus_id || ''} disabled
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-500 cursor-not-allowed" />
            </div>
          </div>

          {editing && (
            <button onClick={handleSaveProfile} disabled={saving}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors">
              {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <FiSave size={14} />}
              Save Changes
            </button>
          )}
        </div>
      )}

      {/* My Items Tab */}
      {tab === 'items' && (
        <div className="space-y-3">
          {loadingItems ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : myItems.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-2">📭</div>
              <p className="text-slate-400 text-sm">You haven't reported any items yet.</p>
            </div>
          ) : (
            myItems.map((item) => {
              const s = ITEM_STATUS[item.status] || ITEM_STATUS.open;
              return (
                <Link key={item._id} to={`/items/${item._id}`}
                  className="flex items-center gap-4 bg-slate-900 border border-slate-800 hover:border-slate-600 rounded-xl p-4 transition-colors">
                  <div className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${item.type === 'lost' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                    {item.type}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.location?.name} · {formatDate(item.createdAt)}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full flex-shrink-0 ${s.color}`}>{s.label}</span>
                </Link>
              );
            })
          )}
        </div>
      )}

      {/* Notifications Tab */}
      {tab === 'notifs' && (
        <div className="space-y-3">
          {notifications.length > 0 && (
            <button onClick={markAllAsRead}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              Mark all as read
            </button>
          )}
          {notifications.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-2">🔔</div>
              <p className="text-slate-400 text-sm">No notifications yet.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div key={n._id}
                onClick={() => !n.is_read && markAsRead(n._id)}
                className={`bg-slate-900 border rounded-xl p-4 cursor-pointer transition-colors ${
                  n.is_read ? 'border-slate-800 opacity-60' : 'border-blue-500/30 bg-blue-500/5'
                }`}>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm text-slate-200">{n.message}</p>
                  {!n.is_read && <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0 mt-1.5" />}
                </div>
                <p className="text-xs text-slate-500 mt-1.5">{timeAgo(n.createdAt)}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Password Tab */}
      {tab === 'password' && (
        <form onSubmit={handleChangePassword}
          className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-white">Change Password</h2>
          {[
            { label: 'Current Password', key: 'currentPassword' },
            { label: 'New Password',     key: 'newPassword' },
            { label: 'Confirm Password', key: 'confirmPassword' },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-xs text-slate-400 mb-1">{f.label}</label>
              <input type="password"
                value={pwForm[f.key]}
                onChange={(e) => setPwForm((p) => ({ ...p, [f.key]: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          ))}
          <button type="submit" disabled={savingPw}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors">
            {savingPw && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            Update Password
          </button>
        </form>
      )}
    </div>
  );
}