import React from 'react';

export default function SuccessPopup(props) {
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
        height: 250,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{
          background: 'rgb(109, 193, 16)',
          width: 96,
          height: 96,
          border: '10px solid rgb(49, 65, 77)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <img
            src={require('../images/success.png')}
            style={{
              width: 50,
              height: 40
            }}
          />
        </div>
        <div style={{color: 'white'}}>
          <div>{`You've just set ${props.address}`}</div>
          <div style={{
            textAlign: 'center', marginTop: 10
          }}>{`${props.sign} ${props.amount}`}</div>
        </div>
        <button style={sentStyle} onClick={props.cancel}>Close</button>
      </div>
    </>
  )
}
