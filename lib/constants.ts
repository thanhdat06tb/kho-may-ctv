import type { PhoneKind, PhoneStatus } from "@/types/domain";

export const phoneKindLabels: Record<PhoneKind, string> = {
  LOCK: "Lock",
  QUOC_TE: "Quốc tế",
  AN: "Ẩn"
};

export const phoneStatusLabels: Record<PhoneStatus, string> = {
  CHO_XAC_MINH: "Chờ xác minh",
  CON_HANG: "Còn hàng",
  DA_GIU: "Đã giữ",
  DA_BAN: "Đã bán",
  LUU_TRU: "Lưu trữ"
};

export const phoneStatusTone: Record<PhoneStatus, "mint" | "warning" | "danger" | "muted"> = {
  CHO_XAC_MINH: "warning",
  CON_HANG: "mint",
  DA_GIU: "warning",
  DA_BAN: "danger",
  LUU_TRU: "muted"
};
