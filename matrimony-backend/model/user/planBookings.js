// models/Payment.js
// const mongoose = require("mongoose");

// const paymentSchema = new mongoose.Schema(
//   {
//     orderId: { type: String },
//     razorpayPaymentId: {
//       type: String,
//       required: true,
//     },
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     planId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Plan",
//       required: true,
//     },
//     planName: {
//       type: String,
//       required: true,
//     },
//     amount: {
//       type: Number,
//       required: true,
//     },
//     currency: {
//       type: String,
//       default: "INR",
//     },
//     paymentStatus: {
//       type: String,
//       enum: ["success", "failed"],
//       required: true,
//     },
//     paymentMethod: {
//       type: String,
//       enum: ["razorpay", "wallet", "cash"],
//       required: true,
//     },
//     timestamp: {
//       type: Date,
//       default: Date.now,
//     },
//     status:{type:String,default:"Active"},
//     planDetails: {
//       name: String,
//       price: Number,
//       priceType: String,
//       maxProfiles: Number,
//       profilesType: String,
//       canViewProfiles: String,
//       viewContactDetails: String,
//       sendInterestRequest: String,
//       startChat: String,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("planPayment", paymentSchema);


const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    orderId: { type: String },

    razorpayPaymentId: {
      type: String,
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },

    planName: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    paymentStatus: {
      type: String,
      enum: ["success", "failed"],
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["razorpay", "wallet", "cash"],
      required: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      default: "Active",
    },

    // ✅ IMPORTANT CHANGE
    planDetails: {
      name: String,
      price: Number,

      // ❌ OLD (remove dependency)
      // priceType: String,

      // ✅ NEW (USE THIS)
      duration: Number, // 1, 3, 6
      durationType: String, // days / months / years

      maxProfiles: Number,
      profilesType: String,
      canViewProfiles: String,
      viewContactDetails: String,
      sendInterestRequest: String,
      startChat: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("planPayment", paymentSchema);
