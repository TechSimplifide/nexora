import { ALLOWED_PUBLIC_EMAIL_DOMAINS } from "../constants/email-domains.js";

export const isAllowedPublicEmail = (email) => {
  if (!email) {
    return false;
  }

  const domain = email.trim().toLowerCase().split("@").pop();

  return ALLOWED_PUBLIC_EMAIL_DOMAINS.includes(domain);
};
