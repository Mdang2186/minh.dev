import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, subject, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Configure Nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "jejangwangminh@gmail.com",
                pass: "ppdo vxpv waik cdsk",
            },
        });

        // Setup email data
        const mailOptions = {
            from: `"Portfolio Contact Form" <jejangwangminh@gmail.com>`,
            to: "jejangwangminh@gmail.com", // Sending to yourself
            replyTo: email,
            subject: `[Portfolio Contact] ${subject || "New Message"} from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                    <h2>New Message from Portfolio Contact Form</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <hr />
                    <h3>Message:</h3>
                    <p style="white-space: pre-wrap;">${message}</p>
                </div>
            `,
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: "Email sent successfully" });
    } catch (error) {
        console.error("Failed to send email:", error);
        return NextResponse.json(
            { success: false, error: "Failed to send email" },
            { status: 500 }
        );
    }
}
