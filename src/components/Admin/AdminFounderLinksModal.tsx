import React, { useState } from 'react';
import { Mail, Github, Linkedin, X, Check, Link as LinkIcon, Trash2 } from 'lucide-react';
import { Founder } from '@/src/data/portfolioData';

interface AdminFounderLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  founder: Founder | null;
  founderIndex: number;
  onSaveFounderLinks: (
    index: number,
    links: { email?: string; github?: string; linkedin?: string }
  ) => void;
}

export const AdminFounderLinksModal: React.FC<AdminFounderLinksModalProps> = ({
  isOpen,
  onClose,
  founder,
  founderIndex,
  onSaveFounderLinks,
}) => {
  if (!isOpen || !founder) return null;

  const [email, setEmail] = useState(founder.email || '');
  const [github, setGithub] = useState(founder.github || '');
  const [linkedin, setLinkedin] = useState(founder.linkedin || '');
  const [successMsg, setSuccessMsg] = useState('');

  const formatUrl = (val: string, type: 'github' | 'linkedin') => {
    let trimmed = val.trim();
    if (!trimmed) return '';
    if (type === 'github') {
      if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
        if (trimmed.startsWith('github.com/')) {
          trimmed = 'https://' + trimmed;
        } else {
          trimmed = 'https://github.com/' + trimmed.replace(/^@/, '');
        }
      }
    } else if (type === 'linkedin') {
      if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
        if (trimmed.startsWith('linkedin.com/')) {
          trimmed = 'https://' + trimmed;
        } else {
          trimmed = 'https://linkedin.com/in/' + trimmed.replace(/^@/, '');
        }
      }
    }
    return trimmed;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedGithub = formatUrl(github, 'github');
    const formattedLinkedin = formatUrl(linkedin, 'linkedin');
    const formattedEmail = email.trim();

    onSaveFounderLinks(founderIndex, {
      email: formattedEmail || undefined,
      github: formattedGithub || undefined,
      linkedin: formattedLinkedin || undefined,
    });

    setSuccessMsg('Links & Accounts updated successfully!');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-7 space-y-6 text-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
              <LinkIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-white tracking-tight">
                Attach Accounts & Socials
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

        {/* Success message */}
        {successMsg && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {/* GitHub Input */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-mono text-zinc-300">
              <Github className="w-4 h-4 text-zinc-400" />
              <span>GitHub Profile URL / Username</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/username or username"
                className="flex-1 px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
              {github && (
                <button
                  type="button"
                  onClick={() => setGithub('')}
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-red-400"
                  title="Clear GitHub link"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-[11px] text-zinc-500 font-mono">
              Creates clickable "GitHub" link in founder card.
            </p>
          </div>

          {/* LinkedIn Input */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-mono text-zinc-300">
              <Linkedin className="w-4 h-4 text-blue-400" />
              <span>LinkedIn Profile URL / Handle</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/username or username"
                className="flex-1 px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-400"
              />
              {linkedin && (
                <button
                  type="button"
                  onClick={() => setLinkedin('')}
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-red-400"
                  title="Clear LinkedIn link"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-[11px] text-zinc-500 font-mono">
              Creates clickable "LinkedIn" badge in founder card.
            </p>
          </div>

          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs font-mono text-zinc-300">
              <Mail className="w-4 h-4 text-amber-400" />
              <span>Direct Email Address</span>
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="founder@ahproductions.dev"
                className="flex-1 px-3.5 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
              />
              {email && (
                <button
                  type="button"
                  onClick={() => setEmail('')}
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-red-400"
                  title="Clear Email link"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-[11px] text-zinc-500 font-mono">
              Opens client's mail composer with pre-filled project inquiry subject.
            </p>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 shadow-lg shadow-amber-400/10"
            >
              <Check className="w-4 h-4" />
              <span>Save & Attach</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
