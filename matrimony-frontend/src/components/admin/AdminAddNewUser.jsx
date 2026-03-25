import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NewLayout from "./layout/NewLayout";
import { Country, State, City } from "country-state-city";
import BasicInfomation from "./BasicInfomation";

const AdminAddNewUser = () => {
  const navigate = useNavigate();
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const [formData, setFormData] = useState({
    // --- Authentication ---
    userName: "",
    userEmail: "",
    userMobile: "",
    password: "",
    confirmPassword: "",

    // --- Basic Info ---
    aboutMe: "",
    gender: "",
    profileCreatedFor: "",
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
    religion: "",
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
  const [additionalImageFiles, setAdditionalImageFiles] = useState([]);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDeleteProfileImage = () => {
    setProfileImageFile(null);
    setProfileImagePreview(null);
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(file => ({ url: URL.createObjectURL(file), file }));
    setAdditionalImageFiles(prev => [...prev, ...files]);
    setAdditionalImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeAdditionalImage = (index) => {
    const removed = additionalImagePreviews[index];
    setAdditionalImagePreviews(prev => prev.filter((_, i) => i !== index));
    setAdditionalImageFiles(prev => prev.filter(f => f !== removed.file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userName || !formData.userEmail || !formData.password) {
        alert("Please fill in basic authentication details (Name, Email, Password)");
        setActiveTab("basic");
        return;
    }
    setUpdating(true);

    try {
      // API call to registration would go here
      // For now, logging the data
      console.log("Creating new user with data:", formData);
      alert("Registration logic would be triggered here.");
      navigate(-1);
    } catch (err) {
      console.error("Creation error:", err);
      alert("Failed to create user");
    } finally {
      setUpdating(false);
    }
  };

  const FormSection = ({ title, children, id }) => (
    <div className={`tab-pane fade ${activeTab === id ? "show active" : ""}`} id={id} role="tabpanel">
      <div className="card border-0 p-4">
        <h5 className="fw-bold mb-4 border-bottom pb-2">{title}</h5>
        <div className="row g-3">{children}</div>
      </div>
    </div>
  );

  const InputField = ({ label, name, type = "text", options = null, col = "6", required = false }) => (
    <div className={`col-md-${col}`}>
      <label className="form-label small fw-bold text-muted">{label} {required && <span className="text-danger">*</span>}</label>
      {options ? (
        <select className="form-select" name={name} value={formData[name] || ""} onChange={handleChange}>
          <option value="">Select {label}</option>
          {options.map((opt, i) => (
            <option key={i} value={opt}>{opt}</option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea className="form-control" name={name} value={formData[name] || ""} onChange={handleChange} rows="3" />
      ) : (
        <input type={type} className="form-control" name={name} value={formData[name] || ""} onChange={handleChange} required={required} />
      )}
    </div>
  );

  return (
    <NewLayout>
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card border-0 shadow-sm overflow-hidden">
            <div className="card-header bg-white p-4 border-0 d-flex justify-content-between align-items-center">
              <div>
                <h3 className="fw-bold mb-0 text-primary">Register New User</h3>
                <p className="text-muted small mb-0">Create a full user profile starting with basic information.</p>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-secondary btn-sm px-4 rounded-pill" onClick={() => navigate(-1)}>Cancel</button>
                <button className="btn btn-success btn-sm px-4 rounded-pill shadow-sm fw-bold" onClick={handleSubmit} disabled={updating}>
                  {updating ? "Saving..." : "Create User Profile"}
                </button>
              </div>
            </div>

            <div className="bg-light px-4 pt-4">
              <ul className="nav nav-tabs border-0" id="profileTabs" role="tablist">
                {[
                  { id: "basic", label: "Auth & Basic", icon: "fa-user-plus" },
                  { id: "gallery", label: "Gallery", icon: "fa-image" },
                  { id: "family", label: "Family", icon: "fa-users" },
                  { id: "religious", label: "Religious", icon: "fa-church" },
                  { id: "professional", label: "Education & Work", icon: "fa-briefcase" },
                  { id: "contact", label: "Contact", icon: "fa-phone" },
                  { id: "lifestyle", label: "Lifestyle", icon: "fa-heart" },
                  { id: "partner", label: "Partner Preferences", icon: "fa-handshake-o" }
                ].map((tab) => (
                  <li className="nav-item" key={tab.id}>
                    <button
                      className={`nav-link border-0 rounded-top-4 px-4 py-3 ${activeTab === tab.id ? "active bg-white fw-bold shadow-sm" : "text-muted"}`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <i className={`fa ${tab.icon} me-2`}></i>{tab.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="tab-content" id="profileTabsContent">
              {/* AUTH & BASIC INFO */}
              <FormSection title="Authentication & Basic Details" id="basic">
                <InputField label="Full Name" name="userName" required />
                <InputField label="Email Address" name="userEmail" type="email" required />
                <InputField label="Mobile Number" name="userMobile" required />
                <InputField label="Account Password" name="password" type="password" required />
                <InputField label="About Me" name="aboutMe" type="textarea" col="12" />
                <InputField label="Date of Birth" name="dateOfBirth" type="date" />
                <InputField label="Gender" name="gender" options={["Male", "Female", "Other"]} />
                <InputField label="Profile Created For" name="profileCreatedFor" options={["Self", "Son", "Daughter", "Brother", "Sister", "Friend"]} />
                <InputField label="Marital Status" name="maritalStatus" options={["Never Married", "Divorced", "Awaiting Divorce", "Widow/Widower"]} />
                <InputField label="Height" name="height" options={["4ft", "4ft 1in", "4ft 2in", "4ft 3in", "4ft 4in", "4ft 5in", "4ft 6in", "4ft 7in", "4ft 8in", "4ft 9in", "4ft 10in", "4ft 11in", "5ft", "5ft 1in", "5ft 2in", "5ft 3in", "5ft 4in", "5ft 5in", "5ft 6in", "5ft 7in", "5ft 8in", "5ft 9in", "5ft 10in", "5ft 11in", "6ft", "6ft 1in", "6ft 2in", "6ft 3in", "6ft 4in", "6ft 5in", "6ft 6in", "6ft 7in", "6ft 8in", "6ft 9in", "6ft 10in", "6ft 11in", "7ft"]} />
                <InputField label="Weight" name="weight" />
                <InputField label="Body Type" name="bodyType" options={["Average", "Slim", "Athletic", "Heavy"]} />
                <InputField label="Complexion" name="complexion" options={["Fair", "Very Fair", "Wheatish", "Dark"]} />
                <InputField label="Eating Habits" name="eatingHabits" options={["Vegetarian", "Non-Vegetarian", "Eggetarian"]} />
                <InputField label="Mother Tongue" name="motherTongue" />
                <InputField label="Caste" name="caste" />
              </FormSection>

              {/* GALLERY */}
              <div className={`tab-pane fade ${activeTab === "gallery" ? "show active" : ""}`} id="gallery">
                <div className="card border-0 p-4 text-center">
                    <p className="text-muted mb-4 small">Upload a profile picture and additional gallery images.</p>
                    <BasicInfomation
                        profileImagePreview={profileImagePreview}
                        handleProfileImageChange={handleProfileImageChange}
                        handleAdditionalImagesChange={handleAdditionalImagesChange}
                        additionalImagePreviews={additionalImagePreviews}
                        removeAdditionalImage={removeAdditionalImage}
                        handleDeleteProfileImage={handleDeleteProfileImage}
                    />
                </div>
              </div>

              {/* FAMILY */}
              <FormSection title="Family Background" id="family">
                <InputField label="Father's Name" name="fathersName" />
                <InputField label="Father's Occupation" name="fathersOccupation" />
                <InputField label="Mother's Name" name="mothersName" />
                <InputField label="Mother's Occupation" name="mothersOccupation" />
                <InputField label="Family Value" name="familyValue" options={["Traditional", "Moderate", "Liberal"]} />
                <InputField label="Family Type" name="familyType" options={["Joint", "Nuclear"]} />
                <InputField label="Family Status" name="familyStatus" options={["Middle Class", "Upper Middle Class", "Rich", "Affluent"]} />
                <InputField label="No. of Brothers" name="numberOfBrothers" type="number" />
                <InputField label="No. of Sisters" name="numberOfSisters" type="number" />
              </FormSection>

              {/* RELIGIOUS */}
              <FormSection title="Religious Information" id="religious">
                <InputField label="Religion" name="religion" />
                <InputField label="Denomination" name="denomination" />
                <InputField label="Church Name" name="church" />
                <InputField label="Pastors Name" name="pastorsName" />
                <InputField label="Religious Detail" name="religiousDetail" type="textarea" col="12" />
              </FormSection>

              {/* PROFESSIONAL */}
              <FormSection title="Education & Career" id="professional">
                <InputField label="Education" name="education" />
                <InputField label="College / University" name="college" />
                <InputField label="Employment Type" name="employmentType" options={["Government", "Private", "Business", "Self Employed", "Not Working"]} />
                <InputField label="Occupation" name="occupation" />
                <InputField label="Annual Income" name="annualIncome" />
                <InputField label="Company Name" name="companyName" />
              </FormSection>

              {/* CONTACT */}
              <FormSection title="Contact Details" id="contact">
                <InputField label="Current Address" name="currentAddress" type="textarea" col="12" />
                <InputField label="City" name="city" />
                <InputField label="State" name="state" />
                <InputField label="Pincode" name="pincode" />
                <InputField label="Citizen Of" name="citizenOf" />
                <InputField label="Alternate Mobile" name="alternateMobile" />
              </FormSection>

              {/* LIFESTYLE */}
              <FormSection title="Lifestyle & Interests" id="lifestyle">
                <InputField label="Hobbies" name="hobbies" />
                <InputField label="Smoking Habits" name="smokingHabits" options={["No", "Yes", "Occasionally"]} />
                <InputField label="Drinking Habits" name="drinkingHabits" options={["No", "Yes", "Occasionally"]} />
              </FormSection>

              {/* PARTNER PREFERENCES */}
              <FormSection title="Ideal Partner Preferences" id="partner">
                <InputField label="Age From" name="partnerAgeFrom" type="number" />
                <InputField label="Age To" name="partnerAgeTo" type="number" />
                <InputField label="Desired Height" name="partnerHeight" />
                <InputField label="Preferred Marital Status" name="partnerMaritalStatus" />
                <InputField label="Preferred Caste" name="partnerCaste" />
                <InputField label="Preferred City/State" name="partnerState" />
              </FormSection>
            </div>

            <div className="card-footer bg-white p-4 border-0 d-flex justify-content-end gap-3 mt-4">
                <button className="btn btn-light px-5 rounded-pill" onClick={() => navigate(-1)}>Discard</button>
                <button className="btn btn-success px-5 rounded-pill shadow-lg fw-bold" onClick={handleSubmit} disabled={updating}>
                    {updating ? "Creating..." : "Create User Profile"}
                </button>
            </div>
          </div>
        </div>
      </div>
    </NewLayout>
  );
};

export default AdminAddNewUser;
