const profileKey = (email) => `ml.profile.${email.trim().toLowerCase()}`;

export function saveProfileHint(email, { displayName }) {
  if (!email || !displayName?.trim()) return;
  localStorage.setItem(profileKey(email), JSON.stringify({ displayName: displayName.trim() }));
}

export function getStoredDisplayName(email) {
  if (!email) return null;
  try {
    const raw = localStorage.getItem(profileKey(email));
    if (!raw) return null;
    return JSON.parse(raw).displayName ?? null;
  } catch {
    return null;
  }
}
