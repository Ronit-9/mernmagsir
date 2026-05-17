import { createSlice } from '@reduxjs/toolkit';

// ── Helpers ───────────────────────────────────────────────────────────────────

function loadFromStorage() {
  try {
    const token = localStorage.getItem('token') || null;
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
}

function saveToStorage(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

function clearStorage() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

// ── Key fix: backend returns _id, frontend uses id everywhere ─────────────────
// Normalize once here so every component can safely use user.id
function normalizeUser(raw) {
  if (!raw) return null;
  return {
    ...raw,
    id: raw.id || raw._id,   // always set id regardless of what backend sends
  };
}

// ── Slice ─────────────────────────────────────────────────────────────────────
export const userSlice = createSlice({
  name: 'user',
  initialState: loadFromStorage(),

  reducers: {
    // Called after login/register → dispatch(setUser(response))
    // response = { token, user: { _id, username, email, profilePicture? } }
    setUser(state, action) {
      const normalized = normalizeUser(action.payload.user);
      state.token = action.payload.token;
      state.user = normalized;
      saveToStorage(action.payload.token, normalized);
    },

    // Called after profile edit → dispatch(updateUser({ profilePicture: '...' }))
    updateUser(state, action) {
      const normalized = normalizeUser({ ...state.user, ...action.payload });
      state.user = normalized;
      if (state.token) saveToStorage(state.token, normalized);
    },

    // Called on logout
    clearUser(state) {
      state.token = null;
      state.user = null;
      clearStorage();
    },
  },
});

export const { setUser, updateUser, clearUser } = userSlice.actions;
export default userSlice.reducer;