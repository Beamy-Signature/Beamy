export type AdminPopupDetail = {
  title: string;
  message: string;
};

export const ADMIN_POPUP_EVENT = "beamy-admin-popup";

export function showAdminPopup(title: string, message: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<AdminPopupDetail>(ADMIN_POPUP_EVENT, { detail: { title, message } }));
}
