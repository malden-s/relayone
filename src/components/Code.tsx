import React from "react";

interface Props {
  code: string;
}

export default function Code(props: Props) {
  const code = props.code.padStart(6, "0");
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        color: "white"
      }}
    >
      <div style={{ display: "flex" }}>
        <div style={{ fontSize: "48px" }}>{code.slice(0, 3)}</div>
        <div style={{ width: 20 }}></div>
        <div style={{ fontSize: "48px" }}>{code.slice(3, 6)}</div>
      </div>
      <p
        style={{
          lineHeight: "24px",
          fontSize: "18px",
          textAlign: "center" as "center"
        }}
      >
        Enter code
      </p>
    </div>
  );
}
