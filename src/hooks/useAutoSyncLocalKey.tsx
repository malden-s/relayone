import { useCallback } from "react";
import { useLocalKey } from "./useLocalKey";
import { useLocalStorageListener } from "./useLocalStorageListener";
import { PrivateKey } from "bsv";

export function useAutoSyncLocalKey(
  key: string
): [PrivateKey | undefined, (val: PrivateKey, skipWrite?: boolean) => void] {
  const [val, setKey] = useLocalKey(key);
  useLocalStorageListener(
    key,
    useCallback(
      (value: string | null) => {
        if (!value) {
          setKey(void 0, true);
          return;
        }
        setKey(PrivateKey.fromWIF(JSON.parse(value)), true);
      },
      [setKey]
    )
  );

  return [val, setKey];
}
