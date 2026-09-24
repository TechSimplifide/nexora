import { useCallback, useSyncExternalStore } from "react";

const STORAGE_PREFIX = "nexora-profile-image:";

export function getProfileImageKey(userId) {
  return userId ? `${STORAGE_PREFIX}${userId}` : null;
}

function getStoredProfileImage(userId) {
  const key = getProfileImageKey(userId);
  if (!key) return null;
  try {
    return localStorage.getItem(key) || null;
  } catch {
    return null;
  }
}

// Hook to manage persistent frontend profile images per user.
export function useProfileImage(userId) {
  const subscribe = useCallback(
    (onStoreChange) => {
      const handleUpdate = (e) => {
        if (e.detail?.userId === userId) {
          onStoreChange();
        }
      };

      window.addEventListener("nexora:profile-image-updated", handleUpdate);
      window.addEventListener("storage", onStoreChange);

      return () => {
        window.removeEventListener("nexora:profile-image-updated", handleUpdate);
        window.removeEventListener("storage", onStoreChange);
      };
    },
    [userId]
  );

  const getSnapshot = useCallback(() => {
    return getStoredProfileImage(userId);
  }, [userId]);

  const profileImage = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => null // Server/Initial fallback
  );

  const saveImage = useCallback(
    (dataUrl) => {
      const key = getProfileImageKey(userId);
      if (!key) return;
      try {
        localStorage.setItem(key, dataUrl);
        window.dispatchEvent(
          new CustomEvent("nexora:profile-image-updated", {
            detail: { userId, image: dataUrl },
          })
        );
      } catch (err) {
        console.error("Failed to save profile image to localStorage:", err);
        throw err;
      }
    },
    [userId]
  );

  const removeImage = useCallback(() => {
    const key = getProfileImageKey(userId);
    if (!key) return;
    try {
      localStorage.removeItem(key);
      window.dispatchEvent(
        new CustomEvent("nexora:profile-image-updated", {
          detail: { userId, image: null },
        })
      );
    } catch (err) {
      console.error("Failed to remove profile image from localStorage:", err);
    }
  }, [userId]);

  return { profileImage, saveImage, removeImage };
}
