// const bcrypt = require("bcrypt");
// const {
//   ADMIN_EMAIL_ID,
//   ADMIN_PASSWORD,
// } = require("../../config/variables/variables");
// const adminModel = require("../../model/admin/adminModel");
// const userModel = require("../../model/user/userModel");

// const registerAdmin = async (req, res) => {
//   try {
//     const adminEmail = ADMIN_EMAIL_ID;
//     const adminPassword = ADMIN_PASSWORD;

//     const existingAdmin = await adminModel.findOne({ adminEmail });

//     if (existingAdmin) {
//       return res.status(200).json({
//         success: true,
//         message: "Admin already registered",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(adminPassword, 10);

//     const newAdmin = new adminModel({
//       adminEmail,
//       adminPassword: hashedPassword,
//     });

//     await newAdmin.save();

//     res.status(201).json({
//       success: true,
//       message: "Admin registered successfully",
//     });
//   } catch (err) {
//     console.error("Error in registerAdmin:", err);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

// const verifyAdmin = async (req, res) => {
//   try {
//     const { loginData } = req.body;
//     const { email, password } = loginData;

//     const admin = await adminModel.findOne({ adminEmail: email });

//     if (!admin) {
//       return res.status(404).json({
//         success: false,
//         message: "Admin not found",
//       });
//     }

//     const isMatch = await bcrypt.compare(password, admin.adminPassword);

//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Admin login successful",
//       adminId: admin._id,
//     });
//   } catch (err) {
//     console.error("Error in verifyAdmin:", err);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

// const getAllUsersData = async (req, res) => {
//   try {
//     const userData = await userModel
//       .find(
//         { isApproved: true },
//         {
//           userEmail: 1,
//           userMobile: 1,
//           userName: 1,
//           gender: 1,
//           city: 1,
//           profileImage: 1,
//         }
//       )
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       message: "All users fetched successfully",
//       data: userData,
//     });
//   } catch (err) {
//     console.error("Error in getAllUsersData", err);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

// const getPaidUsersData = async (req, res) => {
//   try {
//     const userData = await userModel
//       .find(
//         { isAnySubscriptionTaken: true },
//         {
//           userEmail: 1,
//           userMobile: 1,
//           userName: 1,
//           gender: 1,
//           city: 1,
//           profileImage: 1,
//           isAnySubscriptionTaken: 1,
//           "paymentDetails.subscriptionValidFrom": 1,
//           "paymentDetails.subscriptionValidTo": 1,
//           "paymentDetails.subscriptionType": 1,
//           "paymentDetails.subscriptionAmount": 1,
//           "paymentDetails.subscriptionStatus": 1,
//           "paymentDetails.subscriptionTransactionDate": 1,
//         }
//       )
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       message: "Paid users fetched successfully",
//       data: userData,
//     });
//   } catch (err) {
//     console.error("Error in getPaidUsersData", err);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

// const getAllNewRequestedUsersData = async (req, res) => {
//   try {
//     const userData = await userModel
//       .find(
//         { isApproved: false },
//         {
//           userEmail: 1,
//           userMobile: 1,
//           userName: 1,
//           gender: 1,
//           profileImage: 1,
//           paymentDetails: 1,
//           createdAt: 1,
//         }
//       )
//       .sort({ createdAt: -1 });

//     res.status(200).json({ success: true, data: userData });
//   } catch (err) {
//     console.error("Error fetching unapproved users:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// const approveNewUser = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     const userData = await userModel.findByIdAndUpdate(
//       userId,
//       { isApproved: true },
//       { new: true }
//     );

//     if (!userData) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "User approved successfully",
//     });
//   } catch (err) {
//     console.error("Error approving user:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

// const deleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deletedUser = await userModel.findByIdAndDelete(id);

//     if (!deletedUser) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "User deleted successfully",
//     });
//   } catch (err) {
//     console.error("Error deleting user:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };
// const getUserById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const user = await userModel.findById(id);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       data: user,
//     });
//   } catch (err) {
//     console.error("Error fetching user:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };
// const updateUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedData = req.body;

//     const updatedUser = await userModel.findByIdAndUpdate(
//       id,
//       updatedData,
//       { new: true }
//     );

//     if (!updatedUser) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "User updated successfully",
//       data: updatedUser,
//     });
//   } catch (err) {
//     console.error("Error updating user:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };

// module.exports = {
//   getPaidUsersData,
//   approveNewUser,
//   getAllNewRequestedUsersData,
//   registerAdmin,
//   verifyAdmin,
//   getAllUsersData,
//   deleteUser,
//   getUserById,     // ✅ add
//   updateUser,      // ✅ add
// };



const bcrypt = require("bcrypt");
const {
  ADMIN_EMAIL_ID,
  ADMIN_PASSWORD,
} = require("../../config/variables/variables");
const adminModel = require("../../model/admin/adminModel");
const userModel = require("../../model/user/userModel");

/* =========================
   REGISTER ADMIN
========================== */
const registerAdmin = async (req, res) => {
  try {
    const adminEmail = ADMIN_EMAIL_ID;
    const adminPassword = ADMIN_PASSWORD;

    const existingAdmin = await adminModel.findOne({ adminEmail });

    if (existingAdmin) {
      return res.status(200).json({
        success: true,
        message: "Admin already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const newAdmin = new adminModel({
      adminEmail,
      adminPassword: hashedPassword,
    });

    await newAdmin.save();

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
    });
  } catch (err) {
    console.error("Error in registerAdmin:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =========================
   VERIFY ADMIN
========================== */
const verifyAdmin = async (req, res) => {
  try {
    const { loginData } = req.body;
    const { email, password } = loginData;

    const admin = await adminModel.findOne({ adminEmail: email });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.adminPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      adminId: admin._id,
    });
  } catch (err) {
    console.error("Error in verifyAdmin:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =========================
   GET ALL APPROVED USERS
========================== */
const getAllUsersData = async (req, res) => {
  try {
    const userData = await userModel
      .find(
        {
          isApproved: true,
          $or: [
            { isDeleted: false },
            { isDeleted: { $exists: false } }
          ],
        },
        {
          userEmail: 1,
          userMobile: 1,
          userName: 1,
          gender: 1,
          city: 1,
          profileImage: 1,
        }
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "All users fetched successfully",
      data: userData,
    });
  } catch (err) {
    console.error("Error in getAllUsersData", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =========================
   GET PAID USERS
========================== */
const getPaidUsersData = async (req, res) => {
  try {
    const userData = await userModel
      .find(
        { isAnySubscriptionTaken: true, isDeleted: false },
        {
          userEmail: 1,
          userMobile: 1,
          userName: 1,
          gender: 1,
          city: 1,
          profileImage: 1,
          isAnySubscriptionTaken: 1,
          "paymentDetails.subscriptionValidFrom": 1,
          "paymentDetails.subscriptionValidTo": 1,
          "paymentDetails.subscriptionType": 1,
          "paymentDetails.subscriptionAmount": 1,
          "paymentDetails.subscriptionStatus": 1,
          "paymentDetails.subscriptionTransactionDate": 1,
        }
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Paid users fetched successfully",
      data: userData,
    });
  } catch (err) {
    console.error("Error in getPaidUsersData", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =========================
   GET NEW REQUESTED USERS
========================== */
const getAllNewRequestedUsersData = async (req, res) => {
  try {
    const userData = await userModel
      .find(
        { isApproved: false, isDeleted: false },
        {
          userEmail: 1,
          userMobile: 1,
          userName: 1,
          gender: 1,
          profileImage: 1,
          paymentDetails: 1,
          createdAt: 1,
        }
      )
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: userData });
  } catch (err) {
    console.error("Error fetching unapproved users:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* =========================
   APPROVE USER
========================== */
const approveNewUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const userData = await userModel.findOneAndUpdate(
      { _id: userId, isDeleted: false },
      { isApproved: true },
      { new: true }
    );

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User approved successfully",
    });
  } catch (err) {
    console.error("Error approving user:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =========================
   SOFT DELETE USER
========================== */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await userModel.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      { new: true }
    );

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User soft deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting user:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =========================
   REMOVE USER SUBSCRIPTION
========================== */
const removeUserSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      {
        $set: {
          isAnySubscriptionTaken: false,
          paymentDetails: [],
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User subscription data removed successfully",
    });
  } catch (err) {
    console.error("Error removing user subscription:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =========================
   GET USER BY ID
========================== */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error("Error fetching user:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =========================
   UPDATE USER
========================== */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedUser = await userModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      updatedData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    console.error("Error updating user:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const restoreUser = async (req, res) => {
  try {
    const { id } = req.params;

    const restoredUser = await userModel.findByIdAndUpdate(
      id,
      {
        isDeleted: false,
        deletedAt: null,
      },
      { new: true }
    );

    if (!restoredUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User restored successfully",
    });
  } catch (err) {
    console.error("Error restoring user:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =========================
   GET ALL DELETED USERS
========================== */
const getDeletedUsers = async (req, res) => {
  try {
    const deletedUsers = await userModel
      .find(
        { isDeleted: true },
        {
          userEmail: 1,
          userMobile: 1,
          userName: 1,
          gender: 1,
          city: 1,
          profileImage: 1,
          deletedAt: 1,
        }
      )
      .sort({ deletedAt: -1 });

    res.status(200).json({
      success: true,
      data: deletedUsers,
    });
  } catch (err) {
    console.error("Error fetching deleted users:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =========================
   EMAIL INVOICE
========================== */
const emailInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.isAnySubscriptionTaken || !user.paymentDetails || user.paymentDetails.length === 0) {
      return res.status(400).json({ success: false, message: "No active subscription found to email" });
    }

    const latestPayment = user.paymentDetails[user.paymentDetails.length - 1];

    const sendEmail = require("../../utils/nodeMailerMessages");
    await sendEmail(
      user.userEmail,
      "Your Subscription Invoice from AgapeVows",
      "invoiceEmail",
      [user.userName, latestPayment]
    );

    return res.status(200).json({
      success: true,
      message: "Invoice emailed successfully",
    });
  } catch (err) {
    console.error("Error emailing invoice:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* =========================
   UPGRADE USER PLAN (MANUAL)
========================== */
const upgradeUserPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { plan } = req.body;

    if (!plan || !plan.name) {
      return res.status(400).json({ success: false, message: "Plan data is required" });
    }

    const validFrom = new Date();
    const validTo = new Date(validFrom);

    if (plan.durationType === "days") {
      validTo.setDate(validTo.getDate() + Number(plan.duration));
    } else if (plan.durationType === "years") {
      validTo.setFullYear(validTo.getFullYear() + Number(plan.duration));
    } else {
      // default months
      validTo.setMonth(validTo.getMonth() + Number(plan.duration));
    }

    const newPayment = {
      subscriptionValidFrom: validFrom,
      subscriptionValidTo: validTo,
      subscriptionType: plan.name,
      subscriptionAmount: plan.price,
      subscriptionStatus: "Active",
      subscriptionTransactionDate: validFrom,
      subscriptionTransactionId: plan.paymentId || "Admin-Manual",
      subscriptionOrderId: "Admin-" + Date.now(),
      maxProfiles: plan.maxProfiles,
      profilesViewedCount: 0,
      dailyLimit: plan.dailyLimit,
      dailyViewedCount: 0,
      lastViewDate: validFrom,
      canViewProfiles: plan.canViewProfiles,
      viewContactDetails: plan.viewContactDetails,
      sendInterestRequest: plan.sendInterestRequest,
      startChat: plan.startChat,
    };

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      {
        $set: { isAnySubscriptionTaken: true },
        $push: { paymentDetails: newPayment },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Plan upgraded successfully",
      data: updatedUser,
    });
  } catch (err) {
    console.error("Error upgrading plan:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


module.exports = {
  getPaidUsersData,
  approveNewUser,
  getAllNewRequestedUsersData,
  registerAdmin,
  verifyAdmin,
  getAllUsersData,
  deleteUser,
  removeUserSubscription,
  getUserById,
  restoreUser,
  updateUser,
  getDeletedUsers,
  upgradeUserPlan,
  emailInvoice,


};
