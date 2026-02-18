// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import NewLayout from "./layout/NewLayout";
// import {
//   getUserById,
//   updateUserById,
// } from "../../api/service/adminServices";

// const AdminEditUser = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState(false);

//   const [formData, setFormData] = useState({
//     userName: "",
//     userEmail: "",
//     userMobile: "",
//     city: "",
//     gender: "",
//   });

//   // ✅ Fetch user details
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await getUserById(id);

//         if (response.status === 200) {
//           setFormData(response.data.data);
//         }
//       } catch (error) {
//         console.error("Fetch user error:", error);
//         alert("Failed to load user data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, [id]);

//   // ✅ Handle input change
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // ✅ Update user
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setUpdating(true);

//     try {
//       const response = await updateUserById(id, formData);

//       if (response.status === 200) {
//         alert("User updated successfully");
//         navigate("/admin/all-users");
//       }
//     } catch (error) {
//       console.error("Update error:", error);
//       alert("Failed to update user");
//     } finally {
//       setUpdating(false);
//     }
//   };

//   if (loading) {
//     return (
//       <NewLayout>
//         <div className="text-center p-5">
//           <div className="spinner-border"></div>
//         </div>
//       </NewLayout>
//     );
//   }

//   return (
//     <NewLayout>
//       <div className="container mt-4">
//         <div className="card shadow-sm">
//           <div className="card-header bg-light">
//             <h5 className="mb-0">Edit User</h5>
//           </div>

//           <div className="card-body">
//             <form onSubmit={handleSubmit}>
//               {/* Name */}
//               <div className="mb-3">
//                 <label className="form-label">Full Name</label>
//                 <input
//                   type="text"
//                   name="userName"
//                   className="form-control"
//                   value={formData.userName}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               {/* Email */}
//               <div className="mb-3">
//                 <label className="form-label">Email</label>
//                 <input
//                   type="email"
//                   name="userEmail"
//                   className="form-control"
//                   value={formData.userEmail}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               {/* Mobile */}
//               <div className="mb-3">
//                 <label className="form-label">Mobile</label>
//                 <input
//                   type="text"
//                   name="userMobile"
//                   className="form-control"
//                   value={formData.userMobile}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               {/* City */}
//               <div className="mb-3">
//                 <label className="form-label">City</label>
//                 <input
//                   type="text"
//                   name="city"
//                   className="form-control"
//                   value={formData.city}
//                   onChange={handleChange}
//                 />
//               </div>

//               {/* Gender */}
//               <div className="mb-3">
//                 <label className="form-label">Gender</label>
//                 <select
//                   name="gender"
//                   className="form-control"
//                   value={formData.gender}
//                   onChange={handleChange}
//                 >
//                   <option value="">Select Gender</option>
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>

//               {/* Buttons */}
//               <div className="d-flex justify-content-between">
//                 <button
//                   type="button"
//                   className="btn btn-secondary"
//                   onClick={() => navigate(-1)}
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   type="submit"
//                   className="btn btn-primary"
//                   disabled={updating}
//                 >
//                   {updating ? "Updating..." : "Update User"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </NewLayout>
//   );
// };

// export default AdminEditUser;


import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NewLayout from "./layout/NewLayout";
import { getUserInfoByAdmin, savePersonalInfoByAdmin,deleteAdditionalImagesByAdmin } from "../../api/service/adminServices";
import { Country, State, City } from "country-state-city";

// Import your BasicInformation component
import BasicInfomation from "./BasicInfomation"; // Make sure the path is correct

const AdminEditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    // --- Basic Info ---
    aboutMe: "",
    gender: "",
    profileCreatedFor: "",
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    age: "",
    bodyType: "",
    physicalStatus: "",
    complexion: "",
    height: "",
    weight: "",
    maritalStatus: "",
    marriedMonthYear: "",
    livingTogetherPeriod: "",
    divorcedMonthYear: "",
    reasonForDivorce: "",
    childStatus: "",
    numberOfChildren: "",
    eatingHabits: "",
    drinkingHabits: "",
    smokingHabits: "",
    motherTongue: "",
    caste: "",

    // --- Family Details ---
    fathersName: "",
    mothersName: "",
    fathersOccupation: "",
    fathersProfession: "",
    mothersOccupation: "",
    fathersNative: "",
    mothersNative: "",
    familyValue: "",
    familyType: "",
    familyStatus: "",
    residenceType: "",
    numberOfBrothers: "",
    numberOfSisters: "",

    // --- Religious Info ---
    denomination: "",
    church: "",
    churchActivity: "",
    pastorsName: "",
    spirituality: "",
    religiousDetail: "",

    // --- Contact Info ---
    alternateMobile: "",
    landlineNumber: "",
    currentAddress: "",
    permanentAddress: "",
    contactPersonName: "",
    relationship: "",
    citizenOf: "",
    city: "",
    state: "",
    pincode: "",

    // --- Professional Info ---
    education: "",
    additionalEducation: "",
    college: "",
    educationDetail: "",
    employmentType: "",
    occupation: "",
    position: "",
    companyName: "",
    annualIncome: "",

    // --- Lifestyle ---
    exercise: "",
    hobbies: [],
    interests: "",
    music: "",
    favouriteReads: "",
    favouriteCuisines: "",
    sportsActivities: "",
    dressStyles: "",

    // --- Social Media ---
    whatsapp: "",
    facebook: "",
    instagram: "",
    x: "",
    youtube: "",
    linkedin: "",

    // --- Partner Preferences ---
    partnerAgeFrom: "",
    partnerAgeTo: "",
    partnerHeight: "",
    partnerMaritalStatus: "",
    partnerMotherTongue: "",
    partnerCaste: "",
    partnerPhysicalStatus: "",
    partnerEatingHabits: "",
    partnerDrinkingHabits: "",
    partnerSmokingHabits: "",
    partnerDenomination: "",
    partnerSpirituality: "",
    partnerEducation: "",
    partnerEmploymentType: "",
    partnerOccupation: "",
    partnerAnnualIncome: "",
    partnerCountry: "",
    partnerState: "",
    partnerDistrict: "",

    // --- Profile Visibility ---
    profileVisibility: "Public",
  });

  // --- Profile Images ---
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [deleteProfileImageFlag, setDeleteProfileImageFlag] = useState(false);
  const [additionalImageFiles, setAdditionalImageFiles] = useState([]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);
  const [existingAdditionalImages, setExistingAdditionalImages] = useState([]);
  const [deletedAdditionalImages, setDeletedAdditionalImages] = useState([]);

  // --- Location ---
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [selectedStateCode, setSelectedStateCode] = useState("");

  const allCountries = Country.getAllCountries();
  const countryOptions = allCountries.map((c) => c.name);

  const stateOptions = selectedCountryCode
    ? State.getStatesOfCountry(selectedCountryCode).map((s) => s.name)
    : [];

  const cityOptions =
    selectedCountryCode && selectedStateCode
      ? City.getCitiesOfState(selectedCountryCode, selectedStateCode).map(
          (c) => c.name
        )
      : [];

  const handleCountryChange = (e) => {
    const countryName = e.target.value;
    const country = allCountries.find((c) => c.name === countryName);
    setSelectedCountryCode(country?.isoCode || "");
    setSelectedStateCode("");
    setFormData((prev) => ({ ...prev, citizenOf: countryName, state: "", city: "" }));
  };

  const handleStateChange = (e) => {
    const stateName = e.target.value;
    const states = State.getStatesOfCountry(selectedCountryCode);
    const state = states.find((s) => s.name === stateName);
    setSelectedStateCode(state?.isoCode || "");
    setFormData((prev) => ({ ...prev, state: stateName, city: "" }));
  };

  const handleCityChange = (e) => {
    const cityName = e.target.value;
    if (!cityName) return setFormData((prev) => ({ ...prev, city: "" }));
    let foundCountryName = "";
    let foundStateName = "";
    let cityFound = false;

    for (const country of allCountries) {
      if (cityFound) break;
      const states = State.getStatesOfCountry(country.isoCode);
      for (const state of states) {
        if (cityFound) break;
        const cities = City.getCitiesOfState(country.isoCode, state.isoCode);
        const city = cities.find((c) => c.name.toLowerCase() === cityName.toLowerCase());
        if (city) {
          foundCountryName = country.name;
          foundStateName = state.name;
          cityFound = true;
          break;
        }
      }
    }

    setFormData((prev) => ({
      ...prev,
      city: cityName,
      state: foundStateName || prev.state,
      citizenOf: foundCountryName || prev.citizenOf,
    }));
  };

  // --- Fetch user data ---
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserById(id);
        if (response.status === 200) {
          const userData = response.data.data;

          const loadedData = {
            aboutMe: userData.aboutMe || "",
            gender: userData.gender || "",
            profileCreatedFor: userData.profileCreatedFor || "",
            name: userData.userName || "",
            email: userData.userEmail || "",
            phone: userData.userMobile || "",
            dateOfBirth: userData.dateOfBirth?.split("T")[0] || "",
            age: userData.age || "",
            bodyType: userData.bodyType || "",
            physicalStatus: userData.physicalStatus || "",
            complexion: userData.complexion || "",
            height: userData.height || "",
            weight: userData.weight || "",
            maritalStatus: userData.maritalStatus || "",
            marriedMonthYear: userData.marriedMonthYear || "",
            livingTogetherPeriod: userData.livingTogetherPeriod || "",
            divorcedMonthYear: userData.divorcedMonthYear || "",
            reasonForDivorce: userData.reasonForDivorce || "",
            childStatus: userData.childStatus || "",
            numberOfChildren: userData.numberOfChildren || "",
            eatingHabits: userData.eatingHabits || "",
            drinkingHabits: userData.drinkingHabits || "",
            smokingHabits: userData.smokingHabits || "",
            motherTongue: userData.motherTongue || "",
            caste: userData.caste || "",
            fathersName: userData.fathersName || "",
            mothersName: userData.mothersName || "",
            fathersOccupation: userData.fathersOccupation || "",
            fathersProfession: userData.fathersProfession || "",
            mothersOccupation: userData.mothersOccupation || "",
            fathersNative: userData.fathersNative || "",
            mothersNative: userData.mothersNative || "",
            familyValue: userData.familyValue || "",
            familyType: userData.familyType || "",
            familyStatus: userData.familyStatus || "",
            residenceType: userData.residenceType || "",
            numberOfBrothers: userData.numberOfBrothers || "",
            numberOfSisters: userData.numberOfSisters || "",
            denomination: userData.denomination || "",
            church: userData.church || "",
            churchActivity: userData.churchActivity || "",
            pastorsName: userData.pastorsName || "",
            spirituality: userData.spirituality || "",
            religiousDetail: userData.religiousDetail || "",
            alternateMobile: userData.alternateMobile || "",
            landlineNumber: userData.landlineNumber || "",
            currentAddress: userData.currentAddress || "",
            permanentAddress: userData.permanentAddress || "",
            contactPersonName: userData.contactPersonName || "",
            relationship: userData.relationship || "",
            citizenOf: userData.citizenOf || "",
            city: userData.city || "",
            state: userData.state || "",
            pincode: userData.pincode || "",
            education: userData.education || "",
            additionalEducation: userData.additionalEducation || "",
            college: userData.college || "",
            educationDetail: userData.educationDetail || "",
            employmentType: userData.employmentType || "",
            occupation: userData.occupation || "",
            position: userData.position || "",
            companyName: userData.companyName || "",
            annualIncome: userData.annualIncome || "",
            hobbies: Array.isArray(userData.hobbies) ? userData.hobbies : [],
            interests: userData.interests || "",
            music: userData.music || "",
            favouriteReads: userData.favouriteReads || "",
            favouriteCuisines: userData.favouriteCuisines || "",
            exercise: userData.exercise || "",
            sportsActivities: userData.sportsActivities || "",
            dressStyles: userData.dressStyles || "",
            whatsapp: userData.whatsapp || "",
            facebook: userData.facebook || "",
            instagram: userData.instagram || "",
            x: userData.x || "",
            youtube: userData.youtube || "",
            linkedin: userData.linkedin || "",
            partnerAgeFrom: userData.partnerAgeFrom || "",
            partnerAgeTo: userData.partnerAgeTo || "",
            partnerHeight: userData.partnerHeight || "",
            partnerMaritalStatus: userData.partnerMaritalStatus || "",
            partnerMotherTongue: userData.partnerMotherTongue || "",
            partnerCaste: userData.partnerCaste || "",
            partnerPhysicalStatus: userData.partnerPhysicalStatus || "",
            partnerEatingHabits: userData.partnerEatingHabits || "",
            partnerDrinkingHabits: userData.partnerDrinkingHabits || "",
            partnerSmokingHabits: userData.partnerSmokingHabits || "",
            partnerDenomination: userData.partnerDenomination || "",
            partnerSpirituality: userData.partnerSpirituality || "",
            partnerEducation: userData.partnerEducation || "",
            partnerEmploymentType: userData.partnerEmploymentType || "",
            partnerOccupation: userData.partnerOccupation || "",
            partnerAnnualIncome: userData.partnerAnnualIncome || "",
            partnerCountry: userData.partnerCountry || "",
            partnerState: userData.partnerState || "",
            partnerDistrict: userData.partnerDistrict || "",
            profileVisibility: userData.profileVisibility || "Public",
          };

          setFormData(loadedData);

          if (userData.profileImage) setProfileImagePreview(userData.profileImage);
          if (userData.additionalImages?.length > 0) {
            const images = userData.additionalImages.map((url) => ({
              url,
              isExisting: true,
            }));
            setAdditionalImagePreviews(images);
            setExistingAdditionalImages(userData.additionalImages);
          }
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleHobbiesChange = (selectedValues) => {
    setFormData((prev) => ({ ...prev, hobbies: selectedValues }));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfileImageFile(file);
    setProfileImagePreview(URL.createObjectURL(file));
    setDeleteProfileImageFlag(false);
  };

  const handleDeleteProfileImage = () => {
    setProfileImageFile(null);
    setProfileImagePreview(null);
    setDeleteProfileImageFlag(true);
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({ url: URL.createObjectURL(file), file }));
    setAdditionalImageFiles((prev) => [...prev, ...files]);
    setAdditionalImagePreviews((prev) => [...prev, ...previews]);
  };

  const removeAdditionalImage = (index) => {
    const removed = additionalImagePreviews[index];
    if (removed.isExisting) {
      setDeletedAdditionalImages((prev) => [...prev, removed.url]);
    }
    setAdditionalImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setAdditionalImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const payload = { ...formData };
    // handle profile image and additional images as FormData if needed

    try {
      const response = await updateUserById(id, payload);
      if (response.status === 200) {
        alert("User updated successfully");
        navigate("/admin/all-users");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update user");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <NewLayout>
      <div className="text-center p-5"><div className="spinner-border"></div></div>
    </NewLayout>
  );

  return (
    <NewLayout>
      <div className="container mt-4">
        <div className="card shadow-sm p-3">
          <h4 className="mb-4">Edit User</h4>

          {/* Profile & Album Images */}
          <BasicInfomation
            profileImagePreview={profileImagePreview}
            handleProfileImageChange={handleProfileImageChange}
            handleAdditionalImagesChange={handleAdditionalImagesChange}
            additionalImagePreviews={additionalImagePreviews}
            removeAdditionalImage={removeAdditionalImage}
            handleDeleteProfileImage={handleDeleteProfileImage}
          />

          <form onSubmit={handleSubmit}>
            {/* Example: Basic Details */}
            <div className="mb-3">
              <label>Name</label>
              <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label>Email</label>
              <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="mb-3">
              <label>Phone</label>
              <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label>Gender</label>
              <select className="form-control" name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Add all other inputs like maritalStatus, hobbies, address, family details, partner preferences etc. here similarly */}

            <div className="d-flex justify-content-between mt-4">
              <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={updating}>
                {updating ? "Updating..." : "Update User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </NewLayout>
  );
};

export default AdminEditUser;
