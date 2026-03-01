export function stripHtml(html) {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&copy;/g, "(c)")
    .replace(/\s+/g, " ")
    .trim();
}

export const SKILL_LEVELS = {
  en: { 5: "expert", 4: "advanced", 3: "intermediate" },
  de: { 5: "Experte", 4: "fortgeschritten", 3: "fortgeschritten" },
};
