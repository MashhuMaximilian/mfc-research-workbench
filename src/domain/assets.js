export function assetUrl(path, base = "/") {
  if (!path.startsWith("/")) return path;
  return `${base.replace(/\/$/, "")}/${path.replace(/^\/+/, "")}`;
}
