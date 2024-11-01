'use client'
import { useState, useEffect } from 'react';

export default function TextTransition() {
  const translations = [
    "Give what you have. Take what you want.",
    "जो तुम्हारे पास है वह दे दो। जो चाहो ले लो",
    "உனிடமிருப்பதை கொடு. உனக்கு தேவையானதை எடுத்து கொள்",
    "దగ్గర ఉన్నది ఇవ్వండి. మీకు కావలసినది తీసుకోండి",
    "तुमच्याकडे जे आहे ते द्या. तुम्हाला पाहिजे ते घ्या",
    "آپ کے پاس جو کچھ ہے دیں۔ جو چاہو لے لیں۔",
    "તમારી પાસે છે તે આપો. તમને જોઈએ તે લો",
    "ನಿನ್ನ ಹತ್ತಿರ ಇರುವುದನ್ನು ಕೊಡು. ನಿನಗೆ ಬೇಕಾದುದನ್ನು ತೆಗೆದುಕೊಳ್ಳಿ",
    "তোমার যা আছে তাই দাও। আপনি যা চান নিন।"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % translations.length);
    }, 3000); // Change text every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <p className="text-gray-300 transition-opacity duration-1000 ease-in-out">
      {translations[currentIndex]}
    </p>
  );
}
