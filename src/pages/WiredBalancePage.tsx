import React from "react";
import { PrivateKey } from "bsv";
import BalancePage from "./BalancePage";
import LoadingPage from "./LoadingPage";
import { useLocalKey } from "../hooks/useLocalKey";
import { useBalanceSpy } from "../hooks/useBalanceSpy";
import { useExchangeRate } from "../hooks/useExchangeRate";
import { getCurrencyById } from "../helpers/currencies";
import { useAutoSyncLocalStorage } from "../hooks/useAutoSyncLocalStorage";

interface Props {
  synced: boolean;
}

export default function WiredBalancePage(props: Props) {
  const [, setSyncKey] = useLocalKey("SYNC_KEY");
  const [privateKey, setPrivateKey] = useLocalKey("PRIVATE_KEY");
  const [, setIdentityKey] = useLocalKey("IDENTITY_KEY");
  const [balance, balanceLoaded] = useBalanceSpy(
    privateKey
      ? privateKey
          .toPublicKey()
          .toAddress()
          .toString()
      : void 0
  );
  const [currency, setCurrency] = useAutoSyncLocalStorage("CURRENCY", "10024"); // USD
  const [exchangeRate] = useExchangeRate(getCurrencyById(+currency)!.symbol);

  const clearStorage = () => {
    setPrivateKey(void 0);
    setIdentityKey(void 0);
    setSyncKey(PrivateKey.fromRandom());
    window.location.reload();
  };

  if (!balanceLoaded) {
    return <LoadingPage />;
  }

  return (
    <BalancePage
      address={
        privateKey
          ? privateKey
              .toPublicKey()
              .toAddress()
              .toString()
          : void 0
      }
      exchangeRate={exchangeRate}
      currency={+currency}
      satoshis={balance}
      synced={props.synced}
      onDisconnect={clearStorage}
      onCurrencyChange={(currency: number) => setCurrency("" + currency)}
    />
  );
}
