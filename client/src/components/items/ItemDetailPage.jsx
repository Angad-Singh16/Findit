import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiMapPin, FiCalendar, FiUser, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useItemStore from '../../store/itemStore.js';
import useAuthStore from '../../store/authStore.js';
import { submitClaimApi } from '../../api/claim.api.js';
import { ITEM_STATUS } from '../../utils/constants.js';
import { formatDate } from '../../utils/formatDate.js';
import { getImageUrl } from '../../utils/formatImage.js';

export default function ItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentItem: item, fetchItemById, loading } = useItemStore();
  const { user } = useAuthStore();
  const [claiming, setClaiming] = useState(false);
  const [claimDesc, setClaimDesc] = useState('');
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    fetchItemById(id);
  }, [id]);

  const handleClaim = async () => {
    if (!claimDesc.trim()) {
      toast.error('Please describe your proof of ownership.');
      return;
    }
    setClaiming(true);
    try {
      await submitClaimApi({ item_id: id, proof_description: claimDesc });
      toast.success('Claim submitted! Admin will review it.');
      setShowClaimForm(false);
      setClaimDesc('');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to submit claim.');
    } finally {
      setClaiming(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!item) return (
    <div className="text-center py-20 text-slate-400">Item not found.</div>
  );

  const status = ITEM_STATUS[item.status] || ITEM_STATUS.open;
  const isOwner = user?._id === item.user_id?._id;

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
      >
        <FiArrowLeft size={16} /> Back
      </button>

      {/* Images */}
      {item.image_urls?.length > 0 && (
        <div className="space-y-2">
          <div className="rounded-xl overflow-hidden h-64 bg-slate-800">
            <img
              src={getImageUrl(item.image_urls[imgIdx])}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = '/placeholder.png'; }}
            />
          </div>
          {item.image_urls.length > 1 && (
            <div className="flex gap-2">
              {item.image_urls.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${i === imgIdx ? 'border-blue-500' : 'border-slate-700'}`}
                >
                  <img src={getImageUrl(url)} alt="" className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = '/placeholder.png'; }} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        {/* Badges */}
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${item.type === 'lost' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
            {item.type === 'lost' ? '🔴 Lost' : '🟢 Found'}
          </span>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${status.color}`}>
            {status.label}
          </span>
          <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full">
            {item.category?.icon} {item.category?.name}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-xl font-bold text-white">{item.title}</h1>

        {/* Description */}
        <p className="text-slate-300 leading-relaxed">{item.description}</p>

        {/* Meta */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <FiMapPin size={14} className="text-blue-400" />
            <span>{item.location?.name}{item.location?.building ? ', ' + item.location.building : ''}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <FiCalendar size={14} className="text-blue-400" />
            <span>{formatDate(item.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <FiUser size={14} className="text-blue-400" />
            <span>Reported by {item.user_id?.name}</span>
          </div>
        </div>

        {/* Tags */}
        {item.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {item.tags.map((tag) => (
              <span key={tag} className="text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Claim Section — only for found items, not owner */}
      {item.type === 'found' && item.status === 'open' && !isOwner && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="font-semibold text-white mb-2">Is this yours?</h2>
          <p className="text-slate-400 text-sm mb-4">
            Submit a claim with proof of ownership and an admin will review it.
          </p>

          {!showClaimForm ? (
            <button
              onClick={() => setShowClaimForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              Submit a Claim
            </button>
          ) : (
            <div className="space-y-3">
              <textarea
                value={claimDesc}
                onChange={(e) => setClaimDesc(e.target.value)}
                rows={4}
                placeholder="Describe how you can prove this is yours (e.g., color, sticker, contents inside...)"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleClaim}
                  disabled={claiming}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-5 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  {claiming && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  Submit Claim
                </button>
                <button
                  onClick={() => setShowClaimForm(false)}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-5 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}