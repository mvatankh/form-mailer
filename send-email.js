// send-email.js
import express from "express";
import bodyParser from "body-parser";
import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(bodyParser.json());

// Set up Resend
const resend = new Resend(process.env.RESEND_API_KEY);

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

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
