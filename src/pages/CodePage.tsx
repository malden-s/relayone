import React from "react";

import PageWrapper from "../components/PageWrapper";
import InfoMessage from "../components/InfoMessage";
import Code from "../components/Code";

interface Props {
  code: string;
}

export default function CodePage(props: Props) {
  return (
    <PageWrapper
      header={
        <InfoMessage>
          Enter this code into{" "}
          <span style={{ color: "rgb(156, 201, 255)" }}>RelayX app</span> to
          complete pairing
        </InfoMessage>
      }
    >
      <Code code={props.code} />
    </PageWrapper>
  );
}
