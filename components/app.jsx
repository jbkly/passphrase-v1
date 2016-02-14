import React from 'react';
import { render } from 'react-dom'
// import { Provider } from 'react-redux'

let reactElement = document.getElementById('react');

render(
  <section>
    <div id="title">
      <h1>Passphrase 5000</h1>
      <p>Instantly generate secure, memorable passphrases</p>
    </div>

    <div id="passphrase">
      <input type="text" className="generated" />
      <button id="generate" className="go">Generate</button>
      <p className="copied-success">Your phrase has been copied to your clipboard</p>
    </div>
  </section>,
  reactElement
);
