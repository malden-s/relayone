import React from "react";
import Popup from "../components/Popup";

export default function UpdatePopup() {
  return (
    <Popup>
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          style={{ fill: "rgb(255,183,93)", marginRight: 10 }}
          viewBox="0 0 576 512"
        >
          <path d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z" />
        </svg>
        <div style={{ color: "white", lineHeight: "22px", fontSize: 16 }}>
          <div>Please update RelayX app.</div>
        </div>
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
