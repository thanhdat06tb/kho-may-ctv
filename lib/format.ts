export const vndFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0
});

export const dateTimeFormatter = new Intl.DateTimeFormat("vi-VN", {
  timeZone: "Asia/Ho_Chi_Minh",
  dateStyle: "short",
  timeStyle: "short"
});

export function formatVnd(value: number | string | null | undefined) {
  const number = typeof value === "string" ? Number(value) : value;
  return vndFormatter.format(Number.isFinite(number) ? Number(number) : 0);
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) return "Chưa có";
  return dateTimeFormatter.format(new Date(value));
}
