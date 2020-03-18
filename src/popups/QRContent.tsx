import React from 'react';
import QRCode from "../components/QRCode";
import PaymentData from '../components/PaymentData';
import ExpiredTimer from '../components/ExpiredTimer';

interface Props {
  symbol: string;
  value: string;
  itemName: string;
  onCancleClick: any;
  primary?: boolean;
  paymentService?: any;
  onSendClick: any;
  options: any;
  currentService: any;
}

export default function QRContent(props: Props) {
  const sentStyle = {
    width: 94,
    background: 'rgb(38, 105, 255)',
    height: 32,
    border: 'none',
    outline: 'none',
    color: 'white',
    borderRadius: 3,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }

  const cancelStyle = {
    width: 94,
    background: 'white',
    height: 32,
    border: 'none',
    outline: 'none',
    color: 'rgb(144, 148, 156)',
    borderRadius: 3,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }

  const renderPaymentMethod = () => {
    return props.options.find(service => service.label === props.currentService.label)
  }

  return (
    console.log(props.currentService),
    console.log(props.options),
    console.log(renderPaymentMethod()),
    <>
        <div style={{
          widows: 232,
          height: 33,
          padding: '0 5px',
          background: 'rgb(44, 54, 78)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
        }}>
          {renderPaymentMethod().label}
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: 15
        }}>
        <QRCode url={''} size={150} />
      </div>
      <PaymentData
        symbol={props.symbol}
        value={props.value}
        itemName={props.itemName}
      />
      <ExpiredTimer timeout={59} />
      <div style={{
      width: 238,
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 23,
    }}>
        <button onClick={props.onCancleClick} style={cancelStyle}>Cancel</button>
        <button onClick={props.onSendClick} style={sentStyle}>Sent</button>
      </div>
    </>
  )
}
