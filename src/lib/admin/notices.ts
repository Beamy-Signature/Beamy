export const ADMIN_NOTICES = {
  saved: {
    title: "Saved",
    message: "That change is in the catalogue. Refresh the website if you do not see it yet.",
  },
  removed: {
    title: "Removed",
    message: "This has left the catalogue.",
  },
  published: {
    title: "Now on the website",
    message: "This design is live. Visitors can see it on the website.",
  },
  unpublished: {
    title: "Hidden from the website",
    message: "This design is saved, but shoppers will not see it until you publish it again.",
  },
  featured: {
    title: "On the homepage",
    message: "This design will appear with the featured pieces on the homepage.",
  },
  unfeatured: {
    title: "Taken off the homepage",
    message: "This design is still in the catalogue, just no longer on the homepage.",
  },
  "design-added": {
    title: "Design added",
    message: "The new piece is in the catalogue. If it is published, it will appear on the website shortly.",
  },
  "design-saved": {
    title: "Design saved",
    message: "Your updates are in place. Refresh the website if you do not see them yet.",
  },
  "design-removed": {
    title: "Design removed",
    message: "That piece has left the catalogue. This cannot be undone.",
  },
  "collection-added": {
    title: "Collection created",
    message: "The new collection is ready. Add designs to it whenever you like.",
  },
  "collection-saved": {
    title: "Collection saved",
    message: "The collection details are up to date on the website.",
  },
  "collection-removed": {
    title: "Collection removed",
    message: "That collection has left the list. The designs inside it are still in the catalogue.",
  },
  "category-added": {
    title: "Category added",
    message: "You can now group designs under this name inside Men or Women.",
  },
  "category-saved": {
    title: "Category saved",
    message: "The category name and details are up to date.",
  },
  "category-removed": {
    title: "Category removed",
    message: "That grouping is gone. The designs themselves are still in the catalogue.",
  },
  "testimonial-added": {
    title: "Client note added",
    message: "If it is published, this note will appear on the homepage.",
  },
  "testimonial-saved": {
    title: "Client note saved",
    message: "The testimonial is up to date on the website.",
  },
  "testimonial-removed": {
    title: "Client note removed",
    message: "That note will no longer appear on the homepage.",
  },
  "settings-saved": {
    title: "Website details saved",
    message: "Phone, email and homepage text will show on the website shortly.",
  },
  "homepage-saved": {
    title: "Homepage images saved",
    message: "The banner photographs are up to date. Refresh the website to see the rotation.",
  },
  "gallery-saved": {
    title: "Lookbook saved",
    message: "The gallery photographs are up to date on the homepage.",
  },
  "password-saved": {
    title: "Password updated",
    message: "You can keep using the catalogue with your new password.",
  },
} as const;

export type AdminNoticeKey = keyof typeof ADMIN_NOTICES;

export function isAdminNotice(value: string | null): value is AdminNoticeKey {
  return Boolean(value && value in ADMIN_NOTICES);
}
