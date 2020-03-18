import React from 'react';

import './PressButton.scss';

export default function PressButton({ loading, success, onClick }) {

  function getClass() {
    if(!loading && !success) {
      return 'press-button';
    }
    if(loading) {
      return 'loading';
    }
    if(success) {
      return 'success';
    }
  }

  return (
    <div>
      <button
        className={getClass()}
        onClick={onClick}
      >
        {loading || success ? '' : '10¢'}
      </button>
    </div>
  )
}
