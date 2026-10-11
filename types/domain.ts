export type UserRole = "ADMIN" | "CTV";
export type PhoneKind = "LOCK" | "QUOC_TE" | "AN";
export type PhoneStatus = "CHO_XAC_MINH" | "CON_HANG" | "DA_GIU" | "DA_BAN" | "LUU_TRU";

export type Profile = {
  id: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
};

export type PhoneImage = {
  id: string;
  phone_id: string;
  storage_path: string;
  public_url: string;
  sort_order: number;
};

export type PhoneEditPermission = {
  id: string;
  phone_id: string;
  user_id: string;
  granted_by: string;
  created_at: string;
  profiles?: Pick<Profile, "full_name" | "role" | "is_active"> | null;
};

export type Phone = {
  id: string;
  inventory_code: string;
  name: string;
  model: string;
  storage: string;
  color: string;
  kind: PhoneKind;
  carrier: string | null;
  battery: number;
  appearance: string;
  screen_status: string;
  face_id_status: string;
  camera_status: string;
  sim_status: string;
  repair_history: string | null;
  description: string | null;
  price: number;
  added_by: string;
  verified_by: string | null;
  verified_at: string | null;
  status: PhoneStatus;
  hold_by: string | null;
  hold_expires_at: string | null;
  sold_at: string | null;
  created_at: string;
  updated_at: string;
  profiles?: Pick<Profile, "full_name"> | null;
  phone_images?: PhoneImage[];
  phone_edit_permissions?: PhoneEditPermission[];
};

export type Sale = {
  id: string;
  phone_id: string;
  seller_id: string;
  final_price: number;
  sold_at: string;
  voided_at: string | null;
  void_reason: string | null;
  phones?: Pick<Phone, "name" | "inventory_code"> | null;
  profiles?: Pick<Profile, "full_name"> | null;
};

export type AuditLog = {
  id: string;
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, unknown>;
  created_at: string;
  profiles?: Pick<Profile, "full_name"> | null;
};
