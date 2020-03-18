import React from 'react';
import RelayFooter from './RelayFooter';

interface Props {
  question: string;
}


function FooterWithQuestion({ question }: Props) {
  return (
    <div>
      <div style={{
        textAlign: 'center',
        color: 'rgb(74, 144, 226)',
        fontSize: 12,
        marginBottom: 15
      }}>
        {question}
      </div>
      <RelayFooter />
    </div>
  )
}

export default FooterWithQuestion;
