import nodemailer from "nodemailer"

export const sendOtpMail = async (email, otp) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    })

    await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: email,
        subject: "Admin Login OTP",
        html: `
<div style="background:#0D1D2D;padding:40px 0;font-family:Arial,Helvetica,sans-serif">

    <div style="max-width:500px;margin:auto;background:#13283B;border-radius:10px;padding:30px;color:white;text-align:center">

        <h1 style="color:#00B0D3;margin-bottom:5px">
            Bone & Joint Hospital
        </h1>

        <p style="color:#a0c4d6;margin-bottom:25px">
            Secure Admin Login Verification
        </p>

        <h2 style="margin-bottom:10px">
            Your Login OTP
        </h2>

        <p style="color:#cde7f2;font-size:14px;margin-bottom:25px">
            Use the following One Time Password to securely login to your 
            <b>Admin Dashboard</b>.
        </p>

        <div style="
            background:#0D1D2D;
            border:2px dashed #00B0D3;
            padding:20px;
            border-radius:8px;
            margin-bottom:25px;
        ">
            <span style="
                font-size:32px;
                font-weight:bold;
                letter-spacing:6px;
                color:#00B0D3
            ">
                ${otp}
            </span>
        </div>

        <p style="color:#a0c4d6;font-size:14px;margin-bottom:20px">
            This OTP will expire in <b>5 minutes</b>.
        </p>

        <p style="color:#8fb7c9;font-size:13px">
            If you did not request this login, please ignore this email 
            or contact the system administrator immediately.
        </p>

        <hr style="border:none;border-top:1px solid #24465f;margin:25px 0">

        <p style="font-size:12px;color:#7fa4b6">
            © ${new Date().getFullYear()} Bone & Joint Hospital  
            <br>
            Secure Medical Administration System
        </p>

    </div>
</div>
`
    })
}