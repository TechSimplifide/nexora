const verificationEmailTemplate = ({ fullName, verificationUrl }) => {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif; background:#f5f5f5; padding:40px;">
        <div style="max-width:600px; margin:auto; background:white; padding:30px; border-radius:10px;">
          
          <h2 style="color:#4F46E5;">
            Welcome to Nexora 🚀
          </h2>

          <p>Hi <strong>${fullName}</strong>,</p>

          <p>
            Thank you for registering with Nexora.
          </p>

          <p>
            Please verify your email address by clicking the button below.
          </p>

          <p style="text-align:center; margin:35px 0;">
            <a
              href="${verificationUrl}"
              style="
                background:#4F46E5;
                color:white;
                padding:14px 24px;
                text-decoration:none;
                border-radius:8px;
                display:inline-block;
              "
            >
              Verify Email
            </a>
          </p>

          <p>
            This verification link will expire in <strong>20 minutes</strong>.
          </p>

          <hr />

          <small>
            If you didn't create this account, you can safely ignore this email.
          </small>

        </div>
      </body>
    </html>
  `;
};

export default verificationEmailTemplate;
