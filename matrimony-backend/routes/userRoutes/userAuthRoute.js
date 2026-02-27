// const express = require("express");
// const multer = require("multer");

// const userAuthRoutes = express.Router();
// const userAuthController = require("../../controller/userController/userAuthController")
//  const userChatController = require("../../controller/userController/userChatController")

// const upload = multer({ dest: "uploads/" });








// userAuthRoutes.get("/get-user-info/:userId", userAuthController.getUserInformation)
// userAuthRoutes.get("/get-user-profile/:userId", userAuthController.getUserProfileImage)
// userAuthRoutes.get("/get-all-user-profile/:userId", userAuthController.getAllUserProfileData)
// userAuthRoutes.get("/is-am-made-interest/:userId/:profileId", userAuthController.isUserMadeTheInterest)
// userAuthRoutes.get("/get-all-user-profile-home", userAuthController.getAllUserProfileDataHome)
// userAuthRoutes.get("/new-profile-matches/:userId", userAuthController.getNewProfileMatches)
// userAuthRoutes.get("/get-profile-more-information/:profileId", userAuthController.getProfileMoreInformation)
// userAuthRoutes.get("/get-plan-details", userAuthController.getPlanDetails)
// userAuthRoutes.get("/get-my-active-plan-details/:userId", userAuthController.getMyActivePlanDetails)
// userAuthRoutes.get("/get-short-listed-profile-data/:userId", userAuthController.getShortListedProfileData)

// userAuthRoutes.get("/get-events", userAuthController.getAllEvents)

// userAuthRoutes.get("/get-all-chat-done-by-the-users/:senderId/:receiverId", userChatController.getAllChatDoneByTheUsers)
// userAuthRoutes.get("/send-my-chat-list/:senderId", userChatController.getMyChatList)
// userAuthRoutes.get("/send-my-individual-chat-list/:chatId", userChatController.getMyIndividualChat)
// // userAuthRoutes.post(
// //   "/cancel-user-plan/:userId",
// //   userAuthController.cancelUserPlan
// // );

// userAuthRoutes.get(
//   "/download-invoice/:userId/:transactionId",
//   userAuthController.downloadInvoice
// );




// userAuthRoutes.post("/get-searched-profile-data", userAuthController.getSearchedProfileData)
// userAuthRoutes.post("/get-interested-profile-request/:userId", userAuthController.getInterestedProfileRequest)
// userAuthRoutes.post("/show-user-interests/:userId", userAuthController.showUserInterests)
// userAuthRoutes.post("/complete-profile-data/:userId", upload.fields([
//   { name: "profileImage", maxCount: 1 },
//   { name: "additionalImages", maxCount: 10 },
// ]), userAuthController.completeProfileData)

// userAuthRoutes.post("/delete-additional-images/:userId", userAuthController.deleteAdditionalImages)

// userAuthRoutes.post("/save-plan-details/:userId", userAuthController.savePlanDetails)
// userAuthRoutes.post("/send-my-chat/:senderId/:receiverId", userChatController.saveMyChats)
// userAuthRoutes.post("/short-list-the-profile/:userId", userAuthController.shortListTheProfile)

// userAuthRoutes.put("/change-interest-status/:userId", userAuthController.changeInterestStatus)


// module.exports = userAuthRoutes;

const express = require("express");
const multer = require("multer");

const userAuthRoutes = express.Router();
const userAuthController = require("../../controller/userController/userAuthController");
const userChatController = require("../../controller/userController/userChatController");

// Multer storage for images & video
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// File filter for images and video
const fileFilter = (req, file, cb) => {
  const videoTypes = [".mp4", ".mov", ".avi"];
  const imageTypes = [".jpg", ".jpeg", ".png", ".webp"];
  const ext = file.originalname.slice(file.originalname.lastIndexOf(".")).toLowerCase();

  if (videoTypes.includes(ext) || imageTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only images and video files are allowed"));
  }
};

const upload = multer({ storage, fileFilter });

// ======================== ROUTES ======================== //

userAuthRoutes.get("/get-user-info/:userId", userAuthController.getUserInformation);
userAuthRoutes.get("/get-user-profile/:userId", userAuthController.getUserProfileImage);
userAuthRoutes.get("/get-all-user-profile/:userId", userAuthController.getAllUserProfileData);
userAuthRoutes.get("/is-am-made-interest/:userId/:profileId", userAuthController.isUserMadeTheInterest);
userAuthRoutes.get("/get-all-user-profile-home", userAuthController.getAllUserProfileDataHome);
userAuthRoutes.get("/new-profile-matches/:userId", userAuthController.getNewProfileMatches);
userAuthRoutes.get("/get-profile-more-information/:profileId", userAuthController.getProfileMoreInformation);
userAuthRoutes.get("/get-plan-details", userAuthController.getPlanDetails);
userAuthRoutes.get("/get-my-active-plan-details/:userId", userAuthController.getMyActivePlanDetails);
userAuthRoutes.get("/get-short-listed-profile-data/:userId", userAuthController.getShortListedProfileData);

userAuthRoutes.get("/get-events", userAuthController.getAllEvents);
userAuthRoutes.get(
  "/get-blogs",
  userAuthController.getAllBlogs
);
userAuthRoutes.get("/get-all-chat-done-by-the-users/:senderId/:receiverId", userChatController.getAllChatDoneByTheUsers);
userAuthRoutes.get("/send-my-chat-list/:senderId", userChatController.getMyChatList);
userAuthRoutes.get("/send-my-individual-chat-list/:chatId", userChatController.getMyIndividualChat);

// PDF invoice download
userAuthRoutes.get("/download-invoice/:userId/:transactionId", userAuthController.downloadInvoice);

// POST Requests
userAuthRoutes.post("/get-searched-profile-data", userAuthController.getSearchedProfileData);
userAuthRoutes.post("/get-interested-profile-request/:userId", userAuthController.getInterestedProfileRequest);
userAuthRoutes.post("/show-user-interests/:userId", userAuthController.showUserInterests);

// ================== COMPLETE PROFILE DATA ================== //
// Upload profile images + additional images + self-introduction video
userAuthRoutes.post(
  "/complete-profile-data/:userId",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "additionalImages", maxCount: 10 },
    { name: "selfIntroductionVideo", maxCount: 1 }, // NEW
  ]),
  userAuthController.completeProfileData
);

// DELETE Additional Images
userAuthRoutes.post("/delete-additional-images/:userId", userAuthController.deleteAdditionalImages);

// PLAN & CHAT
userAuthRoutes.post("/save-plan-details/:userId", userAuthController.savePlanDetails);
userAuthRoutes.post("/send-my-chat/:senderId/:receiverId", userChatController.saveMyChats);
userAuthRoutes.post("/short-list-the-profile/:userId", userAuthController.shortListTheProfile);

// UPDATE Interest
userAuthRoutes.put("/change-interest-status/:userId", userAuthController.changeInterestStatus);

// UPDATE agwid to agvid


module.exports = userAuthRoutes;