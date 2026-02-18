// const express = require("express");
// const adminRoutes = express.Router();
// const adminController = require("../../controller/adminController/adminController");
// const planController = require("../../controller/adminController/planController")
// const eventController = require("../../controller/adminController/eventController");
// const upload = require("../../middleware/multer");


// adminRoutes.get("/", adminController.registerAdmin);
// adminRoutes.get("/get-all-users", adminController.getAllUsersData);
// adminRoutes.get("/get-all-new-requested-users", adminController.getAllNewRequestedUsersData);
// adminRoutes.get("/paid-users-data", adminController.getPaidUsersData);
// adminRoutes.get("/get-all-plan-data", planController.getAllPlanData);
// adminRoutes.delete("/delete-user/:id", adminController.deleteUser);
// adminRoutes.get("/get-user/:id", adminController.getUserById);
// adminRoutes.put("/update-user/:id", adminController.updateUser);






// adminRoutes.post("/verify-admin", adminController.verifyAdmin);
// adminRoutes.post("/add-new-plan-data", planController.addNewPlanData);



// adminRoutes.put("/approve-new-user/:userId", adminController.approveNewUser);
// adminRoutes.put("/edit-plan-data/:planId", planController.editPlanData);
// adminRoutes.put("/edit-plan-status/:planId", planController.editPlanStatus);

// adminRoutes.get("/get-all-events", eventController.getAllEvents);
// adminRoutes.post("/add-new-event", upload.single("image"), eventController.addNewEvent);
// adminRoutes.put("/edit-event/:id", upload.single("image"), eventController.editEvent);
// adminRoutes.delete("/delete-event/:id", eventController.deleteEvent);







// module.exports = adminRoutes;

const express = require("express");
const adminRoutes = express.Router();

const adminController = require("../../controller/adminController/adminController");
const planController = require("../../controller/adminController/planController");
const eventController = require("../../controller/adminController/eventController");

const upload = require("../../middleware/multer");

/* =========================
   ADMIN AUTH
========================== */
adminRoutes.get("/", adminController.registerAdmin);
adminRoutes.post("/verify-admin", adminController.verifyAdmin);

/* =========================
   USER MANAGEMENT
========================== */
adminRoutes.get("/get-all-users", adminController.getAllUsersData);
adminRoutes.get("/get-user/:id", adminController.getUserById);
adminRoutes.put("/update-user/:id", adminController.updateUser);

adminRoutes.get(
  "/get-all-new-requested-users",
  adminController.getAllNewRequestedUsersData
);
adminRoutes.put(
  "/approve-new-user/:userId",
  adminController.approveNewUser
);

adminRoutes.get("/paid-users-data", adminController.getPaidUsersData);

// ✅ Soft Delete
adminRoutes.delete("/delete-user/:id", adminController.deleteUser);

// 🔥 OPTIONAL – Restore User (Recommended)
adminRoutes.put("/restore-user/:id", adminController.restoreUser);

adminRoutes.get("/deleted-users", adminController.getDeletedUsers);



/* =========================
   PLAN MANAGEMENT
========================== */
adminRoutes.get("/get-all-plan-data", planController.getAllPlanData);
adminRoutes.post("/add-new-plan-data", planController.addNewPlanData);
adminRoutes.put("/edit-plan-data/:planId", planController.editPlanData);
adminRoutes.put("/edit-plan-status/:planId", planController.editPlanStatus);

/* =========================
   EVENT MANAGEMENT
========================== */
adminRoutes.get("/get-all-events", eventController.getAllEvents);
adminRoutes.post(
  "/add-new-event",
  upload.single("image"),
  eventController.addNewEvent
);
adminRoutes.put(
  "/edit-event/:id",
  upload.single("image"),
  eventController.editEvent
);
adminRoutes.delete("/delete-event/:id", eventController.deleteEvent);

module.exports = adminRoutes;
