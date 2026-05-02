import { useState } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';
import { CATEGORIES, LOCATIONS } from '../../utils/constants.js';

export default function ItemForm({ onSubmit, loading = false, initialData = {} }) {
  const [form, setForm] = useState({
    type:          initialData.type          || 'lost',
    title:         initialData.title         || '',
    description:   initialData.description   || '',
    category:      initialData.category?.name|| '',
    location:      initialData.location?.name|| '',
    tags:          initialData.tags?.join(', ')|| '',
    date_occurred: initialData.date_occurred || '',
  });
  const [images,   setImages]   = useState([]);
  const [previews, setPreviews] = useState([]);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) return;
    setImages((p) => [...p, ...files]);
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviews((p) => [...p, ev.target.result]);
      reader.readAsDataURL(f);
    });
  };

  const removeImage = (i) => {
    setImages((p) => p.filter((_, idx) => idx !== i));
    setPreviews((p) => p.filter((_, idx) => idx !== i));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form, images);
  };

  const inputCls = "w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Type toggle */}
      <div className="flex gap-3">
        {['lost', 'found'].map((t) => (
          <button key={t} type="button"
            onClick={() => setForm((p) => ({ ...p, type: t }))}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm border transition-all ${
              form.type === t
                ? t === 'lost' ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-green-500/20 border-green-500 text-green-400'
                : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
            {t === 'lost' ? '🔴 Lost' : '🟢 Found'}
          </button>
        ))}
      </div>

      {/* Title */}
      <div>
        <label className="block text-xs text-slate-400 mb-1.5">Title *</label>
        <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Blue Water Bottle" className={inputCls} required />
      </div>

      {/* Category + Location */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Category *</label>
          <select name="category" value={form.category} onChange={handleChange} className={inputCls} required>
            <option value="">Select</option>
            {CATEGORIES.map((c) => <option key={c.name} value={c.name}>{c.icon} {c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Location *</label>
          <select name="location" value={form.location} onChange={handleChange} className={inputCls} required>
            <option value="">Select</option>
            {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs text-slate-400 mb-1.5">Description *</label>
        <textarea name="description" value={form.description} onChange={handleChange}
          rows={4} placeholder="Describe the item in detail..." className={inputCls + ' resize-none'} required />
      </div>

      {/* Tags + Date */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Tags</label>
          <input name="tags" value={form.tags} onChange={handleChange} placeholder="blue, bottle" className={inputCls} />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Date</label>
          <input type="date" name="date_occurred" value={form.date_occurred} onChange={handleChange} className={inputCls} />
        </div>
      </div>

      {/* Images */}
      <div>
        <label className="block text-xs text-slate-400 mb-1.5">Images (max 5)</label>
        <label className="flex items-center gap-3 bg-slate-800 border border-dashed border-slate-600 rounded-lg px-4 py-4 cursor-pointer hover:border-blue-500 transition-colors">
          <FiUpload size={18} className="text-slate-400" />
          <span className="text-slate-400 text-sm">Click to upload</span>
          <input type="file" accept="image/*" multiple onChange={handleImages} className="hidden" />
        </label>
        {previews.length > 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {previews.map((src, i) => (
              <div key={i} className="relative w-16 h-16">
                <img src={src} className="w-full h-full object-cover rounded-lg" />
                <button type="button" onClick={() => removeImage(i)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                  <FiX size={8} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button type="submit" disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
        {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
        Submit Report
      </button>
    </form>
  );
}