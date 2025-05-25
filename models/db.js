const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://faith:feifei@cluster0.qx0uy.mongodb.net/wanlinq"
);
mongoose.connection.on("connected", function () {
  console.log("Application is connected to the database");
});