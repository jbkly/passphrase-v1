import React from 'react';
import { render as renderDOM} from 'react-dom';
import _ from 'lodash';

const PassphraseGenerator = React.createClass({
  getInitialState: function() {
    return {
      generatedPhrase: '',
      wordCount: 4,
      capitals: 'startCase',
      separator: ' ',
      wordList: localStorage.wordArray ? JSON.parse(localStorage.wordArray) : window.wordArray,
      words: []
    }
  },
  componentDidMount: function() {

  },
  generatePhrase: function() {
    // build phrase using lodash sampleSize - is this random enough?
    let words = _.sampleSize(this.state.wordList, this.state.wordCount);

    switch (this.state.capitals) {
      case 'startCase':
        words.forEach((word, i, words) => words[i] = _.upperFirst(word));
        break;
      case 'upperCase':
        words.forEach((word, i, words) => words[i] = word.toUpperCase());
        break;
      case 'lowerCase':
        words.forEach((word, i, words) => words[i] = word.toLowerCase());
        break;
      // kebab case? camel case? snake case?
    }

    let generatedPhrase = words.join(this.state.separator);
    this.setState({words, generatedPhrase}, this.copyToClipboard);
  },
  copyToClipboard: function() {
    this.logCurrentPhrase();
    this.phraseInput.select();

    try {
      // Now that we've selected the text, execute the copy command
      var successful = document.execCommand('copy');
      if (successful) {
        $('#passphrase .copied-success').show().delay(3000).fadeOut(1000);

        // Remove the selections
        window.getSelection().removeAllRanges();
      } else {
        this.showAltMessage();
      }
    } catch(err) {
      this.showAltMessage();
    }
  },
  handlePhraseChange: function(event) {
    this.setState({generatedPhrase: event.target.value}, this.copyToClipboard);
  },
  logCurrentPhrase: function() {
    console.log(`${this.state.generatedPhrase}`);
  },
  showAltMessage: function() {
    $('#passphrase .copy-failed').show().delay(4000).fadeOut(2000);
  },
  render: function() {
    return (
      <section>
        <div id="title">
          <h1>Passphrase {Date.now()}</h1>
          <p>Instantly generate secure, memorable passphrases</p>
        </div>

        <div id="passphrase">
          <input
            type="text"
            className="generated"
            ref={(input) => this.phraseInput = input}
            value={this.state.generatedPhrase}
            onChange={this.handlePhraseChange}
          />
          <button id="generate" className="go" onClick={this.generatePhrase} >Generate</button>
          <p className="copied-success">Your phrase has been copied to your clipboard</p>
          <p className="copy-failed">Press &#8984;+C (Mac) or Ctrl+C (Windows) to copy your passphrase</p>
        </div>
      </section>
    );
  }
});

renderDOM(
  <PassphraseGenerator />,
  document.getElementById('react')
);
