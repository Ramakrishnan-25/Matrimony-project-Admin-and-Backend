import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NewLayout from "./layout/NewLayout";
import { getUserById } from "../../api/service/adminServices";

export default function AdminViewNewUser() {
    const { id } = useParams();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profileCompletion, setProfileCompletion] = useState(0);

    // =========================
    // ✅ INFO ROW COMPONENT
    // =========================
    const InfoRow = ({ label, value }) => (
        <p>
            <strong>{label}:</strong> {value || "Not Provided"}
        </p>
    );

    // =========================
    // 🔥 FORMAT MOBILE NUMBER
    // =========================
    const formatMobile = (mobile) => {
        if (!mobile) return "Not Provided";
        return mobile.startsWith("+91") ? mobile : `+91-${mobile}`;
    };

    // =========================
    // 🔥 PROFILE COMPLETION
    // =========================
    const calculateProfileCompletion = (user) => {
        let totalFields = 0;
        let filledFields = 0;

        const skipFields = [
            "_id",
            "__v",
            "createdAt",
            "updatedAt",
            "paymentDetails",
            "profileViews",
            "additionalImages",
            "deletedAt",
            "isDeleted"
        ];

        Object.keys(user).forEach((key) => {
            if (skipFields.includes(key)) return;

            totalFields++;
            const value = user[key];

            if (Array.isArray(value)) {
                if (value.length > 0 && value.some((v) => v !== "")) {
                    filledFields++;
                }
            } else if (value !== null && value !== undefined && value !== "") {
                filledFields++;
            }
        });

        return totalFields > 0
            ? Math.round((filledFields / totalFields) * 100)
            : 0;
    };

    // =========================
    // 🔥 FETCH USER
    // =========================
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await getUserById(id);
                const userData = res?.data?.data;

                setUser(userData);

                const percentage = calculateProfileCompletion(userData);
                setProfileCompletion(percentage);
            } catch (error) {
                console.error("Error fetching user:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchUser();
    }, [id]);

    if (loading)
        return <p className="text-center mt-4">Loading...</p>;

    if (!user)
        return <p className="text-center mt-4">User not found</p>;
    // Add this inside your AdminViewNewUser component, above the return
    const calculateAge = (dob) => {
        if (!dob) return null;
        const birthDate = new Date(dob);
        const diff = Date.now() - birthDate.getTime();
        const ageDt = new Date(diff);
        return Math.abs(ageDt.getUTCFullYear() - 1970);
    };

    return (
        <NewLayout>
            {/* <div className="container mt-4 mb-5"> */}
            <div className="card shadow-lg p-4 border-0 rounded-4">

                {/* ================= PROFILE HEADER ================= */}
                <div className="text-center mb-4">
                    <img
                        src={user.profileImage || "/default-profile.png"}
                        alt="Profile"
                        style={{
                            width: "160px",
                            height: "160px",
                            objectFit: "cover",
                            borderRadius: "12px",
                            border: "3px solid #eee"
                        }}
                    />
                    <h4 className="mt-3">{user.userName}</h4>
                    <p className="text-green-600">{user.agwid}</p>
                    {/* PROFILE COMPLETION */}
                    <div className="mt-3">
                        <strong>{profileCompletion}% Profile Completed</strong>
                        <div className="progress mt-2" style={{ height: "8px" }}>
                            <div
                                className="progress-bar bg-success"
                                style={{ width: `${profileCompletion}%` }}
                            />
                        </div>
                    </div>
                </div>

                <hr />

                {/* ================= BASIC INFO ================= */}
                <h5 className="fw-bold mb-3">Basic Information</h5>
                <div className="row">
                    <div className="col-md-6">
                        <InfoRow label="Profile Created By" value={user.profileCreatedFor} />
                        <InfoRow label="Name" value={user.userName} />
                        <InfoRow label="Email" value={user.userEmail} />
                        <InfoRow label="Mobile" value={formatMobile(user.userMobile)} />
                        <InfoRow label="Gender" value={user.gender} />
                        <InfoRow
                            label="Age"
                            value={
                                user.dateOfBirth ? `${calculateAge(user.dateOfBirth)} years` : "Not Provided"
                            }
                        />
                        <InfoRow
                            label="Date of Birth"
                            value={
                                user.dateOfBirth
                                    ? new Date(user.dateOfBirth).toLocaleDateString()
                                    : "Not Provided"
                            }
                        />
                        <InfoRow label="Marital Status" value={user.maritalStatus} />
                    </div>



                    <div className="col-md-6">
                        <InfoRow label="Body Type" value={user.bodyType} />
                        <InfoRow label="Physical Status" value={user.physicalStatus} />
                        <InfoRow label="Complexion" value={user.complexion} />
                        <InfoRow label="Blood Group" value={user.bloodGroup} />
                        <InfoRow label="Mother Tongue" value={user.motherTongue} />
                        <InfoRow label="Country" value={user.country} />
                        <InfoRow label="State" value={user.state} />
                        <InfoRow label="City" value={user.city} />
                    </div>
                </div>
                <hr />

                <h5 className="fw-bold mb-3">Contact Information</h5>
<div className="row">
  <div className="col-md-6">
    <InfoRow label="Mobile Number" value={user.userMobile} />
    <InfoRow label="Alternate Mobile" value={user.alternateMobile} />
    <InfoRow label="Landline" value={user.landlineNumber} />
    <InfoRow label="Email" value={user.userEmail} />
    <InfoRow label="Current Address" value={user.currentAddress} />
    <InfoRow label="City" value={user.city} />
  </div>
  <div className="col-md-6">
    <InfoRow label="Permanent Address" value={user.permanentAddress} />
    <InfoRow label="State" value={user.state} />
    <InfoRow label="Pincode" value={user.pincode} />
    <InfoRow label="Citizen Of" value={user.citizenOf} />
    <InfoRow label="Contact Person" value={user.contactPersonName} />
    <InfoRow label="Relationship" value={user.relationship} />
  </div>
</div>

<hr />

                {/* ================= ABOUT ================= */}
                <h5 className="fw-bold mb-3">About Me</h5>
                <p>{user.aboutMe || "No description available"}</p>

                <hr />

                {/* ================= FAMILY ================= */}
                <h5 className="fw-bold mb-3">Family Details</h5>
                <div className="row">
                    <div className="col-md-6">
                        <InfoRow label="Father's Name" value={user.fathersName} />
                        <InfoRow label="Father's Occupation" value={user.fathersOccupation} />
                        <InfoRow label="Father's Profession" value={user.fathersProfession} />
                        <InfoRow label="Father's Native" value={user.fathersNative} />
                        <InfoRow label="No. of Brothers" value={user.numberOfBrothers} />
                         <InfoRow label="No. of Sisters" value={user.numberOfSisters} />
                        <InfoRow label="Family Type" value={user.familyType} />

                    </div>

                    <div className="col-md-6">
                        <InfoRow label="Residence Type" value={user.residenceType} />
                        <InfoRow label="Mother's Name" value={user.mothersName} />
                        <InfoRow label="Mother's Occupation" value={user.mothersOccupation} />
                        <InfoRow label="Mother's Native" value={user.mothersNative} />
                        <InfoRow label="Family Value" value={user.familyValue} />
                        <InfoRow label="Family Status" value={user.familyStatus} />
                       
                    </div>

                    <hr />

                    {/* ================= PROFESSIONAL INFORMATION ================= */}
                    <h5 className="fw-bold mb-3">Professional Information</h5>
                    <div className="row">
                        <div className="col-md-6">
                            <InfoRow label="Education" value={user.education} />
                            <InfoRow label="Additional Education" value={user.additionalEducation} />
                            <InfoRow label="College/Institution" value={user.college} />
                            <InfoRow label="Education in Detail" value={user.educationDetail} />
                            <InfoRow label="Employment Type" value={user.employmentType} />
                           
                        </div>
                        <div className="col-md-6">
                            <InfoRow label="Occupation" value={user.occupation} />
                            <InfoRow label="Position" value={user.position} />
                            <InfoRow label="Company Name" value={user.companyName} />
                            <InfoRow label="Annual Income" value={user.annualIncome} />
                             <InfoRow label="Religious Detail" value={user.religiousDetail} />
                        </div>
                    </div>
                    <hr />

                    {/* ================= RELIGIOUS ================= */}
                    <h5 className="fw-bold mb-3">Religious Information</h5>
                    <div className="row">
                        <div className="col-md-6">
                            <InfoRow label="Religion Detail" value={user.religiousDetail} />
                            <InfoRow label="Denomination" value={user.denomination} />
                            <InfoRow label="Caste" value={user.caste} />
                        </div>
                        <div className="col-md-6">
                            <InfoRow label="Church" value={user.church} />
                            <InfoRow label="Spirituality" value={user.spirituality} />
                            <InfoRow label="Pastor Name" value={user.pastorsName} />
                        </div>
                    </div>

                    <hr />

                    {/* ================= LIFESTYLE ================= */}
                    <h5 className="fw-bold mb-3">Lifestyle & Hobbies</h5>
                    <div className="row">
                        <div className="col-md-6">
                            <InfoRow label="Eating Habits" value={user.eatingHabits} />
                            <InfoRow label="Drinking" value={user.drinkingHabits} />
                            <InfoRow label="Smoking" value={user.smokingHabits} />
                        </div>
                        <div className="col-md-6">
                            <InfoRow label="Exercise" value={user.exercise} />
                            <InfoRow
                                label="Hobbies"
                                value={
                                    user.hobbies?.length > 0
                                        ? user.hobbies.join(", ")
                                        : "Not Provided"
                                }
                            />
                            <InfoRow label="Interests" value={user.interests} />
                        </div>
                    </div>

                    <hr />

                    {/* ================= PARTNER PREFERENCES ================= */}
                   <h5 className="fw-bold mb-3">Partner Preferences</h5>

{/* Basic & Religious */}
<div className="row mb-3">
  <div className="col-md-6">
    <InfoRow
      label="Age Range"
      value={
        user.partnerAgeFrom && user.partnerAgeTo
          ? `${user.partnerAgeFrom} - ${user.partnerAgeTo} Years`
          : "Not Provided"
      }
    />
    <InfoRow
      label="Height"
      value={user.partnerHeight ? `${user.partnerHeight} cm` : "Not Provided"}
    />
    <InfoRow label="Marital Status" value={user.partnerMaritalStatus} />
    <InfoRow label="Mother Tongue" value={user.partnerMotherTongue} />
    <InfoRow label="Caste" value={user.partnerCaste} />
  </div>
  <div className="col-md-6">
    <InfoRow label="Physical Status" value={user.partnerPhysicalStatus} />
    <InfoRow label="Eating Habits" value={user.partnerEatingHabits} />
    <InfoRow label="Drinking Habits" value={user.partnerDrinkingHabits} />
    <InfoRow label="Smoking Habits" value={user.partnerSmokingHabits} />
    <InfoRow label="Denomination" value={user.partnerDenomination} />
   
  </div>
</div>

{/* Professional & Location */}
<div className="row mb-3">
  <div className="col-md-6">
    
    <InfoRow label="Education" value={user.partnerEducation} />
    <InfoRow label="Employment Type" value={user.partnerEmploymentType} />
    <InfoRow label="Occupation" value={user.partnerOccupation} />
    <InfoRow label="Annual Income" value={user.partnerAnnualIncome} />
  </div>
  <div className="col-md-6">
    <InfoRow label="Country" value={user.partnerCountry} />
    <InfoRow label="State" value={user.partnerState} />
    <InfoRow label="District" value={user.partnerDistrict} />
     <InfoRow label="Spirituality" value={user.partnerSpirituality} />
  </div>
</div>

<hr />

                    {/* ================= SUBSCRIPTION ================= */}
                    <h5 className="fw-bold mb-3">Subscription Details</h5>

                    {user.paymentDetails?.length > 0 ? (
                        user.paymentDetails.map((plan) => (
                            <div
                                key={plan._id}
                                className="card p-3 mb-3 shadow-sm border-0 rounded-3"
                            >
                                <div className="row">
                                    <div className="col-md-6">
                                        <InfoRow label="Plan" value={plan.subscriptionType} />
                                        <p>
                                            <strong>Status:</strong>
                                            <span className="badge bg-success ms-2">
                                                {plan.subscriptionStatus}
                                            </span>
                                        </p>
                                        <InfoRow label="Amount" value={`₹${plan.subscriptionAmount}`} />
                                    </div>
                                    <div className="col-md-6">
                                        <InfoRow
                                            label="From"
                                            value={
                                                new Date(plan.subscriptionValidFrom).toLocaleDateString()
                                            }
                                        />
                                        <InfoRow
                                            label="To"
                                            value={
                                                new Date(plan.subscriptionValidTo).toLocaleDateString()
                                            }
                                        />
                                        <InfoRow
                                            label="Txn ID"
                                            value={plan.subscriptionTransactionId}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted">No subscription taken</p>
                    )}

                </div>
            </div>
        </NewLayout>
    );
}