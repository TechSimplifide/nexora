import { isDisposableEmail } from "@visulima/disposable-email-domains";

export const isTemporaryEmail = (email) => {
  if (!email) {
    return false;
  }

  return isDisposableEmail(email.trim().toLowerCase());
};
