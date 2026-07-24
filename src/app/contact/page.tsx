'use client';

import { useState } from 'react';
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend, FiCheckCircle } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-500">Get In Touch</span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">We'd Love to Hear From You</h1>
        <p className="text-sm text-slate-500">Have questions about an order, catering events, or menu inquiries?</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-900 p-8 text-white space-y-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white">Kitchen Contact Information</h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <FiMapPin className="h-5 w-5 text-brand-500 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-bold">Restaurant Address</div>
                  <div className="text-slate-300">742 Culinary Avenue, Gourmet District, NYC 10001</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FiPhone className="h-5 w-5 text-brand-500 flex-shrink-0" />
                <div>
                  <div className="font-bold">Phone Support</div>
                  <div className="text-slate-300">+1 (555) 234-5678</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FaWhatsapp className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                <div>
                  <div className="font-bold">WhatsApp Orders Hotline</div>
                  <a href="https://wa.me/15552345678" target="_blank" className="text-emerald-400 font-bold hover:underline">
                    +1 (555) 234-5678
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FiClock className="h-5 w-5 text-brand-500 flex-shrink-0" />
                <div>
                  <div className="font-bold">Opening Hours</div>
                  <div className="text-slate-300">Mon - Sun: 10:00 AM - 11:30 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-8 shadow-xl backdrop-blur-md">
            {submitted ? (
              <div className="p-8 text-center text-emerald-500 space-y-2">
                <FiCheckCircle className="h-12 w-12 mx-auto" />
                <h3 className="text-xl font-bold">Message Sent Successfully!</h3>
                <p className="text-xs text-slate-500">Thank you for reaching out. Our support team will get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Send Us a Direct Message</h3>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 font-medium text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 font-medium text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 mb-1">Message</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we assist you?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-3 font-medium text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-500 py-3 text-xs font-bold text-white hover:bg-brand-600 shadow-md"
                >
                  <FiSend className="h-4 w-4" /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
