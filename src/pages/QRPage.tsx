import React from "react";

import PageWrapper from "../components/PageWrapper";
import QRCode from "../components/QRCode";
import RelayFooter from "../components/RelayFooter";

const instructions = {
  lineHeight: "24px",
  fontSize: "18px",
  textAlign: "center" as "center",
  color: "white"
};

interface Props {
  url: string;
}

export default function QRPage(props: Props) {
  return (
    <PageWrapper footer={<RelayFooter />}>
      <div style={{ textAlign: "center" }}>
        <QRCode url={props.url} size={240} />
        <p style={instructions}>Scan with RelayX</p>
      </div>
    </PageWrapper>
  );
}
