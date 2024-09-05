import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p>Effective Date: [Date]</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
      <p className="mb-4">
        Welcome to Barter Club India (“we,” “our,” or “us”). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains what information we collect, how we use it, and what rights you have in relation to it.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
      <p className="mb-4">
        We collect personal information that you voluntarily provide to us when you register on our platform, engage in transactions, or otherwise contact us. This includes:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Personal Information: Name, email address, phone number, postal address, and other contact information.</li>
        <li>Transactional Information: Details of the products and services you exchange.</li>
        <li>Financial Information: Payment method details if applicable.</li>
        <li>Technical Information: IP address, browser type, operating system, and other technical data when you visit our website.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
      <p className="mb-4">We use the information we collect to:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Provide and maintain our services.</li>
        <li>Facilitate transactions and exchanges.</li>
        <li>Improve and personalize your experience.</li>
        <li>Communicate with you about your account or transactions.</li>
        <li>Comply with legal obligations.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">4. Sharing Your Information</h2>
      <p className="mb-4">
        We do not share your personal information with third parties except in the following situations:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>To comply with legal obligations.</li>
        <li>To protect and defend our rights and property.</li>
        <li>To enforce our Terms and Conditions.</li>
        <li>With your explicit consent.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Security</h2>
      <p className="mb-4">
        We implement appropriate technical and organizational measures to protect your personal data. However, no method of transmission over the internet or electronic storage is 100% secure.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">6. Your Rights</h2>
      <p className="mb-4">You have the right to:</p>
      <ul className="list-disc list-inside mb-4">
        <li>Access your personal data.</li>
        <li>Request correction of inaccurate data.</li>
        <li>Request deletion of your personal data.</li>
        <li>Object to or restrict certain types of data processing.</li>
        <li>Withdraw your consent at any time.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contact Us</h2>
      <p className="mb-4">
        If you have any questions or concerns about this Privacy Policy, please contact us at:
        <a href="mailto:business@barterclub.in" className="text-blue-600 underline"> business@barterclub.in</a>
      </p>
    </div>
  );
};

export default PrivacyPolicy;
