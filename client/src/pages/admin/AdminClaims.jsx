import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiCheck, FiX, FiExternalLink } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { getAllClaimsApi, updateClaimStatusApi } from '../../api/claim.api.js';
import { CLAIM_STATUS } from '../../utils/constants.js';
import { formatDate } from '../../utils/formatDate.js';

export default function AdminClaims() {
  const [claims,         setClaims]         = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [statusFilter,   setStatusFilter]   = useState('pending');
  const [rejectModal,    setRejectModal]    = useState(null); // claim id
  const [rejectReason,   setRejectReason]   = useState('');
  const [actionLoading,  setActionLoading]  = useState(null);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const data   = await getAllClaimsApi(params);
      setClaims(data.claims || []);
    } catch {
      toast.error('Failed to load claims.');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchClaims(); }, [statusFilter]);

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      await updateClaimStatusApi(id, { status: 'approved' });
      toast.success('Claim approved! ✅');
      fetchClaims();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to approve.');
    } finally { setActionLoading(null); }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a rejection reason.'); return;
    }
    setActionLoading(rejectModal);
    try {
      await updateClaimStatusApi(rejectModal, {
        status: 'rejected',
        rejection_reason: rejectReason,
      });
      toast.success('Claim rejected.');
      setRejectModal(null);
      setRejectReason('');
      fetchClaims();
    } catch {
      toast.error('Failed to reject.');
    } finally { setActionLoading(null); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Review Claims</h1>
          <p className="text-slate-400 text-sm mt-1">{claims.length} claims</p>
        </div>
        {/* Status Filter */}
        <div className="flex gap-2">
          {['pending','approved','rejected',''].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : claims.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">📋</div>
          <p className="text-slate-400">No claims found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => {
            const s = CLAIM_STATUS[claim.status] || CLAIM_STATUS.pending;
            return (
              <div key={claim._id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white">
                        {claim.item_id?.title || 'Item'}
                      </span>
                      <Link to={`/items/${claim.item_id?._id}`}
                        className="text-blue-400 hover:text-blue-300">
                        <FiExternalLink size={13} />
                      </Link>
                    </div>
                    <p className="text-xs text-slate-400">
                      Claimed by <span className="text-slate-200">{claim.user_id?.name}</span>
                      {' '}({claim.user_id?.email}) · {formatDate(claim.createdAt)}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 ${s.color}`}>
                    {s.label}
                  </span>
                </div>

                {/* Proof */}
                <div className="bg-slate-800 rounded-lg px-4 py-3">
                  <p className="text-xs text-slate-500 mb-1">Proof of Ownership</p>
                  <p className="text-sm text-slate-300">{claim.proof_description}</p>
                </div>

                {/* Rejection reason */}
                {claim.status === 'rejected' && claim.rejection_reason && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                    <p className="text-xs text-red-400">
                      Rejection reason: {claim.rejection_reason}
                    </p>
                  </div>
                )}

                {/* Actions — only for pending */}
                {claim.status === 'pending' && (
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleApprove(claim._id)}
                      disabled={actionLoading === claim._id}
                      className="flex items-center gap-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {actionLoading === claim._id
                        ? <div className="w-3 h-3 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                        : <FiCheck size={14} />
                      }
                      Approve
                    </button>
                    <button
                      onClick={() => { setRejectModal(claim._id); setRejectReason(''); }}
                      className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                      <FiX size={14} /> Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold text-white">Reject Claim</h3>
            <p className="text-slate-400 text-sm">Please provide a reason for rejection:</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              placeholder="e.g., Proof of ownership is insufficient..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none text-sm"
            />
            <div className="flex gap-2">
              <button onClick={handleReject}
                disabled={actionLoading !== null}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors">
                Confirm Reject
              </button>
              <button onClick={() => setRejectModal(null)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2.5 rounded-lg transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}