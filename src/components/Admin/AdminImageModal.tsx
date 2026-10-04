import React, { useState, useRef } from 'react';
import { Camera, Upload, Trash2, RefreshCw, X, Check, Image as ImageIcon, Link as LinkIcon, User } from 'lucide-react';
import { Founder, DEFAULT_FOUNDER_AVATARS } from '@/src/data/portfolioData';

interface AdminImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  founder: Founder | null;
  founderIndex: number;
  onUpdateFounderAvatar: (index: number, newAvatarUrl: string) => void;
}

export const AdminImageModal: React.FC<AdminImageModalProps> = ({
  isOpen,
  onClose,
  founder,
  founderIndex,
  onUpdateFounderAvatar,
}) => {
  if (!isOpen || !founder) return null;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState(founder.avatar || '');
  const [previewUrl, setPreviewUrl] = useState(founder.avatar || '');
  const [activeMode, setActiveMode] = useState<'upload' | 'url'>('upload');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Handle local image file upload (convert to Base64 data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPG, PNG, WEBP, etc.).');
      return;
    }

    // Limit to ~5MB for storage performance
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image file size must be less than 5MB.');
      return;
    }

    setErrorMsg('');
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setPreviewUrl(result);
        setImageUrl(result);
        setSuccessMsg('Photo loaded ready to save!');
        setTimeout(() => setSuccessMsg(''), 2500);
      }
    };
    reader.onerror = () => {
      setErrorMsg('Failed to read image file. Please try another image.');
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (!imageUrl.trim()) {
      setErrorMsg('Please enter a valid image URL.');
      return;
    }
    setErrorMsg('');
    setPreviewUrl(imageUrl.trim());
    setSuccessMsg('URL applied to preview!');
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  const handleSave = () => {
    onUpdateFounderAvatar(founderIndex, previewUrl);
    onClose();
  };

  const handleDeleteImage = () => {
    if (confirm(`Are you sure you want to remove the image for ${founder.name}? A stylized initials monogram avatar will be used instead.`)) {
      setPreviewUrl('');
      setImageUrl('');
      onUpdateFounderAvatar(founderIndex, '');
      onClose();
    }
  };

  const handleRestoreDefault = () => {
    const defaultImg =
      founderIndex === 0
        ? DEFAULT_FOUNDER_AVATARS.hamdan
        : DEFAULT_FOUNDER_AVATARS.ahad;
    setPreviewUrl(defaultImg);
    setImageUrl(defaultImg);
    onUpdateFounderAvatar(founderIndex, defaultImg);
    setSuccessMsg('Default studio portrait restored!');
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-7 space-y-6 text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-white tracking-tight">
                Manage Admin Photo
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                {founder.name} · {founder.role}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Live Avatar Preview */}
        <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-amber-400/60 bg-zinc-800 shrink-0 shadow-lg shadow-black/50">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt={founder.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={() => {
                  setErrorMsg('Image failed to load. Please check the URL or upload a valid file.');
                }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-amber-400 font-display font-bold text-2xl">
                {getInitials(founder.name)}
                <span className="text-[9px] font-mono text-zinc-500 font-normal mt-0.5">No Photo</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </div>

          <div className="space-y-1.5 text-center sm:text-left flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-mono text-amber-400 font-semibold">PREVIEW</span>
              <span className="text-zinc-600">·</span>
              <span className="text-xs text-zinc-400 font-mono">
                {previewUrl ? 'Custom Photo Active' : 'Monogram Initials Fallback'}
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              This photo will be displayed on the public About page and in the studio showcase.
            </p>
          </div>
        </div>

        {/* Action Tabs: Upload File vs Image URL */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
            <button
              type="button"
              onClick={() => setActiveMode('upload')}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                activeMode === 'upload'
                  ? 'bg-amber-400 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload from Device</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('url')}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                activeMode === 'url'
                  ? 'bg-amber-400 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Paste Image URL</span>
            </button>
          </div>

          {activeMode === 'upload' ? (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-8 border-2 border-dashed border-zinc-700 hover:border-amber-400/80 rounded-xl bg-zinc-900/40 hover:bg-zinc-900/80 transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-zinc-800 group-hover:bg-amber-400/20 text-zinc-400 group-hover:text-amber-400 flex items-center justify-center transition-colors">
                  <Upload className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-zinc-200 group-hover:text-white">
                  Click to select photo from your computer or phone
                </span>
                <span className="text-[11px] text-zinc-500 font-mono">
                  Supports JPG, PNG, WEBP (Max 5MB)
                </span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-xs font-mono text-zinc-400">
                Direct Web Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="flex-1 px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors"
                >
                  Preview
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Utility Actions: Delete Image or Restore Default */}
        <div className="pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDeleteImage}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/60 text-xs font-semibold transition-colors"
              title="Delete admin photo and show initials fallback"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Photo</span>
            </button>

            <button
              type="button"
              onClick={handleRestoreDefault}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-semibold transition-colors"
              title="Reset back to default high-res portrait"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restore Default</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 shadow-lg shadow-amber-400/10"
            >
              <Check className="w-4 h-4" />
              <span>Save & Apply</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
