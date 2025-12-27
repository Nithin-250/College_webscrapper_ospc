export interface StoredAdminInfo {
  username: string;
  role: string;
}

export const ADMIN_TOKEN_STORAGE_KEY = "eventhub_admin_token";
export const ADMIN_INFO_STORAGE_KEY = "eventhub_admin_info";

const hasWindow = typeof window !== "undefined";

export const loadStoredAdminSession = () => {
  if (!hasWindow) {
    return { token: null, admin: null as StoredAdminInfo | null };
  }

  const token = window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
  const storedInfo = window.localStorage.getItem(ADMIN_INFO_STORAGE_KEY);

  let admin: StoredAdminInfo | null = null;
  if (storedInfo) {
    try {
      const parsed = JSON.parse(storedInfo) as StoredAdminInfo;
      if (parsed?.username) {
        admin = parsed;
      }
    } catch (error) {
      console.warn("Failed to parse stored admin info", error);
    }
  }

  return { token, admin };
};

export const persistAdminSession = (token: string, admin: StoredAdminInfo) => {
  if (!hasWindow) return;
  window.localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
  window.localStorage.setItem(ADMIN_INFO_STORAGE_KEY, JSON.stringify(admin));
};

export const clearAdminSession = () => {
  if (!hasWindow) return;
  window.localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(ADMIN_INFO_STORAGE_KEY);
};
