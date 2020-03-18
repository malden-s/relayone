import React from "react";
import NumberFormat from "react-number-format";
import sb from "satoshi-bitcoin";
import CurrencyDropdown from "./CurrencyDropdown";
import { getCurrencyById } from "../helpers/currencies";
import { Result } from "../types";
import Loader from "./Loader";

interface Props {
  exchangeRate: Result<number>;
  satoshis: number;
  currency: number;
  onCurrencyChange: (currency: number) => any;
  options: any;
}

export default function Balance(props: Props) {
  const bitcoin = sb.toBitcoin(props.satoshis);

  return (
    <div>
      <div
        style={{
          color: "white",
          textAlign: "center"
        }}
      >
        <div style={{ fontSize: 20, marginBottom: 20 }}>Balance</div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ fontSize: 24, marginRight: 10, lineHeight: "40px" }}>
            {getCurrencyById(props.currency)!.sign}
          </div>
          {props.exchangeRate.isLoading ? (
            <Loader height={20} width={80} />
          ) : (
            <div style={{ fontSize: 36, lineHeight: "40px" }}>
              <NumberFormat
                decimalScale={2}
                displayType={"text"}
                value={props.exchangeRate.value * bitcoin}
                thousandSeparator
              />
            </div>
          )}
        </div>
        <div
          style={{
            color: "rgb(104, 114, 136)",
            fontSize: 16,
            margin: "4px 0 12px 0"
          }}
        >
          <NumberFormat
            displayType={"text"}
            value={props.satoshis}
            thousandSeparator
          />
          {" satoshi"}
        </div>
      </div>
      <div style={{ width: 112, margin: "0 auto" }}>
        <CurrencyDropdown
          currency={props.currency}
          onChange={props.onCurrencyChange}
          options={props.options}
        />
      </div>
    </div>
  );
}
