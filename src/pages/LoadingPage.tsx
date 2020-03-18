import React from "react";

import PageWrapper from "../components/PageWrapper";
import Loader from '../components/Loader';

export default function LoadingPage() {
  return (
    <PageWrapper>
      <Loader />
    </PageWrapper>
  );
}
