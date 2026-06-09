import { SITE } from "../config";

export function withBase(path: string) {
  if (!path) return SITE.basePath;
  if (/^https?:\/\//.test(path)) return path;

  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (
    normalized === SITE.basePath ||
    normalized.startsWith(`${SITE.basePath}/`)
  ) {
    return normalized;
  }

  return `${SITE.basePath}${normalized}`;
}

export function stripBase(path: string) {
  if (!path.startsWith(SITE.basePath)) return path;

  const stripped = path.slice(SITE.basePath.length);
  return stripped || "/";
}
