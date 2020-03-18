import { useEffect } from "react";
import { PrivateKey, Address } from "bsv";
import ECIES from "bsv/ecies";
import { getOneLinkData } from "../api";

function sleep(msec: number) {
  return new Promise(resolve => {
    setTimeout(resolve, msec);
  });
}

export function useOneChallenge(
  syncKey: PrivateKey,
  onSuccess: (key: string) => void,
  synced: boolean
) {
  useEffect(() => {
    const address = Address.fromPrivateKey(syncKey).toString();
    let stop = synced;
    (async function() {
      while (true) {
        await sleep(5000);
        if (stop) return;
        try {
          const data = await getOneLinkData(address);
          if (stop) return;

          if (data.code === 0) {
            let e = new ECIES().privateKey(syncKey);
            const syncData = JSON.parse(
              e.decrypt(Buffer.from(data.data, "hex")).toString()
            );
            if (syncData.challenge && syncData.version === "beta") {
              onSuccess(syncData.challenge);
              return;
            }
          }
        } catch {}
      }
    })();

    return function() {
      stop = true;
    };
  }, [syncKey, onSuccess, synced]);
}
