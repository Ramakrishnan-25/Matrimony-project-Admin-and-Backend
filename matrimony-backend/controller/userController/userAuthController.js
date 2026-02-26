const cloudinary = require("cloudinary").v2;
const bcrypt = require("bcrypt");
const moment = require("moment");
const crypto = require("crypto");
const PDFDocument = require("pdfkit");
const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = require("../../config/variables/variables");
const userModel = require("../../model/user/userModel");
const interestModel = require("../../model/user/interestModel");
const planModel = require("../../model/admin/planModel");
const paymentModel = require("../../model/user/planBookings");
const shortListedSchema = require("../../model/user/shortListedProfile");
const Event = require("../../model/admin/eventModel")
const fs = require("fs");
const puppeteer = require("puppeteer");


cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const generateOrderId = () => {
  const randomNumber = Math.floor(100000 + Math.random() * 900000);
  return `AGPW${randomNumber}`;
};



const getUserInformation = async (req, res) => {
  try {
    const { userId } = req.params;

    const userData = await userModel.findById(userId, { userPassword: 0 });

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get Interest Count
    const interestsCount = await interestModel.countDocuments({
      targetUserId: userId,
    });

    // Get Views Count
    const viewsCount = userData.profileViews ? userData.profileViews.length : 0;

    // Convert to object and add counts
    const responseData = {
      ...userData.toObject(),
      viewsCount,
      interestsCount,
    };

    res.status(200).json({
      success: true,
      message: "User information retrieved successfully",
      data: responseData,
    });
  } catch (err) {
    console.error("Error in getting the user information", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const completeProfileData = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("req.body", req.body);

    const files = req.files;

    /* =========================
       HANDLE HOBBIES (Array)
    ========================== */
    let hobbies = req.body.hobbies;
    if (hobbies && !Array.isArray(hobbies)) hobbies = [hobbies];

    /* =========================
       BUILD UPDATE OBJECT
    ========================== */
    const updates = {
      /* BASIC */
      userName: req.body.name,
      gender: req.body.gender,
      dateOfBirth: req.body.dateOfBirth,
      age: req.body.age,
      profileCreatedFor: req.body.profileCreatedFor,

      bodyType: req.body.bodyType,
      physicalStatus: req.body.physicalStatus,
      complexion: req.body.complexion,
      height: req.body.height,
      weight: req.body.weight,

      maritalStatus: req.body.maritalStatus,
      marriedMonthYear: req.body.marriedMonthYear,
      livingTogetherPeriod: req.body.livingTogetherPeriod,
      divorcedMonthYear: req.body.divorcedMonthYear,
      reasonForDivorce: req.body.reasonForDivorce,
      childStatus: req.body.childStatus,
      numberOfChildren: req.body.numberOfChildren,

      motherTongue: req.body.motherTongue,
      caste: req.body.caste,

      aboutMe: req.body.aboutMe,

      /* LIFESTYLE */
      eatingHabits: req.body.eatingHabits,
      drinkingHabits: req.body.drinkingHabits,
      smokingHabits: req.body.smokingHabits,
      diet: req.body.diet,
      drinking: req.body.drinking,
      smoking: req.body.smoking,
      exercise: req.body.exercise,

      hobbies,
      interests: req.body.interests,
      music: req.body.music,
      favouriteReads: req.body.favouriteReads,
      favouriteCuisines: req.body.favouriteCuisines,
      sportsActivities: req.body.sportsActivities,
      dressStyles: req.body.dressStyles,

      /* FAMILY */
      fathersName: req.body.fathersName,
      mothersName: req.body.mothersName,
      fathersOccupation: req.body.fathersOccupation,
      fathersProfession: req.body.fathersProfession,
      mothersOccupation: req.body.mothersOccupation,
      fathersNative: req.body.fathersNative,
      mothersNative: req.body.mothersNative,
      familyValue: req.body.familyValue,
      familyType: req.body.familyType,
      familyStatus: req.body.familyStatus,
      residenceType: req.body.residenceType,
      numberOfBrothers: req.body.numberOfBrothers,
      numberOfSisters: req.body.numberOfSisters,

      /* RELIGIOUS */
      religion: req.body.religion,
      denomination: req.body.denomination,
      church: req.body.church,
      churchActivity: req.body.churchActivity,
      pastorsName: req.body.pastorsName,
      spirituality: req.body.spirituality,
      religiousDetail: req.body.religiousDetail,

      /* CONTACT */
      userMobile: req.body.phone,
      whatsapp: req.body.whatsapp,
      facebook: req.body.facebook,
      instagram: req.body.instagram,
      x: req.body.x,
      youtube: req.body.youtube,
      linkedin: req.body.linkedin,
      alternateMobile: req.body.alternateMobile,
      landlineNumber: req.body.landlineNumber,
      currentAddress: req.body.currentAddress,
      permanentAddress: req.body.permanentAddress,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
      address: req.body.address,
      contactPersonName: req.body.contactPersonName,
      relationship: req.body.relationship,
      citizenOf: req.body.citizenOf,

      /* PROFESSIONAL */
      education: req.body.education,
      additionalEducation: req.body.additionalEducation,
      educationDetail: req.body.educationDetail,
      employmentType: req.body.employmentType,
      occupation: req.body.occupation,
      position: req.body.position,
      companyName: req.body.companyName,
      annualIncome: req.body.annualIncome,

      // legacy mapping
      jobType: req.body.employmentType,
      salary: req.body.annualIncome,
      degree: req.body.degree,
      school: req.body.school,
      college: req.body.college,
      jobExperience: req.body.jobExperience,

      /* PARTNER PREFERENCES */
      partnerAgeFrom: req.body.partnerAgeFrom,
      partnerAgeTo: req.body.partnerAgeTo,
      partnerHeight: req.body.partnerHeight,
      partnerMaritalStatus: req.body.partnerMaritalStatus,
      partnerMotherTongue: req.body.partnerMotherTongue,
      partnerCaste: req.body.partnerCaste,
      partnerPhysicalStatus: req.body.partnerPhysicalStatus,
      partnerEatingHabits: req.body.partnerEatingHabits,
      partnerDrinkingHabits: req.body.partnerDrinkingHabits,
      partnerSmokingHabits: req.body.partnerSmokingHabits,
      partnerDenomination: req.body.partnerDenomination,
      partnerSpirituality: req.body.partnerSpirituality,
      partnerEducation: req.body.partnerEducation,
      partnerEmploymentType: req.body.partnerEmploymentType,
      partnerOccupation: req.body.partnerOccupation,
      partnerAnnualIncome: req.body.partnerAnnualIncome,
      partnerCountry: req.body.partnerCountry,
      partnerState: req.body.partnerState,
      partnerDistrict: req.body.partnerDistrict,
      profileVisibility: req.body.profileVisibility,

      isProfileCompleted: true,
      profileStatus: "Completed",
    };

    /* =========================
       PASSWORD (OPTIONAL)
    ========================== */
    if (req.body.password && req.body.password.trim() !== "") {
      updates.userPassword = await bcrypt.hash(req.body.password, 10);
    }

    /* =========================
       PROFILE IMAGE
    ========================== */
    if (files?.profileImage?.[0]) {
      const profile = await cloudinary.uploader.upload(
        files.profileImage[0].path,
        { folder: `matrimony/users/${userId}/profileImage` }
      );
      updates.profileImage = profile.secure_url;
      fs.unlinkSync(files.profileImage[0].path);
    } else if (req.body.deleteProfileImage === "true") {
      // Handle deletion of existing profile image
      const user = await userModel.findById(userId);
      if (user && user.profileImage) {
        const imageUrl = user.profileImage;
        // Try to extract Cloudinary public_id from the URL
        const cloudinaryRegex = /https?:\/\/res\.cloudinary\.com\/[^/]+\/(?:image|raw|upload)\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/;
        let publicId = null;
        const match = imageUrl.match(cloudinaryRegex);
        if (match && match[1]) {
          publicId = match[1];
        } else {
          const idx = imageUrl.indexOf("/upload/");
          if (idx !== -1) {
            publicId = imageUrl.substring(idx + "/upload/".length).replace(/^v\d+\//, "").replace(/\.[^/.]+$/, "");
          }
        }

        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (cloudinaryErr) {
            console.warn("Could not delete from Cloudinary:", cloudinaryErr);
          }
        }
      }
      updates.profileImage = "";
    }

    /* =========================
       ADDITIONAL IMAGES
    ========================== */
    let additionalImages = [];
    
    // Include existing images that weren't deleted
    if (req.body.existingAdditionalImages) {
      const existingImages = Array.isArray(req.body.existingAdditionalImages)
        ? req.body.existingAdditionalImages
        : [req.body.existingAdditionalImages];
      additionalImages = [...existingImages];
    }
    
    // Add newly uploaded images
    if (files?.additionalImages?.length) {
      const uploadedImages = await Promise.all(
        files.additionalImages.map((file) =>
          cloudinary.uploader.upload(file.path, {
            folder: `matrimony/users/${userId}/additionalImages`,
          })
        )
      );

      additionalImages = [
        ...additionalImages,
        ...uploadedImages.map((img) => img.secure_url),
      ];
      files.additionalImages.forEach((f) => fs.unlinkSync(f.path));
    }
    
    if (additionalImages.length > 0) {
      updates.additionalImages = additionalImages;
    }

    console.log("🔄 Final Updates:", updates);

    const updatedUser = await userModel.findByIdAndUpdate(userId, updates, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    console.error("❌ Error in profile update:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


const getUserProfileImage = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Fetch the user data
    const userImage = await userModel.findOne(
      { _id: userId },
      {
        userPassword: 0,
      }
    );

    if (!userImage) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get Interest Count
    const interestsCount = await interestModel.countDocuments({
      targetUserId: userId,
    });

    // Get Views Count
    const viewsCount = userImage.profileViews ? userImage.profileViews.length : 0;

    // Convert to object and add counts
    const responseData = {
      ...userImage.toObject(),
      viewsCount,
      interestsCount,
    };

    // Send back the image URL or data
    res.status(200).json({
      success: true,
      message: "Profile image retrieved successfully",
      data: responseData,
    });
  } catch (err) {
    console.error("Error fetching user profile image:", err);
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving the profile image",
    });
  }
};

const deleteProfileImage = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const imageUrl = user.profileImage;
    if (!imageUrl) {
      return res.status(200).json({ success: true, message: "No profile image to delete" });
    }

    // Try to extract Cloudinary public_id from the URL
    const cloudinaryRegex = /https?:\/\/res\.cloudinary\.com\/[^/]+\/(?:image|raw|upload)\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/;
    let publicId = null;
    const match = imageUrl.match(cloudinaryRegex);
    if (match && match[1]) {
      publicId = match[1];
    } else {
      const idx = imageUrl.indexOf("/upload/");
      if (idx !== -1) {
        publicId = imageUrl.substring(idx + "/upload/".length).replace(/^v\d+\//, "").replace(/\.[^/.]+$/, "");
      }
    }

    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    } else {
      console.warn("Could not determine Cloudinary public_id for:", imageUrl);
    }

    // Clear reference in DB
    user.profileImage = "";
    await user.save();

    return res.status(200).json({ success: true, message: "Profile image deleted successfully" });
  } catch (err) {
    console.error("Error deleting profile image:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getAllUserProfileData = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get current user's gender
    const currentUser = await userModel.findById(userId, { gender: 1 });
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userGender = currentUser.gender;

    // Find all users excluding same gender and current user
    const userData = await userModel.find(
      {
        _id: { $ne: userId },
        gender: { $ne: userGender },
      },
      { userPassword: 0 }
    );

    res.status(200).json({
      success: true,
      message: "All opposite-gender users fetched successfully",
      data: userData,
    });
  } catch (err) {
    console.log("Error in getAllUserProfileData:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getAllUserProfileDataHome = async (req, res) => {
  try {
    const userData = await userModel.find({}, { userPassword: 0 });

    res.status(200).json({
      success: true,
      message: "All users excluding the current user fetched successfully",
      data: userData,
    });
  } catch (err) {
    console.log("Error in getAllUserProfileData:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getProfileMoreInformation = async (req, res) => {
  try {
    const { profileId } = req.params;
    const { viewerId } = req.query; // Check for viewerId in query params

    const profileData = await userModel.findById(
      { _id: profileId },
      { userPassword: 0 }
    );

    if (!profileData) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    // Logic to update view count (Unique Views)
    if (viewerId && viewerId !== profileId) {
      // Ensure profileViews array exists (schema update handled)
      if (!profileData.profileViews) {
        profileData.profileViews = [];
      }

      // Add viewerId if not already present
      if (!profileData.profileViews.includes(viewerId)) {
        profileData.profileViews.push(viewerId);
        await profileData.save();
      }
    }

    // Check interest status
    let interestStatus = null;
    if (viewerId) {
      const interest = await interestModel.findOne({
        senderId: viewerId,
        targetUserId: profileId
      });
      if (interest) {
        interestStatus = interest.status;
      }
    }

    // Add interestStatus to the response data
    const responseData = {
      ...profileData.toObject(),
      interestStatus
    };

    return res.status(200).json({
      success: true,
      message: "Profile data fetched successfully",
      data: responseData,
    });
  } catch (err) {
    console.log("Error in getting the more details of the profile", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const showUserInterests = async (req, res) => {
  try {
    const { userId } = req.params;
    const { interestData } = req.body;

    const { targetUser, permissions, message } = interestData;

    // Check if any interest already exists between the two users
    const existingInterest = await interestModel.findOne({
      senderId: userId,
      targetUserId: targetUser,
    });

    if (existingInterest) {
      // Update existing interest (status becomes 'pending' again)
      existingInterest.status = "pending";
      existingInterest.message = message;
      existingInterest.sharedSections = {
        about: permissions.about || false,
        photoGallery: permissions.photo || false,
        contactInfo: permissions.contact || false,
        personalInfo: permissions.personal || false,
        hobbies: permissions.hobbies || false,
        socialMedia: permissions.social || false,
      };

      await existingInterest.save();

      return res.status(200).json({
        success: true,
        message: "Interest request updated successfully",
        interestId: existingInterest._id,
      });
    }

    // Create new interest
    const newInterest = new interestModel({
      senderId: userId,
      targetUserId: targetUser,
      message: message,
      sharedSections: {
        about: permissions.about || false,
        photoGallery: permissions.photo || false,
        contactInfo: permissions.contact || false,
        personalInfo: permissions.personal || false,
        hobbies: permissions.hobbies || false,
        socialMedia: permissions.social || false,
      },
      status: "pending",
    });

    await newInterest.save();

    return res.status(200).json({
      success: true,
      message: "Interest sent successfully",
      interestId: newInterest._id,
    });
  } catch (err) {
    console.error("Error in saving the user interest", err);
    return res.status(500).json({
      success: false,
      message: "Failed to send interest",
    });
  }
};

const getInterestedProfileRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reqStatus } = req.body;

    if (!userId || !reqStatus) {
      return res.status(400).json({
        success: false,
        message: "Missing userId or request status",
      });
    }

    const interests = await interestModel.find(
      {
        targetUserId: userId,
        status: reqStatus,
      },
      { sharedSections: 0 }
    );

    const senderIds = interests.map((item) => item.senderId);

    const senderDetails = await userModel.find(
      { _id: { $in: senderIds } },
      "userName profileImage city age gender jobType height"
    );

    const mergedData = interests.map((interest) => {
      const sender = senderDetails.find(
        (u) => u._id.toString() === interest.senderId
      );
      return {
        ...interest.toObject(),
        senderDetails: sender || null,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Interested profiles fetched successfully",
      data: mergedData,
    });
  } catch (err) {
    console.log("Error in getting the interested profile request", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const changeInterestStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reqStatus, profileId } = req.body;
    console.log(userId, reqStatus, profileId);

    if (!userId || !reqStatus || !profileId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const interest = await interestModel.findOneAndUpdate(
      { targetUserId: userId, senderId: profileId },
      { status: reqStatus },
      { new: true }
    );

    if (!interest) {
      return res.status(404).json({
        success: false,
        message: "Interest request not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Interest status updated to '${reqStatus}'`,
      data: interest,
    });
  } catch (err) {
    console.log(
      "Error in changing the status of the interested profile request",
      err
    );
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const getNewProfileMatches = async (req, res) => {
  try {
    const { userId } = req.params;

    const currentUser = await userModel.findById(userId);
    if (!currentUser)
      return res.status(404).json({ message: "User not found" });

    const {
      gender,
      partnerAgeFrom,
      partnerAgeTo,
      partnerCaste,
      partnerDistrict,
      partnerHeight,
      religion,
    } = currentUser;

    const oppositeGender = gender === "Male" ? "Female" : "Male";

    // Defaults to avoid Invalid Date
    const ageFrom = partnerAgeFrom ? Number(partnerAgeFrom) : 18;
    const ageTo = partnerAgeTo ? Number(partnerAgeTo) : 100;

    // Calculate DOB range
    const currentYear = new Date().getFullYear();
    const minDOB = new Date(currentYear - ageTo, 0, 1);
    const maxDOB = new Date(currentYear - ageFrom, 11, 31);

    // Convert height to number logic
    const heightFrom = partnerHeight ? parseFloat(partnerHeight) : null;

    const filters = [
      { dateOfBirth: { $gte: minDOB, $lte: maxDOB } },
      religion ? { religion: religion } : null,
      partnerCaste ? { caste: partnerCaste } : null,
      partnerDistrict ? { city: partnerDistrict } : null,
      (heightFrom && !isNaN(heightFrom))
        ? {
          $expr: {
            $gte: [
              {
                $convert: {
                  input: "$height",
                  to: "double",
                  onError: 0,
                  onNull: 0
                }
              },
              heightFrom
            ]
          }
        }
        : null,
    ].filter(Boolean);

    const rawMatches = await userModel
      .find({
        _id: { $ne: userId },
        gender: oppositeGender,
        $or: filters,
      })
      .limit(5);

    // Return only selected fields + calculated age
    const matches = rawMatches.map((user) => {
      const dob = new Date(user.dateOfBirth);
      const age = new Date().getFullYear() - dob.getFullYear();

      return {
        _id: user._id,
        userName: user.userName,
        profileImage: user.profileImage,
        city: user.city,
        age,
      };
    });

    res.status(200).json({ matches });
  } catch (err) {
    console.error("Error in getting the new profile matches", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getSearchedProfileData = async (req, res) => {
  try {
    const {
      ageFrom,
      ageTo,
      heightFrom,
      heightTo,
      gender,
      maritalStatus,
      motherTongue,
      caste,
      denomination,
      religion,
      country,
      state,
      districtCity,
      education,
      occupation,
      annualIncomeFrom,
      annualIncomeTo,
      physicalStatus,
      familyStatus,
      showWithPhoto,
      lookingFor
    } = req.body;
    const query = {
      isApproved: true,
    };

    // Handle Gender/LookingFor logic
    let searchGender = gender;
    if (!searchGender && lookingFor) {
      searchGender = lookingFor;
    }

    if (searchGender && searchGender !== "all" && searchGender !== "I'm looking for" && searchGender !== "Any") {
      if (searchGender === "Men" || searchGender === "Male" || searchGender === "Groom") query.gender = "Male";
      else if (searchGender === "Women" || searchGender === "Female" || searchGender === "Bride") query.gender = "Female";
      else query.gender = searchGender;
    }
    if (ageFrom || ageTo) {
      query.age = {};
      if (ageFrom) query.age.$gte = parseInt(ageFrom);
      if (ageTo) query.age.$lte = parseInt(ageTo);
    }
    if (heightFrom || heightTo) {
      query.height = {};
      if (heightFrom) query.height.$gte = heightFrom;
      if (heightTo) query.height.$lte = heightTo;
    }
    if (religion && religion !== "Any" && religion !== "all") query.religion = religion;
    if (motherTongue) query.motherTongue = motherTongue;
    if (caste) query.caste = caste;
    if (denomination) query.denomination = denomination;
    if (education) query.education = education;
    if (occupation) query.occupation = occupation;
    if (country) query.citizenOf = country;
    if (state) query.state = state;
    if (districtCity) query.city = districtCity;
    if (maritalStatus) {
      if (Array.isArray(maritalStatus) && maritalStatus.length > 0) {
        if (!maritalStatus.includes("Any")) {
          query.maritalStatus = { $in: maritalStatus };
        }
      } else if (typeof maritalStatus === "string" && maritalStatus !== "Any") {
        query.maritalStatus = maritalStatus;
      }
    }
    if (physicalStatus) {
      if (Array.isArray(physicalStatus) && physicalStatus.length > 0) {
        if (!physicalStatus.includes("Doesn't Matter")) {
          query.physicalStatus = { $in: physicalStatus };
        }
      } else if (typeof physicalStatus === "string" && physicalStatus !== "Doesn't Matter") {
        query.physicalStatus = physicalStatus;
      }
    }
    if (familyStatus && Array.isArray(familyStatus) && familyStatus.length > 0) {
      query.familyStatus = { $in: familyStatus };
    }
    if (showWithPhoto) {
      query.profileImage = { $exists: true, $ne: "" };
    }
    const users = await userModel.find(query)
      .select("-userPassword -__v")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Error in getSearchedProfileData:", error);
    res.status(500).json({
      success: false,
      message: "Server Error fetching search results",
      error: error.message
    });
  }
};

const getPlanDetails = async (req, res) => {
  try {
    const planData = await planModel.find({ status: "Active" });

    res.status(200).json({
      success: true,
      message: "Active plans fetched successfully",
      data: planData,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// ✅ SAVE PLAN DETAILS (🔥 MAIN FIX HERE)
const savePlanDetails = async (req, res) => {
  try {
    const { paymentData } = req.body;

    console.log("paymentData", paymentData);

    // ✅ VALID FROM
    const validFrom = new Date(paymentData.timestamp);

    // ✅ VALID TO (🔥 FIXED)
    const validTo = calculateValidTo(
      validFrom,
      paymentData.planDetails.duration,
      paymentData.planDetails.durationType
    );

    const orderId = generateOrderId();

    // ✅ SAVE PAYMENT
    const payment = new paymentModel({
      userId: paymentData.userId,
      razorpayPaymentId: paymentData.razorpayPaymentId,
      planId: paymentData.planId,
      planName: paymentData.planName,
      amount: paymentData.amount,
      currency: paymentData.currency,
      paymentStatus: paymentData.paymentStatus,
      paymentMethod: paymentData.paymentMethod,
      timestamp: validFrom,
      planDetails: paymentData.planDetails,
      orderId: orderId,
    });

    await payment.save();

    // ✅ UPDATE USER
    await userModel.findByIdAndUpdate(
      paymentData.userId,
      {
        $push: {
          paymentDetails: {
            subscriptionValidFrom: validFrom,
            subscriptionValidTo: validTo, // ✅ FIXED
            subscriptionType: paymentData.planName,
            subscriptionAmount: paymentData.amount,
            subscriptionStatus:
              paymentData.paymentStatus === "success"
                ? "Active"
                : "Pending",
            subscriptionTransactionDate: validFrom,
            subscriptionTransactionId:
              paymentData.razorpayPaymentId,
            subscriptionOrderId: orderId,
            isEmployeeAssisted: false,
            assistedEmployeeId: "",
            assistedEmployeeName: "",
          },
        },
        $set: {
          isAnySubscriptionTaken: true,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Subscription updated successfully",
      orderId: orderId,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed",
      error: error.message,
    });
  }
};


// ✅ GET MY ACTIVE PLAN
const getMyActivePlanDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    // ✅ Get user + required fields
    const userData = await userModel.findOne(
      { _id: userId },
      {
        paymentDetails: 1,
        userName: 1,
        userEmail: 1,
        userMobile: 1,
        agwid: 1,
      }
    );

    if (!userData || !userData.paymentDetails?.length) {
      return res.status(404).json({
        success: false,
        message: "No subscription found",
      });
    }

    // ✅ Filter only ACTIVE plans
    const activePlans = userData.paymentDetails.filter(
      (plan) => plan.subscriptionStatus === "Active"
    );

    if (!activePlans.length) {
      return res.status(404).json({
        success: false,
        message: "No active plan",
      });
    }

    // ✅ Sort latest plan
    activePlans.sort(
      (a, b) =>
        new Date(b.subscriptionValidFrom) -
        new Date(a.subscriptionValidFrom)
    );

    const latestPlan = activePlans[0];

    // ✅ Format date
    const formatDate = (date) =>
      new Date(date).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      });

    // ✅ FINAL RESPONSE (🔥 USER + PLAN)
    return res.status(200).json({
      success: true,
      activePlan: {
        subscriptionType: latestPlan.subscriptionType,
        subscriptionAmount: latestPlan.subscriptionAmount,
        subscriptionValidFrom: formatDate(
          latestPlan.subscriptionValidFrom
        ),
        subscriptionValidTo: formatDate(
          latestPlan.subscriptionValidTo
        ),
        
         subscriptionTransactionId: latestPlan.subscriptionTransactionId,

        // 🔥 USER DETAILS ADDED
        userName: userData.userName,
        userEmail: userData.userEmail,
        userMobile: userData.userMobile,
        agwid: userData.agwid,
         orderId: userData.orderId,
      },
    });
  } catch (err) {
    console.log("Error in getMyActivePlanDetails:", err);
    return res.status(500).json({
      success: false,
      message: "Internal error",
    });
  }
};

const shortListTheProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { profileId } = req.body;

    console.log("userId", userId);
    console.log("profileId", profileId);

    let shortListedData = await shortListedSchema.findOne({ userId });

    if (shortListedData) {
      const alreadyShortlisted = shortListedData.profiles.includes(profileId);
      if (!alreadyShortlisted) {
        shortListedData.profiles.push(profileId);
        await shortListedData.save();
      }

      return res.status(200).json({
        success: true,
        message: alreadyShortlisted
          ? "Profile already shortlisted"
          : "Profile added to shortlist",
        data: shortListedData,
      });
    } else {
      const newShortlist = await shortListedSchema.create({
        userId,
        profiles: [profileId],
      });

      return res.status(201).json({
        success: true,
        message: "Shortlist created and profile added",
        data: newShortlist,
      });
    }
  } catch (err) {
    console.log("Error in shortListTheProfile", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const getShortListedProfileData = async (req, res) => {
  try {
    const { userId } = req.params;

    const shortListData = await shortListedSchema.findOne({ userId });

    if (!shortListData || shortListData.profiles.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No shortlisted profiles found.",
        data: [],
      });
    }

    const profiles = await userModel.find(
      { _id: { $in: shortListData.profiles } },
      { userName: 1, profileImage: 1, age: 1, city: 1, height: 1, degree: 1 }
    );

    return res.status(200).json({
      success: true,
      message: "Shortlisted profiles fetched successfully",
      data: profiles,
    });
  } catch (err) {
    console.log("Error in getShortListedProfileData", err);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};


const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};











const isUserMadeTheInterest = async (req, res) => {
  try {
    const { userId, profileId } = req.params;
    const interest = await interestModel.findOne({
      senderId: userId,
      targetUserId: profileId,
    });

    if (interest) {
      return res.status(200).json({
        success: true,
        status: interest.status,
        message: "Interest found",
        data: interest,
      });
    } else {
      return res.status(200).json({
        success: true,
        status: null,
        message: "Interest not found",
        data: null,
      });
    }
  } catch (err) {
    console.error("Error in isUserMadeTheInterest", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteAdditionalImages = async (req, res) => {
  try {
    const { userId } = req.params;
    const { imagesToDelete } = req.body;

    if (!imagesToDelete || !Array.isArray(imagesToDelete) || imagesToDelete.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images to delete",
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete images from Cloudinary and remove from DB
    const deletePromises = imagesToDelete.map(async (imageUrl) => {
      try {
        // Extract Cloudinary public_id from the URL
        const cloudinaryRegex = /https?:\/\/res\.cloudinary\.com\/[^/]+\/(?:image|raw|upload)\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/;
        let publicId = null;
        const match = imageUrl.match(cloudinaryRegex);
        if (match && match[1]) {
          publicId = match[1];
        } else {
          const idx = imageUrl.indexOf("/upload/");
          if (idx !== -1) {
            publicId = imageUrl.substring(idx + "/upload/".length).replace(/^v\d+\//, "").replace(/\.[^/.]+$/, "");
          }
        }

        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (cloudinaryErr) {
        console.warn("Could not delete from Cloudinary:", cloudinaryErr);
      }
    });

    await Promise.all(deletePromises);

    // Remove from DB
    user.additionalImages = user.additionalImages.filter(
      (img) => !imagesToDelete.includes(img)
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: "Additional images deleted successfully",
    });
  } catch (err) {
    console.error("Error in deleteAdditionalImages:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const savePaymentAndActivatePlan = async (req, res) => {
  try {
    const {
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      userId,
      planId,
      planName,
      amount,
      planDetails,
    } = req.body;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const validFrom = new Date();

    const validTo = calculateValidTo(
      validFrom,
      planDetails.duration,
      planDetails.durationType
    );

    await userModel.findByIdAndUpdate(userId, {
      isAnySubscriptionTaken: true,
      $push: {
        paymentDetails: {
          subscriptionValidFrom: validFrom,
          subscriptionValidTo: validTo,
          subscriptionType: planName,
          subscriptionAmount: amount,
          subscriptionStatus: "Active",
          subscriptionTransactionDate: new Date(),
          subscriptionTransactionId: razorpayPaymentId,
          subscriptionOrderId: razorpayOrderId,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Payment successful & plan activated",
    });

  } catch (error) {
    console.error("Payment Save Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
// ✅ HELPER FUNCTION (VERY IMPORTANT)
const calculateValidTo = (validFrom, duration, durationType) => {
  const validTo = new Date(validFrom);

  if (durationType === "days") {
    validTo.setDate(validTo.getDate() + duration);
  } else if (durationType === "months") {
    validTo.setMonth(validTo.getMonth() + duration);
  } else if (durationType === "years") {
    validTo.setFullYear(validTo.getFullYear() + duration);
  } else {
    // fallback (default 1 month)
    validTo.setMonth(validTo.getMonth() + 1);
  }

  return validTo;
};




const cancelUserPlan = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason, message } = req.body;

    console.log("USER ID:", userId);
    console.log("BODY:", req.body);

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ No plan case
    if (!user.paymentDetails || user.paymentDetails.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No plan found",
      });
    }

    // ✅ find active or first plan
    let plan = user.paymentDetails.find(
      (p) => p.subscriptionStatus !== "Cancelled"
    );

    // 👉 If all plans already cancelled
    if (!plan) {
      console.log("Already cancelled → cleaning...");

      user.isAnySubscriptionTaken = false;
      user.paymentDetails = [];

      await user.save();

      return res.status(200).json({
        success: true,
        message: "Plan already cancelled and cleaned",
        data: user,
      });
    }

    // ✅ Cancel plan
    plan.subscriptionStatus = "Cancelled";
    plan.cancelReason = reason;
    plan.cancelMessage = message;

    // ✅ முக்கியம் (MAIN FIX)
    user.isAnySubscriptionTaken = false;

    // ✅ ARRAY EMPTY (YOUR REQUIREMENT)
    user.paymentDetails = [];

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Plan cancelled successfully",
      data: user,
    });

  } catch (err) {
    console.error("🔥 CANCEL ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};



// const downloadInvoice = async (req, res) => {
//   try {
//     const { userId, transactionId } = req.params;

//     const user = await userModel.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const payment = user.paymentDetails.find(
//       (p) => p.subscriptionTransactionId === transactionId
//     );

//     if (!payment) {
//       return res.status(404).json({ message: "Payment not found" });
//     }

//     // ✅ CREATE PDF
//     const doc = new PDFDocument({ size: "A4", margin: 50 });

//     // ✅ HEADERS (VERY IMPORTANT)
//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename=invoice-${transactionId}.pdf`
//     );

//     // ✅ PIPE DIRECTLY
//     doc.pipe(res);

//     // ✅ CONTENT
//     doc.fontSize(20).text("INVOICE", { align: "center" });
//     doc.moveDown();
//     doc.text(`Order ID: ${payment.subscriptionOrderId}`);
//     doc.fontSize(12).text(`Name: ${user.userName}`);
//     doc.text(`Email: ${user.userEmail}`);
//     doc.text(`Mobile: ${user.userMobile}`);
//     doc.text(`AGW ID: ${user.agwid}`);

//     doc.moveDown();

//     doc.text(`Plan: ${payment.subscriptionType}`);
//     doc.text(`Amount: ₹${payment.subscriptionAmount}`);

//     doc.text(`From: ${new Date(payment.subscriptionValidFrom).toLocaleString("en-IN")}`);
//     doc.text(`To: ${new Date(payment.subscriptionValidTo).toLocaleString("en-IN")}`);

//     doc.text(`Transaction ID: ${payment.subscriptionTransactionId}`);

//     // ✅ VERY VERY IMPORTANT
//     doc.end();

//   } catch (err) {
//     console.error("PDF ERROR:", err);
//     res.status(500).json({ message: "PDF generation failed" });
//   }
// };


const downloadInvoice = async (req, res) => {
  try {
    const { userId, transactionId } = req.params;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const payment = user.paymentDetails.find(
      (p) => p.subscriptionTransactionId === transactionId
    );

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const doc = new PDFDocument({ size: "A4", margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${transactionId}.pdf`
    );

    doc.pipe(res);

    // ================= HEADER =================
    doc.rect(0, 0, doc.page.width, 90).fill("#6A1B9A");

    doc.fillColor("#fff")
      .fontSize(20)
      .text("AGAPE VOWS MATRIMONY", 0, 35, { align: "center" });

    doc.moveDown(3);
    doc.fillColor("#000");

    // ================= TITLE =================
    doc.fontSize(16)
      .font("Helvetica-Bold")
      .text("INVOICE", { align: "right" });

    doc.fontSize(10)
      .font("Helvetica")
      .text(`Order ID: ${payment.subscriptionOrderId}`, { align: "right" });

    doc.moveDown(1.5);

    // ================= CUSTOMER BOX =================
    const boxY = doc.y;

    doc.roundedRect(40, boxY, 515, 90, 8).stroke("#ccc");

    doc.fontSize(11);
    doc.text(`Name: ${user.userName}`, 55, boxY + 10);
    doc.text(`Email: ${user.userEmail}`, 55, boxY + 28);
    doc.text(`Mobile: ${user.userMobile}`, 55, boxY + 46);
    doc.text(`AGW ID: ${user.agwid}`, 55, boxY + 64);

    doc.moveDown(5);

    // ================= PLAN DETAILS =================
    const planY = doc.y;

    // Header
    doc.rect(40, planY, 515, 25).fill("#EDE7F6");

    doc.fillColor("#000")
      .font("Helvetica-Bold")
      .text("Plan Details", 50, planY + 7);

    doc.moveDown(2);

    doc.font("Helvetica");

    // Plan content
    doc.text(`Plan: ${payment.subscriptionType}`);
    doc.text(`Amount: ₹${payment.subscriptionAmount}`);
    doc.text(
      `Valid From: ${new Date(payment.subscriptionValidFrom).toLocaleString("en-IN")}`
    );
    doc.text(
      `Valid To: ${new Date(payment.subscriptionValidTo).toLocaleString("en-IN")}`
    );

    // ✅ Transaction ID moved INSIDE plan section
    doc.text(`Transaction ID: ${payment.subscriptionTransactionId}`);

    doc.moveDown(1.5);

    // ================= AMOUNT BOX =================
    const amtY = doc.y;

    doc.roundedRect(40, amtY, 515, 35, 8).fill("#F3E5F5");

    doc.fillColor("#4A148C")
      .fontSize(14)
      .font("Helvetica-Bold")
      .text(
        `Total Paid: ₹${payment.subscriptionAmount}`,
        50,
        amtY + 10
      );

    doc.moveDown(3);

    // ================= FOOTER (FIXED BOTTOM) =================
    doc.fontSize(10)
      .fillColor("gray")
      // .text(
      //   "Thank you for choosing Agape Vows Matrimony. We wish you a happy married life ❤️",
      //   40,
      //   doc.page.height - 50,
      //   {
      //     width: doc.page.width - 80,
      //     align: "center",
      //   }
      // );

    doc.end();

  } catch (err) {
    console.error("PDF ERROR:", err);
    res.status(500).json({ message: "PDF generation failed" });
  }
};


module.exports = {
  getAllEvents,
  getShortListedProfileData,
  shortListTheProfile,
  getMyActivePlanDetails,
  savePlanDetails,
  getPlanDetails,
  getSearchedProfileData,
  getNewProfileMatches,
  getAllUserProfileDataHome,
  changeInterestStatus,
  getInterestedProfileRequest,
  getUserProfileImage,
  getUserInformation,
  completeProfileData,
  getAllUserProfileData,
  getProfileMoreInformation,
  showUserInterests,
  isUserMadeTheInterest,
  deleteAdditionalImages,
  savePaymentAndActivatePlan,
  // cancelUserPlan,
  downloadInvoice,
};
