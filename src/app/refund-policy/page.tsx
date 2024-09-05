import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Refund Policy</h1>
      <p>Effective Date: [Date]</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">1. Overview</h2>
      <p className="mb-4">
        At Barter Club India, we facilitate the exchange of products and services on a swap basis using a point system. Since our platform operates on bartering, monetary refunds are generally not applicable. However, we are committed to ensuring that our users have a fair and satisfactory experience.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">2. Non-Monetary Exchanges</h2>
      <p className="mb-4">
        All transactions on Barter Club India are exchanges of goods and services, and no cash payment is involved. Therefore, we do not offer monetary refunds.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">3. Dispute Resolution</h2>
      <p className="mb-4">
        If you are dissatisfied with a transaction or believe there has been an unfair exchange, please contact our support team within 7 days of the transaction. We will:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Review the exchange and points allocation.</li>
        <li>Facilitate communication between both parties to resolve the issue.</li>
        <li>If necessary, reverse the point transaction to reflect a fair outcome.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">4. Exclusions</h2>
      <p className="mb-4">
        We do not take responsibility for:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Items that are not as described or expected.</li>
        <li>Services that do not meet expectations.</li>
        <li>Any loss or damage that occurs during the exchange process.</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">5. Contact Us</h2>
      <p className="mb-4">
        For any questions or concerns regarding our Refund Policy, please contact us at: <a href="mailto:business@barterclub.in" className="text-blue-600 underline">business@barterclub.in</a>
      </p>
    </div>
  );
};

export default RefundPolicy;
