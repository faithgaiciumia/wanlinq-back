import mongoose from "mongoose";
mongoose.connect(process.env.MONGOOSE_CONNECT_STRING);
mongoose.connection.on("connected", function () {
  console.log("Application is connected to the database");
});
