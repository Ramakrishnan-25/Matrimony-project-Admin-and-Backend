const invoiceEmail = (userName, planDetails) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #4CAF50;">Hello ${userName},</h2>
      <p>Thank you for subscribing to AgapeVows Matrimony. Here are your subscription details:</p>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px;">
        <p><strong>Plan Name:</strong> ${planDetails.subscriptionType}</p>
        <p><strong>Amount Paid:</strong> &#8377;${planDetails.subscriptionAmount}</p>
        <p><strong>Valid From:</strong> ${new Date(planDetails.subscriptionValidFrom).toLocaleDateString()}</p>
        <p><strong>Valid To:</strong> ${new Date(planDetails.subscriptionValidTo).toLocaleDateString()}</p>
        <p><strong>Transaction ID:</strong> ${planDetails.subscriptionTransactionId || "N/A"}</p>
      </div>
      <p style="margin-top: 20px;">If you have any questions, feel free to contact our support team.</p>
      <br />
      <p>Best Regards,</p>
      <p><strong>AgapeVows Admin Team</strong></p>
    </div>
  `;
};

module.exports = invoiceEmail;
