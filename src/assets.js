import { assetUrl } from "./domain/assets.js";

export const sourceAsset = (path) =>
  assetUrl(path, import.meta.env?.BASE_URL || "/");
export const localArchiveAvailable = import.meta.env?.DEV === true &&
  typeof __MFC_HAS_LOCAL_ARCHIVE__ !== "undefined" && __MFC_HAS_LOCAL_ARCHIVE__;
