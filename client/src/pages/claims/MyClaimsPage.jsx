import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiExternalLink, FiTrash2 } from 'react-icons/fi';
import { getMyClaimsApi, withdrawClaimApi } from '../../api/claim.api.js';
import { CLAIM_STATUS } from '../../utils/constants.js';
import { formatDate } from '../../utils/formatDate.js';

export default function MyClaimsPage() {
  const [claims,  setClaims]  = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClaims = async () => {
    try {
      const data = await getMyClaimsApi();
      setClaims(data.claims);
    } catch {
      toast.error('Failed to load claims.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClaims(); }, []);

  const handleWithdraw = async (id) => {
    if (!confirm('Withdraw this claim?')) return;
    try {
      await withdrawClaimApi(id);
      toast.success('Claim withdrawn.');
      setClaims((p) => p.filter((c) => c._id !== id));
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to withdraw claim.');
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Claims</h1>
        <p className="text-slate-400 text-sm mt-1">{claims.length} claim{claims.length !== 1 ? 's' : ''} submitted</p>
      </div>

      {claims.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">📋</div>
          <p className="text-slate-400 mb-4">You haven't submitted any claims yet.</p>
          <Link to="/items" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-colors">
            Browse Found Items
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => {
            const status = CLAIM_STATUS[claim.status] || CLAIM_STATUS.pending;
            return (
              <div key={claim._id} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    {/* Item title + link */}
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-white">
                        {claim.item_id?.title || 'Item'}
                      </h3>
                      <Link
                        to={`/items/${claim.item_id?._id}`}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <FiExternalLink size={14} />
                      </Link>
                    </div>

                    {/* Status badge */}
                    <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${status.color}`}>
                      {status.label}
                    </span>

                    {/* Proof */}
                    <p className="text-slate-400 text-sm leading-relaxed">
                      <span className="text-slate-500">Proof: </span>
                      {claim.proof_description}
                    </p>

                    {/* Rejection reason */}
                    {claim.status === 'rejected' && claim.rejection_reason && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                        <p className="text-red-400 text-xs">
                          <span className="font-semibold">Reason: </span>
                          {claim.rejection_reason}
                        </p>
                      </div>
                    )}

                    {/* Date */}
                    <p className="text-xs text-slate-500">
                      Submitted {formatDate(claim.createdAt)}
                    </p>
                  </div>

                  {/* Withdraw button — only for pending */}
                  {claim.status === 'pending' && (
                    <button
                      onClick={() => handleWithdraw(claim._id)}
                      className="text-slate-400 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10"
                      title="Withdraw claim"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}