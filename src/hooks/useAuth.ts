export function useAuth() {
  const noAuthError = new Error("Admin access has been disabled");

  const asyncErrorResponse = async () => ({ error: noAuthError });

  return {
    user: null as null,
    isAdmin: false,
    adminRole: null as null,
    loading: false,
    signIn: asyncErrorResponse,
    signOut: async () => ({ error: null }),
  };
}
