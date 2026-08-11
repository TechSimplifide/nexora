const welcomeEmailTemplate = ({ fullName }) => {
  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif; background:#f5f5f5; padding:40px;">
        <div style="max-width:600px; margin:auto; background:white; padding:30px; border-radius:10px;">

          <h2 style="color:#10B981;">
            Welcome to Nexora 🎉
          </h2>

          <p>Hi <strong>${fullName}</strong>,</p>

          <p>
            Your email has been verified successfully.
          </p>

          <p>
            You can now log in and start exploring projects,
            collaborate with your college, and submit proposals.
          </p>

          <p>
            We're excited to have you on board!
          </p>

        </div>
      </body>
    </html>
  `;
};

export default welcomeEmailTemplate;
