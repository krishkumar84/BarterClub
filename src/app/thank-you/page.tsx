import { ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Gradient overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-[#FD4677] to-[#894BDE] opacity-10"
        aria-hidden="true"
      />
      
      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="bg-black/40 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-pink-500/20 max-w-md w-full">
          <CheckCircle className="mx-auto h-16 w-16 text-pink-500 mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">
            Thank You!
          </h1>
          <p className="text-gray-400 mb-8">
            Your message has been received. We'll get back to you as soon as possible.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center text-pink-500 hover:text-pink-400 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}