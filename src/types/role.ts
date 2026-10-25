export interface ActionConfig {
  label: string;
  description: string;
}

export interface ModuleConfig {
  title: string;
  description: string;
  actions: Record<string, ActionConfig>;
}

// ============================================================
// KONFIGURASI MODUL & HAK AKSES SISTEM PKL
// - Untuk menambah modul baru: tambahkan key baru di MODULES_CONFIG
// - Untuk menambah aksi baru: tambahkan aksi di actions modul tsb
// ============================================================
export const MODULES_CONFIG = {
  users: {
    title: "Pengguna",
    description: "Kelola akun dan data pengguna dalam sistem",
    actions: {
      write: { label: "Tulis", description: "Menambahkan pengguna baru dan mengelola akun sendiri" },
      update: { label: "Ubah", description: "Mengubah informasi data akun pengguna lain dalam lingkup jurusan" },
      delete: { label: "Hapus", description: "Menghapus akun pengguna lain dalam lingkup jurusan" },
    },
  },
  article: {
    title: "Artikel & Berita",
    description: "Kelola pembuatan, pengeditan, dan publikasi artikel",
    actions: {
      write: { label: "Tulis", description: "Menulis artikel baru dan mengelola artikel milik sendiri" },
      update: { label: "Ubah", description: "Mengubah artikel yang dibuat oleh orang lain" },
      delete: { label: "Hapus", description: "Menghapus artikel milik orang lain" },
      publish: { label: "Publikasi", description: "Meninjau artikel berstatus review dan menerbitkan ke portal publik" },
    },
  },
  company: {
    title: "Perusahaan Mitra",
    description: "Kelola data dan informasi mitra industri PKL",
    actions: {
      write: { label: "Tulis", description: "Menambahkan mitra baru dan mengelola mitra yang didaftarkan sendiri" },
      update: { label: "Ubah", description: "Mengubah profil dan informasi perusahaan mitra lain" },
      delete: { label: "Hapus", description: "Menghapus data perusahaan mitra lain" },
    },
  },
  role: {
    title: "Role & Hak Akses",
    description: "Kelola tingkatan role dan matriks izin pengguna",
    actions: {
      write: { label: "Tulis", description: "Membuat role dan paket perizinan baru" },
      update: { label: "Ubah", description: "Mengubah konfigurasi permission role lain" },
      delete: { label: "Hapus", description: "Menghapus konfigurasi role" },
    },
  },
  department: {
    title: "Jurusan & Departemen",
    description: "Kelola data jurusan dan konsentrasi keahlian",
    actions: {
      write: { label: "Tulis", description: "Menambahkan jurusan atau departemen baru" },
      update: { label: "Ubah", description: "Mengubah informasi jurusan atau departemen lain" },
      delete: { label: "Hapus", description: "Menghapus data jurusan atau departemen" },
    },
  },
  asset: {
    title: "Galeri & Aset",
    description: "Kelola gambar dan berkas media galeri",
    actions: {
      write: { label: "Tulis", description: "Mengunggah berkas baru dan mengelola galeri sendiri" },
      update: { label: "Ubah", description: "Mengubah nama atau informasi berkas galeri milik orang lain" },
      delete: { label: "Hapus", description: "Menghapus berkas media milik orang lain" },
    },
  },
} as const satisfies Record<string, ModuleConfig>;

export type ModuleRole = keyof typeof MODULES_CONFIG;
export type RolesPermission = Record<string, Record<string, boolean>>;

export interface Role {
  id?: string;
  name: string;
  color: string;
  permissions: RolesPermission;
  user_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateRolePayload {
  name: string;
  color: string;
  permissions: RolesPermission;
}

export interface UpdateRolePayload {
  name?: string;
  color?: string;
  permissions?: RolesPermission;
}

/**
 * Menghasilkan objek permissions dengan seluruh aksi diset ke `false` (Nonaktif).
 */
export function createEmptyPermissions(): RolesPermission {
  return Object.fromEntries(
    Object.entries(MODULES_CONFIG).map(([module, config]) => [
      module,
      Object.fromEntries(Object.keys(config.actions).map((action) => [action, false])),
    ])
  );
}

/**
 * Menghasilkan objek permissions dengan seluruh aksi diset ke `true` (Aktif penuh).
 */
export function createFullPermissions(): RolesPermission {
  return Object.fromEntries(
    Object.entries(MODULES_CONFIG).map(([module, config]) => [
      module,
      Object.fromEntries(Object.keys(config.actions).map((action) => [action, true])),
    ])
  );
}
