import React from 'react';

interface Props {
  symbol: string;
  value: string;
  itemName: string;
}

export default function PaymentData(props: Props) {
  return (
    <div style={{
      color: 'white',
      textAlign: 'center',
      marginTop: 7,
    }}>
      <div style={{
        fontSize: 16,
        marginTop: 7,
      }}>
        {props.symbol} {props.value}
      </div>
      <div style={{
        fontSize: 12,
        marginTop: 7,
      }}>
        {props.itemName}
      </div>
    </div>
  )
}
