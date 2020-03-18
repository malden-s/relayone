import { useState } from "react";
import { PrivateKey } from "bsv";

const keyMap: { [key: string]: PrivateKey } = {};

export function useLocalKey(
  localKey: string,
  initial?: PrivateKey
): [
  PrivateKey | undefined,
  (val: PrivateKey | undefined, skipWrite?: boolean) => void
] {
  const [key, setKey] = useLocalStorage(
    localKey,
    initial ? initial.toWIF() : void 0
  );
  let storedKey;
  if (key) {
    if (!keyMap[key]) {
      keyMap[key] = PrivateKey.fromWIF(key);
    }
    storedKey = keyMap[key];
  }

  return [
    storedKey,
    (key: PrivateKey | undefined, skipWrite?: boolean) => {
      if (!key) {
        setKey(void 0);
        return;
      }
      setKey(key.toWIF(), skipWrite);
    }
  ];
}

// https://usehooks.com/useLocalStorage/
export function useLocalStorage(
  key: string,
  initialValue?: string
): [string, (val: string | undefined, skipWrite?: boolean) => void] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      if (!item && initialValue) {
        window.localStorage.setItem(key, JSON.stringify(initialValue));
      }
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: string | undefined, skipWrite = false) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value; // value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      if (!value) {
        window.localStorage.removeItem(key);
        return;
      }
      if (!skipWrite) {
        // Save to local storage
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };

  return [storedValue, setValue];
}
