import React, { useState, useEffect } from "react";
import Message from "./Message";

interface Props extends React.Props<any> {
  timeout: number;
  color: "blue" | "green";
}

export default function SuccessMessage(props: Props) {
  const [countdown, setCountdown] = useState(props.timeout);
  useEffect(() => {
    let interval;
    if (countdown && countdown > 0)
      interval = setInterval(() => setCountdown(countdown - 0.5), 500);
    return () => {
      if (interval) clearInterval(interval);
    };
  });
  if (countdown < 1) {
    return null;
  }
  return (
    <Message color={props.color}>
      {props.children} ({countdown.toFixed(0)}s)
    </Message>
  );
}
