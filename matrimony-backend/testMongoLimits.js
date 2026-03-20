const dbConnect = require("./config/database/dbConnect");
const userModel = require('./model/user/userModel');
const mongoose = require('mongoose');

async function test() {
  await dbConnect();
  try {
     const user = await userModel.findOne({ "paymentDetails.subscriptionStatus": "Active" });
     if (!user) {
        console.log("No paid user found.");
        return;
     }
     
     const actualPlan = user.paymentDetails.find(p => p.subscriptionStatus === 'Active');
     
     console.log("Before update: ", actualPlan.profilesViewedCount);
     
     const updateResult = await userModel.updateOne(
       { _id: user._id, "paymentDetails._id": actualPlan._id },
       {
         $inc: {
           "paymentDetails.$.profilesViewedCount": 1,
           "paymentDetails.$.dailyViewedCount": 1
         }
       }
     );
     
     console.log("Update result: ", updateResult);
     
     const updatedUser = await userModel.findOne({ _id: user._id });
     const updatedPlan = updatedUser.paymentDetails.find(p => p.subscriptionStatus === 'Active');
     console.log("After update: ", updatedPlan.profilesViewedCount);
     
  } catch(err) {
     console.error(err);
  } finally {
     process.exit();
  }
}
test();
