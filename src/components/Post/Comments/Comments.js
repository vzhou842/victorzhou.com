// @flow
import * as React from 'react';
import Helmet from 'react-helmet';

export default function Comments() {
  return (
    <>
      <Helmet>
        <script
          defer
          src="//cdn.commento.io/js/commento.js"
          data-css-override="/commento.min.css"
        />
      </Helmet>
      <div id="commento" />
    </>
  );
}
