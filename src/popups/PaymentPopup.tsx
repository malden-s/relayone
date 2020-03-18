import React, { useState, useEffect } from 'react';
import Popup from '../components/Popup';
import QRContent from './QRContent';
import PaymentContent from './PaymentContent';
import SuccessContent from './SuccessContent';
import { fetchCurrencyRate } from '../api';


export default function PaymentPopup(props) {
  const [confirmed, setCofirmed] = useState(false);

  useEffect(() => {
    fetchCurrencyRate(props.rate).then(response => props.setRate(response.exchangeRate))
  })

  return (
    <Popup height={'411px'}>
    {props.success
    ? <SuccessContent
      cancel={props.cancel}
      amount={props.amount}
      sign={props.sign}
      onClick={props.onClick}
      address={props.address}
    />
    : confirmed
      ? <QRContent
          symbol={props.sign}
          value={props.amount}
          itemName={'ItemName'}
          onSendClick={props.onSendClick}
          onCancleClick={props.onCancelClick}
          options={props.options}
          currentService={props.currentService}
        />
      : <PaymentContent
          currency={props.currency}
          onChange={props.onChange}
          options={props.options}
          onNextButtonClick={() => setCofirmed(true)}
          onClick={props.cancel}
          amount={props.amount}
          sign={props.sign}
      />
      }
    </Popup>
  )
}
