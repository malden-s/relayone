import React from "react";

import PageWrapper from "../components/PageWrapper";
import ContentContainer from "../components/ContentContainer";
import FooterWithQuestion from "../components/FooterWithQuestion";

interface Props {
  url: string;
}

export default function OpenApp(props: Props) {
  return (
    <PageWrapper
      footer={<FooterWithQuestion question={'Don’t have RelayX?'} />}
    >
      <ContentContainer text={"Open App"} primary={true} url={props.url} authMessage={"Authorize in RelayX"} />
    </PageWrapper>
  );
}
