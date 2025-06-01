import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

const app = express();

// ✅ CORS: allow your frontend
app.use(cors({
  origin: "https://aitechspaces.co"
}));

app.use(express.json());

const transporter = nodemailer.createTransport({
  host: "smtp.secureserver.net",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post("/send", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: "New Message from Website Contact Form",
      text: message,
      replyTo: email
    });

    res.status(200).send("Message sent!");
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).send("Failed to send email.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
