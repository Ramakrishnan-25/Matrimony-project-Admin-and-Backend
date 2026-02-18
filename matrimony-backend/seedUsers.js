const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const UserModel = require("./model/user/userModel");

// Load env vars
dotenv.config();

// Connect to DB
const connectDB = async () => {
    try {
        const mongoURI = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.69vdrs0.mongodb.net/${process.env.MONGO_DATABASE_NAME}`;
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB for seeding...");
    } catch (err) {
        console.error("DB Connection Failed:", err);
        process.exit(1);
    }
};

// --- DATA SETS (CHRISTIAN MATRIMONY SPECIFIC) ---

// High Quality Indian-looking Images (Verified/Updated)
const INDIAN_MALE_IMAGES = [
    "https://images.unsplash.com/photo-1566492031773-4fbc71dfdb7d?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
];

const INDIAN_FEMALE_IMAGES = [
    "https://images.unsplash.com/photo-1628157588553-5eeea00af15c?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1597223557154-721c35cc3ca8?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1610415664157-12324dc865cf?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=600&q=80"
];

// Christian Names
const MALE_NAMES = ["Alvin", "Bevin", "Cyril", "David", "Emmanuel", "Felix", "George", "Habel", "Ivan", "Jacob", "Kevin", "Leo", "Mathew", "Naveen", "Oommen", "Paul", "Rohan", "Sam", "Thomas", "Victor"];
const FEMALE_NAMES = ["Angela", "Bincy", "Catherine", "Diana", "Elsa", "Fiona", "Gloria", "Helen", "Irene", "Julia", "Kate", "Lia", "Maria", "Nancy", "Olivia", "Pearl", "Riya", "Sarah", "Tessa", "Veronica"];
const SURNAMES = ["Mathew", "Thomas", "Varghese", "Joseph", "George", "Abraham", "Kurian", "Philip", "Chacko", "Daniel", "Samuel", "Jacob", "Zachariah"];

const CITIES = ["Kochi", "Trivandrum", "Bangalore", "Chennai", "Mumbai", "Thrissur", "Kottayam", "Alappuzha", "Pala", "Tiruvalla"];

// Strictly Christian Denominations
const DENOMINATIONS = [
    "Roman Catholic",
    "Latin Catholic",
    "Syro Malabar",
    "Jacobite",
    "Orthodox",
    "Marthoma",
    "Pentecostal",
    "CSI (Church of South India)",
    "Syro Malankara",
    "Knanaya Catholic",
    "Knanaya Jacobite"
];

const PROFESSIONS = ["Software Engineer", "Doctor", "Nurse", "Teacher", "Business Analyst", "Chartered Accountant", "Architect", "Civil Engineer", "Bank Manager", "Professor"];
const EDUCATIONS = ["B.Tech", "M.Tech", "MBBS", "B.Sc Nursing", "M.Sc", "B.Com", "MBA", "BBA", "MD", "PhD"];

// --- HELPERS ---

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const generateAgwid = () => "AGW" + Math.floor(100000 + Math.random() * 900000);

const getImage = (gender, index) => {
    const images = gender === "Male" ? INDIAN_MALE_IMAGES : INDIAN_FEMALE_IMAGES;
    return images[index % images.length];
};

const getAdditionalImages = (gender, index) => {
    const images = gender === "Male" ? INDIAN_MALE_IMAGES : INDIAN_FEMALE_IMAGES;
    return [
        images[(index + 3) % images.length],
        images[(index + 7) % images.length]
    ];
};

const generateUser = (gender, index) => {
    const isMale = gender === "Male";

    // Personal
    const firstName = getRandom(isMale ? MALE_NAMES : FEMALE_NAMES);
    const lastName = getRandom(SURNAMES);
    const userName = `${firstName} ${lastName}`; // Full Name
    // Ensure unique emails by appending index
    const userEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@test.com`;
    // Ensure unique mobiles
    const userMobile = `98${Math.floor(10000000 + Math.random() * 90000000)}`;

    // Details
    const age = isMale ? getRandomInt(26, 35) : getRandomInt(22, 30);
    const dobHooks = new Date();
    dobHooks.setFullYear(dobHooks.getFullYear() - age);

    const denomination = getRandom(DENOMINATIONS);

    const height = isMale ? `${getRandomInt(5, 6)}'${getRandomInt(0, 11)}"` : `${getRandomInt(4, 5)}'${getRandomInt(0, 11)}"`;

    // Partner Preferences
    const pAgeFrom = isMale ? (age - 5) : (age + 1);
    const pAgeTo = isMale ? age : (age + 6);

    // Images
    const profileImage = getImage(gender, index);
    const additionalImages = getAdditionalImages(gender, index);

    return {
        userName,
        userEmail,
        userMobile,
        userPassword: "password123",
        agwid: generateAgwid(),
        isTermsAggreed: true,
        isEmailVerified: true,
        isApproved: true,
        isProfileCompleted: true,
        profileStatus: "Active",
        profileVisibility: "Public",

        // Personal
        profileCreatedFor: "Self",
        gender,
        dateOfBirth: dobHooks,
        age,
        bodyType: getRandom(["Slim", "Average", "Athletic"]),
        physicalStatus: "Normal",
        complexion: getRandom(["Fair", "Wheatish"]),
        height,
        weight: `${getRandomInt(50, 90)} kg`,
        maritalStatus: "Never Married",

        // Family Details
        fathersName: getRandom(MALE_NAMES) + " " + lastName,
        mothersName: getRandom(FEMALE_NAMES) + " " + getRandom(SURNAMES),
        fathersOccupation: getRandom(PROFESSIONS),
        fathersProfession: "Professional",
        mothersOccupation: "Homemaker",
        fathersNative: getRandom(CITIES),
        mothersNative: getRandom(CITIES),
        familyValue: getRandom(["Orthodox", "Traditional"]),
        familyType: "Nuclear Family",
        familyStatus: "Middle Class",
        residenceType: "Own House",
        numberOfBrothers: String(getRandomInt(0, 2)),
        numberOfSisters: String(getRandomInt(0, 2)),

        // Family & Religion (Christian Specific)
        religion: "Christian",
        caste: denomination,
        denomination: denomination,
        motherTongue: "Malayalam",

        // Church Details (Randomized for realism)
        church: `St. ${getRandom(["Mary's", "George's", "Thomas", "Joseph's", "Jude's"])} Church`,
        churchActivity: getRandom(["Active", "Not Active"]),
        spirituality: getRandom(["Religious", "Spiritual", "Moderate"]),

        // Lifestyle
        eatingHabits: getRandom(["Non-Vegetarian"]),
        drinkingHabits: "No",
        smokingHabits: "No",

        // New Fields 
        aboutMe: `I am a ${age} year old ${denomination} professional from Kerala.`,
        exercise: getRandom(["Regular", "Occasional"]),

        // Detailed Lifestyle
        hobbies: [getRandom(["Reading", "Traveling", "Music"]), getRandom(["Cooking", "Photography", "Gardening"])],
        interests: getRandom(["Technology", "Art", "Movies", "Sports"]),
        music: getRandom(["Classical", "Melody", "Christian Devotional", "Pop"]),
        favouriteReads: getRandom(["Fiction", "Biographies", "History"]),
        favouriteCuisines: getRandom(["South Indian", "North Indian", "Chinese", "Continental"]),
        sportsActivities: getRandom(["Badminton", "Cricket", "Yoga", "Swimming"]),
        dressStyles: getRandom(["Casual", "Formal", "Traditional"]),

        // Location
        city: getRandom(CITIES),
        state: "Kerala",
        country: "India",
        citizenOf: "India",

        // Education & Job
        education: getRandom(EDUCATIONS),
        occupation: getRandom(PROFESSIONS),
        annualIncome: `${getRandomInt(6, 30)} LPA`,
        employmentType: "Private Sector",

        // Preferences
        partnerAgeFrom: String(Math.abs(pAgeFrom)),
        partnerAgeTo: String(Math.abs(pAgeTo)),
        partnerHeight: "Any",
        partnerMaritalStatus: "Never Married",
        partnerMotherTongue: "Malayalam",
        partnerCaste: denomination,
        partnerDenomination: denomination,
        partnerPhysicalStatus: "Normal",
        partnerEatingHabits: "Any",
        partnerEducation: "Any",
        partnerLocation: "Any",

        // Media
        profileImage,
        additionalImages
    };
};

const seed = async () => {
    await connectDB();

    try {
        // CLEANUP
        console.log("Cleaning up old test users...");
        await UserModel.deleteMany({ userEmail: { $regex: /@test.com$/ } });
        console.log("Old test users deleted.");

        const hashedPassword = await bcrypt.hash("password123", 10);
        const users = [];

        // Generate 10 Males
        console.log("Generating 10 Christian Male Profiles...");
        for (let i = 0; i < 10; i++) {
            const u = generateUser("Male", i + 100);
            u.userPassword = hashedPassword;
            users.push(u);
        }

        // Generate 10 Females
        console.log("Generating 10 Christian Female Profiles...");
        for (let i = 0; i < 10; i++) {
            const u = generateUser("Female", i + 200);
            u.userPassword = hashedPassword;
            users.push(u);
        }

        // Insert
        await UserModel.insertMany(users);
        console.log("Successfully seeded 20 Christian profiles with verified images!");

    } catch (error) {
        console.error("Seeding error:", error);
    } finally {
        mongoose.connection.close();
    }
};

seed();
