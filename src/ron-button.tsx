import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Slider from "./Slider";
import PaymentPopup from "./popups/PaymentPopup";
import {
  fetchPaymentMethod,
  fetchCurrencyRate,
  orderCancel,
  orderPaid,
  mockData,
  getOrderList,
  getSpecificOrder
} from "./api";

const noop = () => {};

interface Option {
  paymentId: number;
  paymentName: string;
  paymentType: number;
  sign: string;
  status: number;
  symbolId: number;
  symbolName: string;
}

export function RonButton(props) {
  const [showPopup, setShowPopup] = useState(false);
  const [amount, setAmount] = useState(1);
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedOption, setSelectedOption] = useState<number>(92);
  const [rate, setRate] = useState(10024);
  const [loading, setLoading] = useState(false);
  const [orderList, setOrderList] = useState({})
  const [orderId, setOrderId] = useState('')
  const [success, setSuccess] = useState(false);

  const mappedOptions = options.map(service => {
    return {
      value: service.paymentId,
      label: service.paymentName,
      sign: service.sign,
      currency: service.symbolId
    };
  });

  const selectedValue = mappedOptions.find(o => o.value === selectedOption);

  const sign = selectedValue && selectedValue.sign;

  const currencyRate = () =>{
    return selectedValue && setRate(selectedValue.currency)
  }

  const onChangeOptions = selectedOption => {
    setSelectedOption(selectedOption);
  };

  const handleOnReachEnd = () => {
    // data from orderList
    getSpecificOrder(
      'hu1231',
      mockData.addressList,
      mockData.amount,
      mockData.payment_code,
      mockData.side)
    .then(result => setOrderId(result))
    setShowPopup(true);
  };

  const renderValue = () => {
    const value = amount / rate;
    const stringifyValue = value.toFixed(2);
    return stringifyValue.toString();
  };

  useEffect(() => {
    fetchCurrencyRate(rate).then(response => {
      setRate(response.exchangeRate);
    });
    fetchPaymentMethod().then(result => setOptions(result));
    getOrderList(mockData).then(result => {
      setOrderList(result);
      return orderId !== '' && setLoading(false);
    });
  }, []);

  const handleCancelClick = (orderId) => {
    orderCancel(orderId);
    setShowPopup(false)
  }

  const handleSendClick = (orderId) => {
    orderPaid(orderId);
    setSuccess(true);
  }

  const cancel = () => {
    setShowPopup(false)
    setSuccess(false)
  }

  return (
    (
      <>
        {!!showPopup && (
          <div
            style={{
              position: 'fixed',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(77, 74, 74, 0.459)',
              zIndex: 2,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <PaymentPopup
              currency={''}
              amount={renderValue()}
              onCancelClick={orderId => handleCancelClick(orderId)}
              onSendClick={orderId => handleSendClick(orderId)}
              options={mappedOptions}
              sign={sign}
              onChange={onChangeOptions}
              success={success}
              cancel={cancel}
              address={'1test'}
              currentService={selectedValue}
              rate={selectedValue && selectedValue.currency}
              setRate={rate => setRate(rate)}
            />
          </div>
        )}
        <Slider
          loading={loading}
          loadingMessage={"Relay One"}
          success={false}
          successMessagePrefix={"Paid"}
          editable={true}
          disabled={false}
          error={false}
          errorMessage={"Invalid"}
          onSlideComplete={noop}
          onSliderReachEnd={handleOnReachEnd}
          onSliderChange={noop}
          onInputChange={amount => setAmount(+amount)}
          currency={'$US'}
          inputValue={renderValue()}
          displayValue={renderValue()}
        />
      </>
    )
  );
}

export function render(el: HTMLElement, props: any) {
  ReactDOM.render(<RonButton props={props} />, el);
}
