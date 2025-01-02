"use client";
import React from "react";
import { UserRound, Mail, MessageCircleMore } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export function Contact() {
  return (
    <section className="max-w-5xl">
      <div className="px-2 lg:flex justify-center lg:flex-row lg:items-center ">
        <div className="w-full bg-zinc-900 py-8 lg:w-1/2 rounded-tl-3xl rounded-tr-3xl lg:rounded-tr-none lg:rounded-bl-3xl">
          <div className="my-10 lg:my-0 px-6 md:px-10">
            <h2 className="text-3xl font-bold  text-white sm:text-2xl lg:text-3xl">
              If you have Questions, Feel free to contact us
            </h2>
            <form action="https://formsubmit.co/krish221200867@gmail.com" 
                  method="POST" className="mt-8 max-w-xl">
                  <input type="hidden" name="_subject" value="New Contact Form Submission" />
                  <input type="hidden" name="_captcha" value="false" />
                  <input type="hidden" name="_template" value="table" />
                  <input type="hidden" name="_next" value="https://barterclub.in/thank-you" />

              <div className="flex flex-col justify-center  gap-1">
                <div className="flex w-full lg:max-w-lg items-center space-x-6">
                  <div className="flex items-center justify-center space-x-1">
                    <UserRound color="#FD4677" size={24} />
                    <input
                      className="flex h-10 w-full border-b-2 border-white focus:outline-none  bg-transparent px-3 py-2 text-sm text-slate-100"
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Your Name"
                    />
                  </div>
                  <div className="flex items-center justify-center space-x-1">
                    <Mail color="#FD4677" size={24} />
                    <input
                      className="flex h-10 w-full border-b-2 border-white focus:outline-none bg-transparent px-3 py-2 text-sm text-slate-100"
                      type="email"
                      name="email"
                      id="email"
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-start lg:pr-10 mt-6">
                  <MessageCircleMore color="#FD4677" size={24} />
                  <textarea
                    className="w-[95%] p-3 bg-zinc-900 text-white rounded-lg border-b-2 border-white focus:outline-none"
                    id="message"
                    name="message"
                    placeholder="Message"
                    rows={1}
                  ></textarea>
                </div>
                <button
                    type="submit"
                    style={{
                      background: 'linear-gradient(180deg, rgb(253, 70, 119) 0%, rgb(137.24, 82.95, 222.57) 100%)'
                    }}
                  className="rounded-3xl w-full md:w-[80%] lg:max-w-lg mt-12 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                  >
                    Send Message
                  </button>
              </div>
            </form>
          </div>
        </div>
        <div
          style={{
            background:
              "linear-gradient(180deg, rgb(253, 70, 119) 0%, rgb(137.24, 82.95, 222.57) 100%)",
          }}
          className="w-full  p-5 pb-[6.1rem] pt-16 lg:w-1/2 rounded-bl-3xl lg:rounded-bl-none lg:rounded-tr-3xl rounded-br-3xl "
        >
          <div className="flex flex-wrap items-center justify center md:justify-start gap-7">
            <div className="h-10 w-10 flex-shrink-0">
              <img
                className="h-10 w-10 rounded-full object-cover ring-4 ring-white ring-opacity-15"
                src="/avatar.png"
                alt="avatar"
              />
            </div>
            <div className="text">
              <div className="text-white text-lg font-medium">
                <h2>Priya Sharma</h2>
              </div>
              <div className="text-white text-sm font-medium">
                <p>Delhi</p>
              </div>
            </div>
          </div>
          <div className="two">
            <p className="mt-4 w-full lg:max-w-md text-base leading-relaxed text-slate-100">
              Being a member of the barter club has been an incredible
              experience. I've exchanged my handmade crafts for essentials like
              groceries and even got professional services for business without
              spending a rupee. It's not just about saving money it's about
              building relationships and supporting local businesses
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
