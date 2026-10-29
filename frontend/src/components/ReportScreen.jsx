import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronDown, MapPin, Calendar, Image as ImageIcon, CheckCircle, UploadCloud, X } from 'lucide-react';
import StatusBar from './StatusBar';

export default function ReportScreen({
  categories = [],
  onBack,
  onSubmitReport,
  isSubmitting = false,
}) {
  const [kind, setKind] = useState('lost');
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [dateOccurred, setDateOccurred] = useState('2026-10-28');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  const fileInputRef = useRef(null);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Image must be smaller than 5 MB.');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrorMsg('');
    }
  }

  function handleRemoveFile(e) {
    e.stopPropagation();
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('Item name is required.');
      return;
    }
    if (!location.trim()) {
      setErrorMsg('Location is required.');
      return;
    }

    const formData = new FormData();
    formData.append('kind', kind);
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    if (categoryId) {
      formData.append('category', categoryId);
    }
    formData.append('location', location.trim());
    formData.append('date_occurred', dateOccurred);
    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    try {
      const res = await onSubmitReport(formData, {
        kind,
        title: title.trim(),
        description: description.trim(),
        category: categoryId ? Number(categoryId) : null,
        location: location.trim(),
        date_occurred: dateOccurred,
        imageFile: selectedFile,
        previewUrl,
      });

      if (res) {
        setSuccessMsg(true);
        setTimeout(() => {
          onBack();
        }, 1200);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit report. Please check input.');
    }
  }

  return (
    <div className="relative flex flex-col h-full w-full bg-gradient-to-b from-[#D8EBFC] via-[#EDF5FD] to-white overflow-hidden text-slate-800 select-none">
      {/* iOS Status Bar */}
      <StatusBar time="9:41" />

      {/* Top Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 md:py-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-white/80 shadow-sm border border-slate-100 flex items-center justify-center text-slate-700 hover:bg-white active:scale-90 transition"
          aria-label="Go back"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        <h1 className="text-base font-bold text-slate-900 tracking-tight">
          Report item !
        </h1>

        <div className="w-9 h-9"></div>
      </div>

      {/* Main Scrollable Form */}
      <form
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto no-scrollbar px-4 sm:px-6 pt-1 pb-10 space-y-4"
      >
        {/* Kind Toggle (Lost vs Found) */}
        <div className="bg-slate-200/60 p-1 rounded-2xl flex items-center">
          <button
            type="button"
            onClick={() => setKind('lost')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              kind === 'lost'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Lost Item
          </button>
          <button
            type="button"
            onClick={() => setKind('found')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              kind === 'found'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Found Item
          </button>
        </div>

        {/* Big Add Photos Box */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative bg-white/70 hover:bg-white rounded-3xl border-2 border-dashed border-blue-200/90 shadow-[0_2px_12px_rgba(59,130,246,0.06)] p-6 flex flex-col items-center justify-center cursor-pointer transition group"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {previewUrl ? (
            <div className="relative w-full h-36 rounded-2xl overflow-hidden bg-slate-100">
              <img
                src={previewUrl}
                alt="Upload preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveFile}
                className="absolute top-2 right-2 bg-black/60 hover:bg-black text-white p-1 rounded-full transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center space-y-1.5 py-2">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center group-hover:scale-105 transition">
                <ImageIcon className="w-7 h-7 stroke-[1.8]" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Add Photos</h3>
              <p className="text-xs text-slate-400">Tap to upload</p>
            </div>
          )}
        </div>

        {/* Item name * */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            Item name<span className="text-red-500 ml-0.5">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="eg. wallet"
            className="w-full bg-white rounded-2xl px-4 py-3 text-xs text-slate-800 border border-slate-200/90 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          />
        </div>

        {/* Category * */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            Category<span className="text-red-500 ml-0.5">*</span>
          </label>
          <div className="relative">
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full appearance-none bg-white rounded-2xl px-4 py-3 text-xs text-slate-800 border border-slate-200/90 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition pr-10 cursor-pointer"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.2]" />
          </div>
        </div>

        {/* Description * */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            Description<span className="text-red-500 ml-0.5">*</span>
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide details about the item..."
            className="w-full bg-white rounded-2xl px-4 py-3 text-xs text-slate-800 border border-slate-200/90 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition resize-none"
          />
        </div>

        {/* Location * */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            Location<span className="text-red-500 ml-0.5">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={kind === 'lost' ? 'Where was it lost?' : 'Where was it found?'}
              className="w-full bg-white rounded-2xl px-4 py-3 text-xs text-slate-800 border border-slate-200/90 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition pr-10"
            />
            <MapPin className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2]" />
          </div>
        </div>

        {/* Date & Time * */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">
            Date & Time<span className="text-red-500 ml-0.5">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              required
              max={new Date().toISOString().split('T')[0]}
              value={dateOccurred}
              onChange={(e) => setDateOccurred(e.target.value)}
              className="w-full bg-white rounded-2xl px-4 py-3 text-xs text-slate-800 border border-slate-200/90 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition pr-10"
            />
            <Calendar className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2]" />
          </div>
        </div>

        {/* Error / Success message alerts */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-xl text-xs">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-2 rounded-xl text-xs flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>Item reported successfully! Redirecting...</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting || successMsg}
            className="w-full bg-[#3897F0] hover:bg-[#2585E5] active:scale-[0.98] text-white py-3.5 rounded-full font-bold text-xs shadow-[0_6px_20px_rgba(56,151,240,0.35)] transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Submitting...</span>
            ) : successMsg ? (
              <span>Report Submitted!</span>
            ) : (
              <span>Submit</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

