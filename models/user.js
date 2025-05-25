import { composeWithMongoose } from "graphql-compose-mongoose";
import { Schema, model } from "mongoose";

const LinkSchema = new Schema(
  {
    siteName: String,
    siteLink: String,
  },
  { timestamps: true }
);
const UserSchema = new Schema({
  links: [LinkSchema],
  name: String,
  email: String,
  emailVerified: Date,
  profileURL: String,
  themeColor: String,
  isPublic: { type: Boolean, default: true },
  bio: String,
});

const User = model("User", UserSchema, "users");

const UserTC = composeWithMongoose(User);

export { User, UserTC };
