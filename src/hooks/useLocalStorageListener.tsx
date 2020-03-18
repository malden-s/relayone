import { useEffect } from "react";

export function useLocalStorageListener(
  key: string,
  cb: (value: string | null) => void
) {
  // FIXME only works if key is used once in the app
  useEffect(() => {
    const listener = (e: StorageEvent) => {
      if (e.key === key) {
        cb(e.newValue);
      }
    };

    window.addEventListener("storage", listener);

    return () => {
      window.removeEventListener("storage", listener);
    };
  }, [key, cb]);
}
