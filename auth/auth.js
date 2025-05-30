/* eslint-disable no-undef */
import { ExpressAuth } from "@auth/express";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { MongoClient } from "mongodb";
import { Resend } from "resend";

import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.AUTH_RESEND_KEY);
const client = new MongoClient(process.env.MONGOOSE_CONNECT_STRING);

const authConfig = {
  adapter: MongoDBAdapter(client),
  providers: [
    {
      id: "resend",
      type: "email",
      name: "Email",
      async sendVerificationRequest({ identifier: email, url }) {
        const updatedUrl = new URL(url);
        updatedUrl.searchParams.set("callbackUrl", "http://localhost:5173");

        await resend.emails.send({
          from: "Wanlinq@login.gaiciumiafaith.com",
          to: [email],
          subject: "Your Magic Link for WanLinq",
          html: `<p>Click <a href="${updatedUrl.href}">here</a> to log in.</p>`,
        });
      },
    },
  ],
  secret: process.env.AUTH_SECRET,
  basePath: "/auth",
  callbacks: {
    async redirect({ url }) {
      const frontend = "http://localhost:5173/";
      if (url.startsWith(frontend)) return url;
      return frontend;
    },
  },
};

const auth = ExpressAuth(authConfig);

export default auth;
export { authConfig };
