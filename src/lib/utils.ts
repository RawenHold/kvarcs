import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
