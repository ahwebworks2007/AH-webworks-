import { useState, useId } from 'react';
import { Mail, MessageCircle, Instagram, Send, CheckCircle2, Copy, Check, ArrowUpRight } from 'lucide-react';
import { usePortfolio } from '@/src/context/PortfolioContext';

interface ContactProps {
  preselectedService?: string;
}

export const Contact = ({ preselectedService }: ContactProps) => {
  const { data, addInquiry } = usePortfolio();
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const businessId = useId();
  const projectTypeId = useId();
  const messageId = useId();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    projectType: preselectedService || 'Business Website',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Dynamically derive project types from data.services
  const serviceOptions = data.services.map((s) => s.title);
  const projectTypes = [
    ...serviceOptions,
    ...(serviceOptions.includes('Other / Custom Requirement') ? [] : ['Other / Custom Requirement']),
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    // Save inquiry to context / local storage database
    addInquiry({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      businessName: formData.businessName.trim(),
      projectType: formData.projectType,
      message: formData.message.trim(),
    });

    // Build mailto query for client convenience
    const subject = encodeURIComponent(
      `Project Inquiry: ${formData.projectType} for ${formData.businessName || formData.name}`
    );
    const body = encodeURIComponent(
      `Hello Hamdan & Ahad (AH Productions),\n\n` +
        `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Phone: ${formData.phone || 'N/A'}\n` +
        `Business: ${formData.businessName || 'N/A'}\n` +
        `Project Type: ${formData.projectType}\n\n` +
        `Message / Project Details:\n${formData.message}\n`
    );

    setSubmitted(true);

    // Open user's email client
    window.location.href = `mailto:${data.contact.email}?subject=${subject}&body=${body}`;
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(data.contact.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const whatsappInquiryUrl = `https://wa.me/${data.contact.whatsappNumber}?text=${encodeURIComponent(
    `Hi AH Productions, I am interested in building a ${formData.projectType || 'website'} for ${
      formData.businessName || 'my business'
    }. My name is ${formData.name || 'Client'}.`
  )}`;

  return (
    <section id="contact" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-zinc-950 relative border-t border-zinc-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="text-xs uppercase tracking-widest text-amber-400 font-mono font-medium mb-3">
            08 · GET IN TOUCH
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
            LET'S TALK.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-400">
            Tell us about your business, vision, or upcoming project. We'll reply with honest advice and a straightforward proposal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Direct Channels & Information */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl font-display font-bold text-white tracking-tight">
                Direct Communication Channels
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Prefer a quick chat? Reach out directly via WhatsApp, Instagram or Email. We typically respond within a few hours.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-4">
              {/* WhatsApp Card */}
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-emerald-500/40 hover:bg-zinc-900 transition-all duration-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-emerald-400 group-hover:scale-105 transition-transform">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-zinc-500 uppercase">WhatsApp Instant Chat</div>
                    <div className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                      {data.contact.whatsappFormatted}
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
              </a>

              {/* Email Card with Copy button */}
              <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-amber-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-zinc-500 uppercase">Official Email</div>
                    <a
                      href={`mailto:${data.contact.email}`}
                      className="text-sm font-semibold text-white hover:text-amber-300 transition-colors"
                    >
                      {data.contact.email}
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                  title="Copy email address"
                  aria-label="Copy email address"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Instagram Card */}
              <a
                href={data.contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-pink-500/40 hover:bg-zinc-900 transition-all duration-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-pink-400 group-hover:scale-105 transition-transform">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-zinc-500 uppercase">Instagram Portfolio</div>
                    <div className="text-sm font-semibold text-white group-hover:text-pink-300 transition-colors">
                      {data.contact.instagramHandle}
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
              </a>
            </div>

            {/* Quick Guarantees */}
            <div className="p-5 rounded-xl bg-zinc-900/30 border border-zinc-800/80 space-y-2 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>No pushy sales calls — only honest technical advice</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Custom proposal with transparent scope & timeline</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Direct co-founder access throughout the build</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-zinc-900/70 border border-zinc-800 p-6 sm:p-8 lg:p-10 shadow-xl">
              {submitted ? (
                <div className="py-12 text-center space-y-4 animate-in fade-in duration-300">
                  <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white">
                    Inquiry Submitted & Saved!
                  </h3>
                  <p className="text-sm text-zinc-300 max-w-md mx-auto">
                    Your brief has been logged in our system. You can also send this directly via WhatsApp for an immediate response from Hamdan & Ahad.
                  </p>
                  <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={whatsappInquiryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-semibold uppercase tracking-wider transition-colors inline-flex items-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Send on WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="px-5 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors"
                    >
                      Submit Another
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name */}
                    <div>
                      <label htmlFor={nameId} className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                        Your Name *
                      </label>
                      <input
                        id={nameId}
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Tariq Mehmood"
                        className="w-full px-4 py-3 rounded-lg bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor={emailId} className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                        Email Address *
                      </label>
                      <input
                        id={emailId}
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. tariq@business.com"
                        className="w-full px-4 py-3 rounded-lg bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Phone */}
                    <div>
                      <label htmlFor={phoneId} className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                        Phone / WhatsApp
                      </label>
                      <input
                        id={phoneId}
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+92 300 1234567"
                        className="w-full px-4 py-3 rounded-lg bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>

                    {/* Business Name */}
                    <div>
                      <label htmlFor={businessId} className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                        Business / Brand Name
                      </label>
                      <input
                        id={businessId}
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        placeholder="e.g. Artisan Cafe & Co."
                        className="w-full px-4 py-3 rounded-lg bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Project Type */}
                  <div>
                    <label htmlFor={projectTypeId} className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                      Project Type *
                    </label>
                    <select
                      id={projectTypeId}
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors"
                    >
                      {projectTypes.map((type) => (
                        <option key={type} value={type} className="bg-zinc-950 text-white">
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor={messageId} className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                      Project Details & Requirements *
                    </label>
                    <textarea
                      id={messageId}
                      name="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Describe what you want to build, any reference websites, key features, and your target timeline..."
                      className="w-full px-4 py-3 rounded-lg bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-amber-400 transition-colors resize-none"
                    />
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    className="w-full py-4 px-6 text-xs sm:text-sm font-semibold uppercase tracking-wider text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all duration-200 shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 active:scale-95"
                  >
                    <span>SEND PROJECT INQUIRY</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
