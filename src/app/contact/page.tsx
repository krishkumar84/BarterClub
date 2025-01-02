"use client";

import { MapPin, Mail, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Gradient overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-[#FD4677] to-[#894BDE] opacity-10"
        aria-hidden="true"
      />
      
      <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto lg:max-w-none">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-bold text-white mb-8">Get in Touch</h2>
              <div className="space-y-8">
                <div className="flex items-center space-x-4">
                  <MapPin className="h-6 w-6 text-pink-500" />
                  <div>
                    <h3 className="text-lg font-medium text-white">Address</h3>
                    <p className="mt-1 text-gray-400">
                      BARTER CLUB COLLABORATIVE PRIVATE LIMITED
                      <br />
                      CIN: U82990KA2024PTC183306
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Mail className="h-6 w-6 text-pink-500" />
                  <div>
                    <h3 className="text-lg font-medium text-white">Email</h3>
                    <a 
                      href="mailto:business@barterclub.in" 
                      className="mt-1 text-gray-400 hover:text-pink-500 transition-colors"
                    >
                      business@barterclub.in
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Phone className="h-6 w-6 text-pink-500" />
                  <div>
                    <h3 className="text-lg font-medium text-white">Phone</h3>
                    <p className="mt-1 text-gray-400">Contact us by email</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-black/40 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-pink-500/20">
                <form 
                  action="https://formsubmit.co/krish221200867@gmail.com" 
                  method="POST" 
                  className="space-y-6"
                >
                  {/* FormSubmit Configuration */}
                  <input type="hidden" name="_subject" value="New Contact Form Submission" />
                  <input type="hidden" name="_captcha" value="false" />
                  <input type="hidden" name="_template" value="table" />
                  <input type="hidden" name="_next" value="https://barterclub.in/thank-you" />

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-white">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      className="mt-1 w-full rounded-md bg-black/50 border border-pink-500/20 px-4 py-2 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-pink-500"
                      placeholder="Your Name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      className="mt-1 w-full rounded-md bg-black/50 border border-pink-500/20 px-4 py-2 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-pink-500"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-white">
                      Message
                    </label>
                    <textarea
                      name="message"
                      id="message"
                      rows={6}
                      required
                      className="mt-1 w-full rounded-md bg-black/50 border border-pink-500/20 px-4 py-2 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-pink-500"
                      placeholder="Hello, I want to know more about Barter Club..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-md py-3 px-6 text-white font-medium bg-gradient-to-r from-[#FD4677] to-[#894BDE] hover:opacity-90 transition-opacity"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}