// send-email.js

import express from "express";
import bodyParser from "body-parser";
import { Resend } from "resend";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
const resend = new Resend(process.env.RESEND_API_KEY);

const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: "https://aitechspaces.co"  // ✅ your frontend domain
}));

// Set up Resend
/*
app.post("/send", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const data = await resend.emails.send({
      from: "AITech Contact Form <info@aitechspaces.co>", // must be a verified domain or sender (see Step 2 below)
      to: "info@aitechspaces.co",                    // where you want to receive form submissions
      reply_to: email,  
      subject: `New message from ${name}`,
      html: `<p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br>${message}</p>`,
    });

    res.status(200).send({ success: true, data });
  } catch (err) {
    console.error("Resend error:", err);
    res.status(500).send("Email failed");
  }
});
*/


app.post("/contact", async (req, res) => {
  const { firstName, lastName, email, company, jobTitle, country, request, newsletter } = req.body;
  
  const fullName = `${firstName} ${lastName}`;
  const messageContent = `
    <h3>New Contact Form Submission</h3>
    <p><strong>Name:</strong> ${fullName}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Company:</strong> ${company}</p>
    <p><strong>Job Title:</strong> ${jobTitle || 'Not provided'}</p>
    <p><strong>Country:</strong> ${country || 'Not provided'}</p>
    <p><strong>Newsletter:</strong> ${newsletter}</p>
    <p><strong>Message:</strong><br>${request}</p>
  `;

  try {
    const data = await resend.emails.send({
      from: "AITech Contact Form <info@aitechspaces.co>",
      to: "info@aitechspaces.co",
      reply_to: email,
      subject: `New contact from ${fullName} - ${company}`,
      html: messageContent,
    });

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Resend error:", err);
    res.status(500).json({ success: false, error: "Email failed" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

