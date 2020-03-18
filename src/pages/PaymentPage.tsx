import React, { useState, useEffect } from "react";
import PageWrapper from "../components/PageWrapper";
import QRCode from "../components/QRCode";
import PaymentData from "../components/PaymentData";
import ExpiredTimer from "../components/ExpiredTimer";
import CurrencyDropdown from "../components/CurrencyDropdown";
import { fetchPaymentMethod } from "../api";

interface Props {
  symbol: string;
  value: number;
  itemName: string;
  onClick: any;
  primary?: boolean;
  paymentService?: any;
}

interface Options {
  paymentId: number;
  paymentName: string;
  paymentType: number;
  sign: string;
  status: number;
  symbolId: number;
  symbolName: string;
}

export default function PaymentPage(props: Props) {
  const [options, setOptions] = useState<Options[]>([]);

  const sentStyle = {
    width: 94,
    background: "rgb(38, 105, 255)",
    height: 32,
    border: "none",
    outline: "none",
    color: "white",
    borderRadius: 3,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  };

  const cancelStyle = {
    width: 94,
    background: "white",
    height: 32,
    border: "none",
    outline: "none",
    color: "rgb(144, 148, 156)",
    borderRadius: 3,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  };

  useEffect(() => {
    fetchPaymentMethod().then(result => setOptions(result));
  }, []);

  const renderOptionList = () => {
    return options.map(service => {
      return {
        value: service.paymentId,
        label: service.paymentName,
        imgUrl: ""
      };
    });
  };

  return (
    <PageWrapper>
      <div
        style={{
          width: 411,
          marginBottom: 40
        }}
      >
        <CurrencyDropdown
          currency={props.paymentService}
          onChange={() => {}}
          options={renderOptionList()}
        />
      </div>
      <QRCode url={""} size={240} />
      <PaymentData
        symbol={props.symbol}
        value={"" + props.value}
        itemName={props.itemName}
      />
      <ExpiredTimer timeout={59} />
      <div
        style={{
          width: 238,
          display: "flex",
          justifyContent: "space-between",
          marginTop: 23
        }}
      >
        <button onClick={props.onClick} style={cancelStyle}>
          Cancel
        </button>
        <button onClick={props.onClick} style={sentStyle}>
          Sent
        </button>
      </div>
    </PageWrapper>
  );
}
