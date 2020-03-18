import React from "react";
import Popup from "../components/Popup";

export default function SignInNewTabPopup() {
  return (
    <Popup height={'400px'}>
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
        >
          ✕
        </span>
      </div>
      <div style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          color: 'white',
          fontSize: 16,
          width: 197,
          textAlign: 'center',
        }}>
          Please pair with RelayX to enable spending
        </div>
        <a
          style={{
            color: "white",
            display: "block",
            textDecoration: "none",
            backgroundColor: "rgb(38, 105, 255)",
            padding: 10,
            borderRadius: 5,
            width: 130,
            marginTop: 10,
            textAlign: 'center',
          }}
          href={window.location.href}
          rel="noopener noreferrer"
          target="_blank"
        >
          Open in new tab
        </a>
      </div>
      <div style={{
        color: 'rgb(74, 144, 226)',
        textAlign: 'center',
        position: 'relative',
        bottom: -40,
        fontSize: 12,
      }}>
        Don’t have RelayX?
      </div>
      <div
        style={{
          margin: "0 auto",
          width: 200,
          display: "flex",
          justifyContent: "space-around"
        }}
      >
        <img
          style={{ width: 42, height: 42 }}
          src={require("../images/icon.png")}
          alt=""
        />
        <div
          style={{ cursor: "pointer" }}
          onClick={() =>
            window.open("http://go.appurl.cc/79813781441", "_blank")
          }
        >
          <div>
            <span
              style={{
                color: "#fff",
                lineHeight: "22px",
                fontSize: "14px"
              }}
            >
              <span style={{ fontWeight: "bold" }}>RelayX</span> Superwallet
            </span>
          </div>
          <div style={{ display: "flex" }}>
            <span
              style={{
                color: "#fff",
                lineHeight: "20px",
                fontSize: "14px"
              }}
            >
              Download now
            </span>
            <img
              style={{ width: 12, height: 20 }}
              src={require("../images/next.png")}
              alt=""
            />
          </div>
        </div>
      </div>
    </Popup>
  );
}
