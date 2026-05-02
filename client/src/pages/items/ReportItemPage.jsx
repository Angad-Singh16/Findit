import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiUpload, FiX } from 'react-icons/fi';
import { createItemApi } from '../../api/item.api.js';
import { CATEGORIES, LOCATIONS } from '../../utils/constants.js';

export default function ReportItemPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages]   = useState([]);
  const [previews, setPreviews] = useState([]);
  const [form, setForm] = useState({
    type:          'lost',
    title:         '',
    description:   '',
    category:      '',
    location:      '',
    tags:          '',
    date_occurred: '',
  });

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      toast.error('Max 5 images allowed.'); return;
    }
    setImages((p) => [...p, ...files]);
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviews((p) => [...p, ev.target.result]);
      reader.readAsDataURL(f);
    });
  };

  const removeImage = (idx) => {
    setImages((p) => p.filter((_, i) => i !== idx));
    setPreviews((p) => p.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category || !form.location) {
      toast.error('Please fill in all required fields.'); return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('type',        form.type);
      formData.append('title',       form.title);
      formData.append('description', form.description);
      formData.append('category',    JSON.stringify({
        name: form.category,
        icon: CATEGORIES.find((c) => c.name === form.category)?.icon || '📦',
      }));
      formData.append('location',    JSON.stringify({ name: form.location }));
      if (form.tags)          formData.append('tags', form.tags);
      if (form.date_occurred) formData.append('date_occurred', form.date_occurred);
      images.forEach((img)  => formData.append('images', img));

      const data = await createItemApi(formData);
      toast.success('Item reported successfully! ✅');
      navigate(`/items/${data.item._id}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to report item.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Report an Item</h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Type Toggle */}
        <div className="flex gap-3">
          {['lost', 'found'].map((t) => (
            <button
              key={t} type="button"
              onClick={() => setForm((p) => ({ ...p, type: t }))}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm border transition-all ${
                form.type === t
                  ? t === 'lost'
                    ? 'bg-red-500/20 border-red-500 text-red-400'
                    : 'bg-green-500/20 border-green-500 text-green-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              {t === 'lost' ? '🔴 I Lost Something' : '🟢 I Found Something'}
            </button>
          ))}
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm text-slate-400 mb-1.5">Title <span className="text-red-400">*</span></label>
          <input name="title" value={form.title} onChange={handleChange}
            placeholder="e.g., Blue Water Bottle"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        {/* Category + Location */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Category <span className="text-red-400">*</span></label>
            <select name="category" value={form.category} onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c.name} value={c.name}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Location <span className="text-red-400">*</span></label>
            <select name="location" value={form.location} onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select location</option>
              {LOCATIONS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm text-slate-400 mb-1.5">Description <span className="text-red-400">*</span></label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4}
            placeholder="Describe the item in detail — color, brand, any identifying marks..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
        </div>

        {/* Tags + Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Tags</label>
            <input name="tags" value={form.tags} onChange={handleChange}
              placeholder="blue, bottle, metal"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <p className="text-xs text-slate-500 mt-1">Comma separated</p>
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Date Occurred</label>
            <input type="date" name="date_occurred" value={form.date_occurred} onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm text-slate-400 mb-1.5">Images (max 5)</label>
          <label className="flex items-center gap-3 bg-slate-800 border border-dashed border-slate-600 rounded-lg px-4 py-4 cursor-pointer hover:border-blue-500 transition-colors">
            <FiUpload size={20} className="text-slate-400" />
            <span className="text-slate-400 text-sm">Click to upload images</span>
            <input type="file" accept="image/*" multiple onChange={handleImages} className="hidden" />
          </label>

          {/* Previews */}
          {previews.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {previews.map((src, i) => (
                <div key={i} className="relative w-20 h-20">
                  <img src={src} alt="" className="w-full h-full object-cover rounded-lg" />
                  <button type="button" onClick={() => removeImage(i)}
                    className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600">
                    <FiX size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
          {loading ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Submitting...</>
          ) : 'Submit Report'}
        </button>
      </form>
    </div>
  );
}