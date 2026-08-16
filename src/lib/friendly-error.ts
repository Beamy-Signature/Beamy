export function friendlyAuthError(message?: string) {
  const text = (message ?? "").toLowerCase();
  if (text.includes("invalid") || text.includes("credential") || text.includes("password")) {
    return "That email or password doesn’t look quite right. Please try again.";
  }
  if (text.includes("confirm")) {
    return "This account still needs to be confirmed. Please check with the person who set up the catalogue.";
  }
  if (text.includes("rate") || text.includes("too many")) {
    return "A few too many attempts just now. Please wait a moment, then try again.";
  }
  return "We couldn’t sign you in just now. Please try again in a moment.";
}

export function friendlySaveError(message?: string) {
  const text = (message ?? "").toLowerCase();
  if (text.includes("men and women")) {
    return "Men and Women stay in the catalogue so the website always has a home for those pieces. You can hide or rename them instead.";
  }
  if (text.includes("duplicate") || text.includes("unique") || text.includes("already exists")) {
    return "Something with that name is already in the catalogue. Please choose a slightly different name and try again.";
  }
  if (text.includes("network") || text.includes("fetch")) {
    return "The connection dropped for a moment. Please try again.";
  }
  return "We couldn’t save that just now. Please try again in a moment — nothing else has been lost.";
}

export function friendlyUploadError(message?: string) {
  const text = (message ?? "").toLowerCase();
  if (text.includes("choose a photo")) {
    return "Please choose a photo to add.";
  }
  if (text.includes("jpg") || text.includes("png") || text.includes("webp") || text.includes("type")) {
    return "Please use a JPG, PNG or WEBP photo.";
  }
  if (text.includes("8mb") || text.includes("size") || text.includes("too large")) {
    return "That photo is a little large. Please keep it under 8MB.";
  }
  if (text.includes("sign in")) {
    return "Please sign in again, then add the photo.";
  }
  return "We couldn’t add that photo just now. Please try another picture, or try again in a moment.";
}
