const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const getToken = () => localStorage.getItem("mrk_token");

export async function api(path, options = {}) {
  const token = getToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Something went wrong.");
  return data;
}

export const saveSession = ({ token, user }) => {
  localStorage.setItem("mrk_token", token);
  localStorage.setItem("mrk_user", JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem("mrk_token");
  localStorage.removeItem("mrk_user");
};

export const getSavedUser = () => {
  try {
    return JSON.parse(localStorage.getItem("mrk_user") || "null");
  } catch {
    return null;
  }
};
