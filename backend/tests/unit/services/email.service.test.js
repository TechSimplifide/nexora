import { jest } from "@jest/globals";

const mockSendTransacEmail = jest.fn();

jest.unstable_mockModule("@getbrevo/brevo", () => ({
  BrevoClient: jest.fn(() => ({
    transactionalEmails: {
      sendTransacEmail: mockSendTransacEmail,
    },
  })),
}));

jest.unstable_mockModule(
  "../../../src/templates/verification-email.template.js",
  () => ({
    default: jest.fn(),
  }),
);

jest.unstable_mockModule(
  "../../../src/templates/welcome-email.template.js",
  () => ({
    default: jest.fn(),
  }),
);

const { sendVerificationEmail, sendWelcomeEmail } =
  await import("../../../src/services/email.service.js");

const { default: verificationEmailTemplate } =
  await import("../../../src/templates/verification-email.template.js");

const { default: welcomeEmailTemplate } =
  await import("../../../src/templates/welcome-email.template.js");

describe("Email Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    process.env.BREVO_API_KEY = "test-brevo-api-key";
    process.env.BREVO_SENDER_EMAIL = "noreply.nexora@protonmail.com";
    process.env.BREVO_SENDER_NAME = "Nexora";

    verificationEmailTemplate.mockReturnValue(
      "<html>Verification email</html>",
    );

    welcomeEmailTemplate.mockReturnValue("<html>Welcome to Nexora</html>");

    mockSendTransacEmail.mockResolvedValue({
      messageId: "email123",
    });
  });

  describe("sendVerificationEmail", () => {
    test("should send verification email successfully", async () => {
      await sendVerificationEmail({
        to: "student@example.com",
        fullName: "John Doe",
        verificationUrl: "http://localhost:5173/verify-email/token123",
      });

      expect(verificationEmailTemplate).toHaveBeenCalledWith({
        fullName: "John Doe",
        verificationUrl: "http://localhost:5173/verify-email/token123",
      });

      expect(mockSendTransacEmail).toHaveBeenCalledWith({
        sender: {
          name: "Nexora",
          email: "noreply.nexora@protonmail.com",
        },
        to: [
          {
            email: "student@example.com",
          },
        ],
        subject: "Verify your Nexora account",
        htmlContent: "<html>Verification email</html>",
      });
    });

    test("should throw error if sending verification email fails", async () => {
      const error = new Error("Brevo API failed");

      mockSendTransacEmail.mockRejectedValue(error);

      await expect(
        sendVerificationEmail({
          to: "student@example.com",
          fullName: "John Doe",
          verificationUrl: "http://localhost:5173/verify-email/token123",
        }),
      ).rejects.toThrow("Brevo API failed");

      expect(mockSendTransacEmail).toHaveBeenCalledTimes(1);
    });
  });

  describe("sendWelcomeEmail", () => {
    test("should send welcome email successfully", async () => {
      await sendWelcomeEmail({
        to: "admin@example.com",
        fullName: "John Doe",
      });

      expect(welcomeEmailTemplate).toHaveBeenCalledWith({
        fullName: "John Doe",
      });

      expect(mockSendTransacEmail).toHaveBeenCalledWith({
        sender: {
          name: "Nexora",
          email: "noreply.nexora@protonmail.com",
        },
        to: [
          {
            email: "admin@example.com",
          },
        ],
        subject: "Welcome to Nexora 🎉",
        htmlContent: "<html>Welcome to Nexora</html>",
      });
    });

    test("should throw error if sending welcome email fails", async () => {
      const error = new Error("Brevo API failed");

      mockSendTransacEmail.mockRejectedValue(error);

      await expect(
        sendWelcomeEmail({
          to: "admin@example.com",
          fullName: "John Doe",
        }),
      ).rejects.toThrow("Brevo API failed");

      expect(mockSendTransacEmail).toHaveBeenCalledTimes(1);
    });
  });
});
