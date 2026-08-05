import React, { useState } from 'react';
import { MessageSquare, Star, Send, CheckCircle2, Mail, User as UserIcon, Heart, Sparkles, MessageCircle } from 'lucide-react';
import { FeedbackItem, UserProfile } from '../../types/converter';
import { addFeedbackRecord, getStoredFeedback } from '../../utils/storage';

interface FeedbackPageProps {
  user: UserProfile | null;
  onSuccessToast: (msg: string) => void;
  theme: 'dark' | 'light';
}

export const FeedbackPage: React.FC<FeedbackPageProps> = ({
  user,
  onSuccessToast,
  theme,
}) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [type, setType] = useState<'Suggestion' | 'Bug Report' | 'Review'>('Suggestion');
  const [rating, setRating] = useState<number>(5);
  const [message, setMessage] = useState('');
  const [submittedLogs, setSubmittedLogs] = useState<FeedbackItem[]>(getStoredFeedback());
  const [showSuccessCard, setShowSuccessCard] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert('Please fill out all required fields.');
      return;
    }

    const updated = addFeedbackRecord({
      name,
      email,
      type,
      rating,
      message,
    });

    setSubmittedLogs(updated);
    setShowSuccessCard(true);
    onSuccessToast('Thank you! Your feedback has been sent to developer Alvin.');
    setMessage('');
  };

  return (
    <div className="p-8 md:p-12 max-w-4xl mx-auto space-y-10 animate-fade-in">
      {/* Title Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          <MessageSquare className="w-4 h-4" />
          <span>DEVELOPER FEEDBACK SYSTEM</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Send Your Feedback to Alvin
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
          Help us improve Universal Converter Pro! Your feedback, suggestions, and bug reports are sent directly to lead developer Alvin (<strong className="text-blue-500">alvindelacruz917@gmail.com</strong>).
        </p>
      </div>

      {/* Success Confirmation Card */}
      {showSuccessCard && (
        <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 space-y-3 text-center animate-fade-in">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            Thank you for your feedback!
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Your message has been logged and sent to Alvin's developer mailbox. We appreciate your support in making this software better.
          </p>
          <button
            onClick={() => setShowSuccessCard(false)}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-extrabold text-xs shadow-md hover:bg-emerald-700 transition-colors"
          >
            Send Another Feedback
          </button>
        </div>
      )}

      {/* Main Feedback Form */}
      <div
        className={`rounded-3xl p-8 border shadow-xl relative overflow-hidden ${
          theme === 'dark'
            ? 'bg-[#1E293B] border-slate-700 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Selector */}
          <div className="space-y-2 text-center sm:text-left">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Overall Software Rating
            </label>
            <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1.5 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating
                        ? 'text-amber-400 fill-amber-400 drop-shadow-md'
                        : 'text-slate-600 dark:text-slate-700'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-black text-amber-500 ml-2">
                {rating} / 5 Stars
              </span>
            </div>
          </div>

          {/* Feedback Type Selector */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Feedback Category
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'Suggestion', label: '💡 Suggestion' },
                { id: 'Bug Report', label: '🐛 Bug Report' },
                { id: 'Review', label: '⭐ Review' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setType(cat.id as any)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-extrabold transition-all ${
                    type === cat.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : theme === 'dark'
                      ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400">Your Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alvin Dela Cruz"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium outline-none border ${
                    theme === 'dark'
                      ? 'bg-[#0F172A] border-slate-700 text-white focus:border-blue-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600'
                  }`}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400">Your Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alvin@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-medium outline-none border ${
                    theme === 'dark'
                      ? 'bg-[#0F172A] border-slate-700 text-white focus:border-blue-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Message Textarea */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400">Your Message / Suggestion</label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell Alvin what you think about Universal Converter Pro, feature requests, or any issues you encountered..."
              className={`w-full p-4 rounded-xl text-xs font-medium outline-none border resize-none ${
                theme === 'dark'
                  ? 'bg-[#0F172A] border-slate-700 text-white focus:border-blue-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-600'
              }`}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
          >
            <Send className="w-4 h-4" />
            <span>Send Feedback to Developer Alvin</span>
          </button>
        </form>
      </div>

      {/* Submitted Feedback History */}
      {submittedLogs.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-black flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-500" />
            <span>Submitted Feedback Log ({submittedLogs.length})</span>
          </h3>

          <div className="space-y-3">
            {submittedLogs.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-500/5 border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 dark:text-white">{item.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-600/10 text-blue-500">
                      {item.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-bold text-xs">{item.rating}/5</span>
                  </div>
                </div>
                <p className="text-slate-400 leading-relaxed">{item.message}</p>
                <div className="text-[10px] text-slate-500 pt-1 border-t border-inherit">
                  Sent to alvindelacruz917@gmail.com on {item.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
