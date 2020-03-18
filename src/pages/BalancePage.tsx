import React, { useState } from "react";

import PageWrapper from "../components/PageWrapper";
import Button from "../components/Button";
import Balance from "../components/Balance";
import QRCode from "../components/QRCode";
import { copyToClipboard } from "../helpers/copyToClipboard";
import { Result } from "../types";
import { CURRENCIES } from "../helpers/currencies";
import SuccessMessage from "../components/SuccessMessage";

interface Props {
  address?: string;
  synced: boolean;
  exchangeRate: Result<number>;
  satoshis: number;
  currency: number;
  onCurrencyChange: (currency: number) => any;
  onDisconnect: () => any;
}

export default function BalancePage(props: Props) {
  const [copied, setCopied] = useState(false);
  const [synced, setSynced] = useState(props.synced);

  const copiedLabel = {
    background: "rgb(17, 26, 44)",
    color: "white",
    height: 40,
    width: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    margin: "0 auto"
  };

  const copyAddress = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setSynced(false);
    }, 2100);
    return props.address && copyToClipboard(props.address);
  };

  return (
    <PageWrapper
      header={
        copied ? (
          <div style={copiedLabel}>Copied!</div>
        ) : !!synced ? (
          <SuccessMessage timeout={10} color={"green"}>
            Now paired with RelayX. You can close this tab.
          </SuccessMessage>
        ) : null
      }
      footer={
        <Button
          primary={false}
          text={"Disconnect"}
          onClick={props.onDisconnect}
        />
      }
    >
      <Balance
        currency={props.currency}
        exchangeRate={props.exchangeRate}
        satoshis={props.satoshis}
        onCurrencyChange={props.onCurrencyChange}
        options={CURRENCIES}
      />
      {!!props.address && (
        <div
          style={{ textAlign: "center", padding: 15, cursor: "pointer" }}
          onClick={copyAddress}
        >
          <QRCode url={`bitcoin:${props.address}?sv`} size={185} />
        </div>
      )}
    </PageWrapper>
  );
}
