import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email, voucherCode } = await req.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS!,
      },
    });

    const info = await transporter.sendMail({
      from: `"Life4Cut 🎁" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎉 Voucher của bạn",
      html: `
        <div style="font-family:sans-serif">
          <h2>🎁 Voucher của bạn</h2>
          <h1 style="color:red">${voucherCode}</h1>
        </div>
      `,
    });
    console.log("MAIL INFO:", info);

    return Response.json({ ok: true });
  } catch (error) {
    console.error(error);
    return Response.json({ ok: false }, { status: 500 });
  }
}
