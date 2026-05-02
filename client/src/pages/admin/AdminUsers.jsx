import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiTrash2, FiUser } from 'react-icons/fi';
import { getAllUsersApi, deleteUserApi } from '../../api/user.api.js';
import { formatDate } from '../../utils/formatDate.js';

export default function AdminUsers() {
  const [users,       setUsers]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [total,       setTotal]       = useState(0);
  const [roleFilter,  setRoleFilter]  = useState('');
  const [deleting,    setDeleting]    = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = roleFilter ? { role: roleFilter } : {};
      const data   = await getAllUsersApi(params);
      setUsers(data.users || []);
      setTotal(data.total || 0);
    } catch {
      toast.error('Failed to load users.');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [roleFilter]);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await deleteUserApi(id);
      toast.success('User deleted.');
      setUsers((p) => p.filter((u) => u._id !== id));
      setTotal((p) => p - 1);
    } catch {
      toast.error('Failed to delete user.');
    } finally { setDeleting(null); }
  };

  const roleColors = {
    admin:   'bg-purple-500/20 text-purple-400 border-purple-500/30',
    staff:   'bg-blue-500/20   text-blue-400   border-blue-500/30',
    student: 'bg-slate-500/20  text-slate-400  border-slate-500/30',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Users</h1>
          <p className="text-slate-400 text-sm mt-1">{total} registered users</p>
        </div>
        {/* Role Filter */}
        <div className="flex gap-2">
          {['', 'student', 'staff', 'admin'].map((r) => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors capitalize ${
                roleFilter === r
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}>
              {r || 'All'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">👥</div>
          <p className="text-slate-400">No users found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <div key={u._id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold flex-shrink-0">
                {u.name?.[0]?.toUpperCase() || <FiUser size={16} />}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-white">{u.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${roleColors[u.role] || roleColors.student}`}>
                    {u.role}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                  <span className="text-xs text-slate-400">{u.email}</span>
                  <span className="text-xs text-slate-500">ID: {u.campus_id}</span>
                  {u.phone && <span className="text-xs text-slate-500">{u.phone}</span>}
                </div>
              </div>

              {/* Date + Delete */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-xs text-slate-500 hidden sm:block">
                  Joined {formatDate(u.createdAt)}
                </span>
                <button
                  onClick={() => handleDelete(u._id, u.name)}
                  disabled={deleting === u._id}
                  className="text-slate-500 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10 disabled:opacity-40"
                >
                  {deleting === u._id
                    ? <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                    : <FiTrash2 size={15} />
                  }
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}