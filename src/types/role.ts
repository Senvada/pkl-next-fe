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
      read: { label: "Lihat", description: "Melihat dan membaca data akun pengguna" },
      create: { label: "Buat", description: "Membuat akun pengguna baru" },
      update: { label: "Ubah", description: "Mengubah informasi data akun pengguna" },
      delete: { label: "Hapus", description: "Menghapus akun pengguna dari sistem" },
    },
  },
  article: {
    title: "Artikel & Berita",
    description: "Kelola pembuatan, pengeditan, dan publikasi artikel",
    actions: {
      read: { label: "Lihat", description: "Melihat dan membaca draft dan artikel publik" },
      create: { label: "Buat", description: "Menulis dan membuat draft artikel baru" },
      publish: { label: "Merilis", description: "Mempublikasikan artikel ke portal publik" },
      update: { label: "Ubah", description: "Mengubah konten artikel yang ada" },
      delete: { label: "Hapus", description: "Menghapus artikel dari portal" },
    },
  },
  company: {
    title: "Perusahaan Mitra",
    description: "Kelola data dan informasi mitra industri PKL",
    actions: {
      read: { label: "Lihat", description: "Melihat direktori perusahaan mitra" },
      create: { label: "Buat", description: "Menambahkan data perusahaan mitra baru" },
      update: { label: "Ubah", description: "Mengubah profil dan info perusahaan mitra" },
      delete: { label: "Hapus", description: "Menghapus data perusahaan mitra" },
    },
  },
  role: {
    title: "Role & Hak Akses",
    description: "Kelola tingkatan role dan matriks izin pengguna",
    actions: {
      read: { label: "Lihat", description: "Melihat daftar role dan konfigurasi hak akses" },
      create: { label: "Buat", description: "Membuat role dan paket perizinan baru" },
      update: { label: "Ubah", description: "Mengubah konfigurasi permission role" },
      delete: { label: "Hapus", description: "Menghapus role yang tidak digunakan" },
    },
  },
  department: {
    title: "Jurusan & Departemen",
    description: "Kelola data jurusan dan konsentrasi keahlian",
    actions: {
      read: { label: "Lihat", description: "Melihat daftar jurusan dan departemen" },
      create: { label: "Buat", description: "Menambahkan jurusan atau departemen baru" },
      update: { label: "Ubah", description: "Mengubah informasi jurusan atau departemen" },
      delete: { label: "Hapus", description: "Menghapus data jurusan atau departemen" },
    },
  },
  asset: {
    title: "Galeri & Aset",
    description: "Kelola penyimpanan berkas media Cloud Storage",
    actions: {
      read: { label: "Lihat", description: "Melihat dan mengunduh berkas aset media" },
      create: { label: "Unggah", description: "Mengunggah berkas baru ke Cloud Storage" },
      update: { label: "Ubah", description: "Mengubah nama atau metadata berkas aset" },
      delete: { label: "Hapus", description: "Menghapus berkas aset dari Cloud Storage" },
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
