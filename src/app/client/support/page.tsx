"use client";

import React, { useState } from "react";
import { HelpCircle, MessageCircle, Phone, Mail, Clock, ChevronDown, Send, CheckCircle } from "lucide-react";
import { useNavbar } from "@/contexts/NavbarContext";
import Link from "next/link";

const faqs = [
  {
    question: "How do I book a cricket professional?",
    answer: "Browse our nearby professionals, select your preferred expert, choose a convenient time slot, and confirm your booking. You'll receive instant confirmation."
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept all major credit/debit cards, UPI payments, net banking, and popular digital wallets like Paytm, Google Pay, and PhonePe."
  },
  {
    question: "Can I reschedule or cancel my booking?",
    answer: "Yes, you can reschedule up to 24 hours before your appointment. Cancellations within 24 hours may incur a small fee. Contact us for assistance."
  },
  {
    question: "How does the referral program work?",
    answer: "Share your referral code with friends. When they complete their first booking, you both get ₹500 in Dood Coins that can be used for future bookings."
  },
  {
    question: "What if I'm not satisfied with the service?",
    answer: "Your satisfaction is our priority. Contact our support team within 24 hours of service completion for refunds or service adjustments."
  }
];

const supportOptions = [
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Get instant help from our support team",
    available: true,
    action: "Start Chat"
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Speak directly with our experts",
    available: true,
    action: "Call Now"
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Send us detailed queries",
    available: true,
    action: "Send Email"
  },
  {
    icon: HelpCircle,
    title: "Help Center",
    description: "Browse our knowledge base",
    available: true,
    action: "View FAQs"
  }
];

export default function SupportPage() {
  const { setNavbarVisibility } = useNavbar();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    setNavbarVisibility(false);
    return () => setNavbarVisibility(true);
  }, [setNavbarVisibility]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#111111]">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 w-full z-30 bg-gradient-to-br from-[#6B46C1] via-[#4C1D95] to-[#2D1B69] border-b border-white/10 shadow-md">
        <div className="container mx-auto px-4 h-16 flex items-center relative">
          <Link href="/client" aria-label="Back to Dashboard" className="relative z-10">
            <button className="flex items-center justify-center text-white/80 hover:text-white/100 p-2 -ml-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400/40" aria-label="Back">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            </button>
          </Link>

          {/* Absolute centered title */}
          <div className="absolute left-0 right-0 flex justify-center pointer-events-none">
            <span className="text-lg font-bold text-white">Support</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-8 px-4 max-w-2xl mx-auto">
        {/* Support Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {supportOptions.map((option, index) => (
            <div key={index} className="bg-[#18181b] rounded-xl p-4 border border-white/10 hover:border-white/20 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <option.icon className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{option.title}</h3>
                  <p className="text-white/60 text-sm">{option.description}</p>
                </div>
              </div>
              <button className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 py-2 rounded-lg text-sm font-medium transition-colors">
                {option.action}
              </button>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="bg-[#18181b] rounded-xl p-6 border border-white/10 shadow-lg mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>

          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h4 className="text-white font-semibold mb-2">Message Sent!</h4>
              <p className="text-white/70">We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Name</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Email</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Subject</label>
                <input
                  type="text"
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
                  placeholder="How can we help?"
                  required
                />
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Message</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  rows={4}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none"
                  placeholder="Describe your issue or question..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* FAQ Section */}
        <div className="bg-[#18181b] rounded-xl p-6 border border-white/10 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Frequently Asked Questions</h3>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-white/5 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <span className="text-white font-medium pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-white/60 transition-transform flex-shrink-0 ${expandedFaq === index ? 'rotate-180' : ''}`}
                  />
                </button>

                {expandedFaq === index && (
                  <div className="px-4 pb-3 text-white/70 text-sm leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 text-center">
          <div className="bg-[#18181b] rounded-xl p-6 border border-white/10">
            <Clock className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <h4 className="text-white font-semibold mb-2">Support Hours</h4>
            <p className="text-white/70 text-sm mb-4">We're here to help!</p>
            <div className="space-y-2 text-sm">
              <p className="text-white/60">📞 Phone: +91 98765 43210</p>
              <p className="text-white/60">✉️ Email: support@doodlance.com</p>
              <p className="text-white/60">🕒 Mon-Sun: 8:00 AM - 10:00 PM IST</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
