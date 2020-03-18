import { useCallback } from "react";
import { useLocalStorageListener } from "./useLocalStorageListener";
import { useLocalStorage } from "./useLocalKey";

export function useAutoSyncLocalStorage(
  key: string,
  initial?: string
): [string, (val: string) => void] {
  const [val, setKey] = useLocalStorage(key, initial);
  useLocalStorageListener(
    key,
    useCallback(
      (value: string | null) => {
        if (!value) {
          setKey(void 0, true);
          return;
        }
        setKey(JSON.parse(value), true);
      },
      [setKey]
    )
  );

  return [val, setKey];
}
