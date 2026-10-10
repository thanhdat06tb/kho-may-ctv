import { z } from "zod";

export const phoneSchema = z.object({
  name: z.string().min(2, "Tên máy quá ngắn").max(120),
  model: z.string().min(2, "Nhập dòng máy").max(80),
  storage: z.string().min(1, "Nhập dung lượng").max(40),
  color: z.string().min(1, "Nhập màu").max(40),
  kind: z.enum(["LOCK", "QUOC_TE", "AN"]),
  carrier: z.string().max(80).optional().nullable(),
  battery: z.coerce.number().int().min(0).max(100),
  appearance: z.string().min(2, "Nhập ngoại hình").max(120),
  screen_status: z.string().min(2, "Nhập màn hình").max(120),
  face_id_status: z.string().min(2, "Nhập Face ID").max(120),
  camera_status: z.string().min(2, "Nhập camera").max(120),
  sim_status: z.string().min(2, "Nhập SIM").max(120),
  repair_history: z.string().max(2000).optional().nullable(),
  description: z.string().max(3000).optional().nullable(),
  price: z.coerce.number().int().min(0, "Giá không hợp lệ"),
  status: z.enum(["CHO_XAC_MINH", "CON_HANG", "DA_GIU", "DA_BAN", "LUU_TRU"]).default("CON_HANG")
});

export const saleSchema = z.object({
  phoneId: z.string().uuid(),
  finalPrice: z.coerce.number().int().positive("Giá chốt phải lớn hơn 0")
});

export const profileSchema = z.object({
  full_name: z.string().min(2).max(120),
  role: z.enum(["ADMIN", "CTV"]),
  is_active: z.boolean()
});
