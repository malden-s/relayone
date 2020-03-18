import React from "react";

interface Props {
  children: any;
  color: "blue" | "green";
  icon?: React.ReactNode;
}

const BACKGROUND = {
  blue: "rgba(74, 144, 226, 0.1)",
  green: "rgb(4, 132, 75)"
};

const COLOR = {
  blue: "rgb(74, 144, 226)",
  green: "white"
};

export default function InfoMessage(props: Props) {
  return (
    <div
      style={{
        background: BACKGROUND[props.color],
        padding: "10px 20px",
        textAlign: "center",
        fontSize: 16,
        letterSpacing: 0.13,
        lineHeight: 1.5,
        color: COLOR[props.color]
      }}
    >
      {!!props.icon && props.icon}
      {props.children}
    </div>
  );
}
