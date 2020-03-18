import { useEffect, useState } from "react";
import "../polyfills/EventSource";
import { getUtxos } from "../api";

const bitsocketUrl =
  "https://chronos.bitdb.network/s/1P6o45vqLdo6X8HRCZk8XuDsniURmXqiXo/";

function monitorAddressQuery(addressList: string[]) {
  return {
    v: 3,
    q: {
      find: {
        $or: [
          { "in.e.a": { $in: addressList } },
          { "out.e.a": { $in: addressList } }
        ]
      }
    }
  };
}

// FIXME: request race condition
export function useBalanceSpy(address: string | undefined): [number, boolean] {
  const [balance, setBalance] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!address) return;

    const q = monitorAddressQuery([address.toString()]);
    const b64 = btoa(JSON.stringify(q));
    const url = bitsocketUrl + b64;
    let socket = new EventSource(url);
    socket.onopen = async e => {
      const utxos = await getUtxos(address.toString(), 1000);
      setBalance(utxos.reduce((acc, val) => acc + val.satoshis, 0));
      if (!loaded) {
        setLoaded(true);
      }
    };
    socket.onmessage = async e => {
      let r = JSON.parse(e.data);
      if (r.type === "t") {
        const utxos = await getUtxos(address.toString(), 1000);
        setBalance(utxos.reduce((acc, val) => acc + val.satoshis, 0));
        if (!loaded) {
          setLoaded(true);
        }
      }
    };

    return function() {
      socket.close();
    };
    // eslint-disable-next-line
  }, []);

  return [balance, loaded];
}
