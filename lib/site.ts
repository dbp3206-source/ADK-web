import siteConfig from "@/config/site-config.example.json";

const placeholderPattern = /^__.*__$/;

export function isRealUrl(value: string | undefined) {
  if (!value || placeholderPattern.test(value)) return false;
  try {
    const url = new URL(value);
    return ["http:", "https:", "mailto:"].includes(url.protocol);
  } catch {
    return false;
  }
}

export function getOwnerName() {
  return placeholderPattern.test(siteConfig.owner.name) ? "" : siteConfig.owner.name;
}

export function getUtilityLinks() {
  return [
    { label: "CV", href: siteConfig.owner.cvUrl },
    { label: "GitHub", href: siteConfig.owner.githubProfile },
    { label: "LinkedIn", href: siteConfig.owner.linkedin }
  ].filter((link) => isRealUrl(link.href));
}

export const config = siteConfig;
