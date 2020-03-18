import React from "react";
import Message from "./Message";

export default function InfoMessage(props: React.Props<any>) {
  return <Message color={"blue"}>{props.children}</Message>;
}
