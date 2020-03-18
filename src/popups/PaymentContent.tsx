import React from 'react';
import CurrencyDropdown from '../components/CurrencyDropdown';


export default function PaymentPopup(props) {
  return (
    <>
      <div
          style={{
            position: "absolute",
            right: 10,
            top: 10,
            cursor: "pointer"
          }}
          className={"relay-one-close"}
        >
          <span
            style={{
              display: "block",
              cursor: "pointer",
              background: "rgb(101, 125, 149)",
              borderRadius: "50%",
              width: 16,
              height: 16,
              textAlign: "center",
              padding: 2,
              fontSize: 12,
              color: "rgb(17, 26, 44)"
            }}
            onClick={props.onClick}
          >
            ✕
          </span>
        </div>
        <div style={{
          color: 'white',
          fontSize: 16,
          textAlign: 'center',
        }}>
          Confirm
        </div>
        <div style={{color: 'rgb(151, 151, 151)', fontSize: 14}}>
          <div>Item</div>
          <div>{'Item name'}</div>
        </div>
        <div style={{ width: 242, display: 'flex', justifyContent: 'space-between'}}>
          <span style={{color: 'rgb(151, 151, 151)'}}>Pay</span>
          <span style={{color: 'white'}}>{props.sign} {props.amount}</span>
        </div>
        <span style={{color: 'white'}}>I'm paying with</span>
        <div style={{
          widows: 242,
          height: 33,
          background: 'rgb(44, 54, 78)',
          color: 'white',
          textAlign: "center"
        }}>
            <CurrencyDropdown
              currency={props.currency}
              onChange={props.onChange}
              options={props.options}
            />
          </div>
        <div style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <button
            style={{
              color: "white",
              display: "block",
              textDecoration: "none",
              backgroundColor: "rgb(38, 105, 255)",
              padding: 10,
              borderRadius: 5,
              width: 130,
              border: 'none',
              marginTop: 10,
              textAlign: 'center',
            }}
            onClick={props.onNextButtonClick}
          >
            Next
          </button>
        </div>
    </>
  )
}
