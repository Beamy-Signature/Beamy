export function friendlyAuthError(message?: string) {
  const text = (message ?? "").toLowerCase();
  if (text.includes("at least 8") || text.includes("8 character")) {
    return "Please choose a password of at least 8 characters.";
  }
  if (text.includes("do not match") || text.includes("doesn't match") || text.includes("not match")) {
    return "Those passwords do not match. Please try again.";
  }
  if (
    text.includes("already registered") ||
    text.includes("already been registered") ||
    text.includes("user already") ||
    text.includes("already exists")
  ) {
    return "An account with this email already exists. Please sign in, or use Forgot password.";
  }
  if (text.includes("confirm")) {
    return "Please check your email to confirm this account, then sign in.";
  }
  if (text.includes("invalid") || text.includes("credential") || text.includes("password")) {
    return "That email or password doesn’t look quite right. Please try again.";
  }
  if (text.includes("rate") || text.includes("too many")) {
    return "A few too many attempts just now. Please wait a moment, then try again.";
  }
  if (text.includes("sign-in link") || text.includes("no longer valid")) {
    return "This sign-in link is no longer valid. Please try again.";
  }
  return "We couldn’t complete that just now. Please try again in a moment.";
}

export function friendlySaveError(message?: string) {
  const text = (message ?? "").toLowerCase();
  if (text.includes("men and women")) {
    return "Men and Women stay in the catalogue so the website always has a home for those pieces. You can hide them, but their web addresses cannot change.";
  }
  if (text.includes("duplicate") || text.includes("unique") || text.includes("already exists")) {
    return "Something with that name is already in the catalogue. Please choose a slightly different name and try again.";
  }
  if (text.includes("network") || text.includes("fetch")) {
    return "The connection dropped for a moment. Please try again.";
  }
  if (text.includes("json") || text.includes("unexpected token") || text.includes("not valid")) {
    return "That did not go through cleanly. Please try again in a moment — nothing else has been lost.";
  }
  return "We couldn’t save that just now. Please try again in a moment — nothing else has been lost.";
}

export function friendlyUploadError(message?: string) {
  const text = (message ?? "").toLowerCase();
  if (
    text.includes("request entity") ||
    text.includes("too large") ||
    text.includes("payload") ||
    text.includes("413") ||
    text.includes("10mb") ||
    text.includes("8mb") ||
    text.includes("file size") ||
    text.includes("maximum size") ||
    text.includes("exceed")
  ) {
    return "That photo is a little large. Please keep it under 10MB.";
  }
  if (text.includes("choose a photo") || text.includes("select a file") || text.includes("empty")) {
    return "Please choose a photo to add.";
  }
  if (
    text.includes("not an image") ||
    text.includes("image type") ||
    text.includes("mime") ||
    text.includes("content type") ||
    text.includes("unsupported") ||
    text.includes("invalid type")
  ) {
    return "Please choose a photo. Any image from your phone or computer will do.";
  }
  if (text.includes("jpg") || text.includes("png") || text.includes("webp") || text.includes("type")) {
    return "Please choose a photo. Any image from your phone or computer will do.";
  }
  if (text.includes("sign in") || text.includes("not authenticated") || text.includes("jwt") || text.includes("unauthorized")) {
    return "Please sign in again, then add the photo.";
  }
  if (text.includes("bucket")) {
    return "That photograph could not be stored just now. Please try again in a moment.";
  }
  if (text.includes("row-level") || text.includes("policy") || text.includes("permission") || text.includes("not allowed")) {
    return "This account cannot add photos just now. Please sign in again, or ask for catalogue access.";
  }
  if (text.includes("network") || text.includes("fetch") || text.includes("failed to fetch")) {
    return "The connection dropped for a moment. Please try the photo again.";
  }
  if (text.includes("json") || text.includes("unexpected token") || text.includes("not valid json") || text.includes("<!doctype") || text.includes("<html")) {
    return "That photo did not go through. Please keep it under 10MB and try again.";
  }
  return "We couldn’t add that photo just now. Please try another picture, or try again in a moment.";
}
