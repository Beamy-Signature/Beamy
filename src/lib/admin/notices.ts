export const ADMIN_NOTICES = {
  saved: "Saved. The website will show this shortly — refresh the public site if you do not see it yet.",
  removed: "Removed from the catalogue.",
  published: "This design is now live on the website.",
  unpublished: "This design is hidden from the public website.",
  featured: "This design will appear on the homepage.",
  unfeatured: "This design is no longer on the homepage.",
} as const;

export type AdminNoticeKey = keyof typeof ADMIN_NOTICES;

export function isAdminNotice(value: string | null): value is AdminNoticeKey {
  return Boolean(value && value in ADMIN_NOTICES);
}
