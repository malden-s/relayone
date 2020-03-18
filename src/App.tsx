import React, { useState, useEffect } from "react";
import "./App.css";
import OnBoarding from "./OnBoarding";
import UpgradeWarning from "./UpgradeWarning";

import { CreateTx, isScriptOutput } from "./tx";
import { useAutoSyncLocalKey } from "./hooks/useAutoSyncLocalKey";
import { useExchangeRate } from "./hooks/useExchangeRate";
import { useAutoSyncLocalStorage } from "./hooks/useAutoSyncLocalStorage";
import { getCurrencyById } from "./helpers/currencies";

import { clickImpl } from "./clickImpl";
import {
  ValidatedProps,
  CallbackProps,
  Output,
  ScriptOutput,
  RegularOutput,
  Result
} from "./types";
import sb from "satoshi-bitcoin";

import Slider from "./Slider";
import { PrivateKey, Address } from "bsv";
import {
  getOutputAmountWithoutChange,
  formatCurrencyWithPrecision
} from "./utils";
import { getIdentityAddress, getUtxos, Utxo } from "./api";

function isOpReturnOutput(o: Output) {
  if (isScriptOutput(o)) {
    return o.script.isDataOut() || o.script.isSafeDataOut();
  }
  return false;
}

function findEditableOutput(outputs: Output[]) {
  return outputs.find(o => !isOpReturnOutput(o));
}

function updateEditableOutput(outputs: Output[], amount: string): Output[] {
  const idx = outputs.findIndex(o => !isOpReturnOutput(o));
  const output: ScriptOutput | RegularOutput = outputs.find(
    o => !isOpReturnOutput(o)
  )! as any;
  const newOutputs = [...outputs];
  newOutputs[idx] = { ...output, amount };
  return newOutputs;
}

function useEstimatedTotal(
  privateKey: PrivateKey | undefined,
  currency: string,
  outputs: Output[],
  rate: Result<number>,
  devMode: boolean,
  utxos: Utxo[]
): [number, boolean] {
  const [total, setTotal] = useState(0);
  const [estimated, setEstimated] = useState(false);

  useEffect(() => {
    if (rate.isLoading) return;
    CreateTx(privateKey, outputs, rate.value, utxos).then(tx => {
      setTotal(getOutputAmountWithoutChange(tx));
      setEstimated(true);
    });
  }, [privateKey, currency, outputs, devMode, rate, utxos]);
  return [total, estimated];
}

function useIdentityAddress(
  identityKey: PrivateKey | undefined
): [string, boolean] {
  const [address, setAddress] = useState("");
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (!identityKey) return;
    if (fetched) setFetched(false);
    getIdentityAddress(identityKey.toPublicKey().toString()).then(data => {
      if (data.code === 0) {
        setAddress(data.data);
      } else {
        setAddress("");
      }
      setFetched(true);
    });
    // eslint-disable-next-line
  }, [identityKey]);
  return [address, fetched];
}

function useUtxos(key: PrivateKey | undefined) {
  const [utxo, setUtxo] = useState<Utxo[]>([]);
  useEffect(() => {
    if (key) {
      getUtxos(Address.fromPrivateKey(key).toString()).then(utxos => {
        setUtxo(utxos);
      });
    }
  }, [key]);

  return utxo;
}

export default function App(props: ValidatedProps & CallbackProps) {
  const [privateKey] = useAutoSyncLocalKey("PRIVATE_KEY");
  const [identityKey] = useAutoSyncLocalKey("IDENTITY_KEY");
  const [userCurrency] = useAutoSyncLocalStorage("CURRENCY", "10024"); // USD
  const [onboarding, setOnboarding] = useState(false);
  const [upgradeWarning, setUpgradeWarning] = useState(false);
  const [spent, setSpent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("RelayOne");
  const [error, setError] = useState("");
  const [outputs, setOutputs] = useState(props.outputs);
  let currency = outputs[0].currency;
  let localCurrency = getCurrencyById(+userCurrency)!.symbol;

  const utxos = useUtxos(privateKey);

  const [exchangeRate] = useExchangeRate(currency);
  const [userExchangeRate] = useExchangeRate(localCurrency);

  // eslint-disable-next-line
  const [address, bindStatusFetched] = useIdentityAddress(identityKey);
  const bindStatusLoaded = !!identityKey ? bindStatusFetched : true;

  useEffect(() => {
    if (!exchangeRate.isLoading) {
      props.onLoad();
    }
    // eslint-disable-next-line
  }, [exchangeRate]);
  const [totalAmountSatoshis, totalEstimated] = useEstimatedTotal(
    privateKey,
    currency,
    outputs,
    exchangeRate,
    props.devMode,
    utxos
  );
  let editableAmount = "";
  if (
    props.editable &&
    !userExchangeRate.isLoading &&
    !exchangeRate.isLoading
  ) {
    const output = findEditableOutput(outputs)!;
    // estimate precision
    if (output.currency === "BSV") {
      editableAmount = formatCurrencyWithPrecision(
        String(userExchangeRate.value * +output.amount),
        4
      );
    } else {
      editableAmount = formatCurrencyWithPrecision(
        String((userExchangeRate.value / exchangeRate.value) * +output.amount),
        4
      );
    }
  }

  let showOnboarding = onboarding && !privateKey;
  let showUpgradeWarning = upgradeWarning && !address;

  let disabled = props.disabled; // || !privateKey;

  if (props.editable) {
    disabled = disabled || !(+editableAmount || 0);
  }

  const click = async () => {
    try {
      if (exchangeRate.isLoading) {
        throw new Error("Exchange rate is still loading");
      }
      const paymentResult = await clickImpl(
        privateKey!,
        currency,
        outputs,
        exchangeRate.value,
        props.devMode
      );
      props.onPayment({
        ...paymentResult,
        identity: identityKey!.toPublicKey().toString()
      });
      setSpent(true);
    } catch (e) {
      // Most likely not enough balance
      if (e.name === "bsv.ErrorTransactionInvalidOutputAmountSum") {
        setError("Low funds");
        props.onError("Low funds");
      } else {
        setError("Error");
        props.onError(e.toString());
      }
    }
    setLoading(false);
    setLoadingMessage("RelayOne");
  };

  const handleSliderReachEnd = () => {
    if (!privateKey) {
      setOnboarding(true);
      return;
    }
    if (!address) {
      setUpgradeWarning(true);
      return;
    }
    setLoading(true);
    setLoadingMessage("Processing");
    click();
  };

  const handleAmountChange = (newAmount: string) => {
    if (
      !props.editable ||
      userExchangeRate.isLoading ||
      exchangeRate.isLoading
    ) {
      return;
    }

    const output = findEditableOutput(outputs)!;
    if (output.currency === "BSV") {
      newAmount = formatCurrencyWithPrecision(
        String(+newAmount / userExchangeRate.value),
        4
      );
    } else {
      newAmount = formatCurrencyWithPrecision(
        String(+newAmount / (userExchangeRate.value / exchangeRate.value)),
        4
      );
    }

    setOutputs(
      updateEditableOutput(outputs, newAmount.replace(/[^0-9.]/gi, ""))
    );
  };

  const handleSliderChange = () => {
    // called as slider changes position
  };

  const handleSliderComplete = () => {
    // Slider released before completion
  };

  return (
    <div>
      {!!showOnboarding && <OnBoarding />}
      {!!showUpgradeWarning && <UpgradeWarning />}

      <Slider
        loading={
          loading ||
          exchangeRate.isLoading ||
          userExchangeRate.isLoading ||
          !totalEstimated ||
          !bindStatusLoaded
        }
        loadingMessage={loadingMessage}
        success={spent}
        successMessagePrefix={"Paid"}
        editable={props.editable && !userExchangeRate.isLoading}
        disabled={disabled}
        error={!!error}
        errorMessage={error}
        onSlideComplete={handleSliderComplete}
        onSliderReachEnd={handleSliderReachEnd}
        onSliderChange={handleSliderChange}
        onInputChange={handleAmountChange}
        currency={localCurrency}
        inputValue={editableAmount}
        displayValue={String(
          sb.toBitcoin(totalAmountSatoshis) *
            (userExchangeRate.isLoading ? 1 : userExchangeRate.value)
        )}
      />
    </div>
  );
}
