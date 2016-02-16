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
      // TODO: kebab case? camel case? snake case?
    }

    let generatedPhrase = words.join(this.state.separator);
    this.setState({words, generatedPhrase}, this.copyToClipboard);
  },
  copyToClipboard: function() {
    // store initial cursor position
    let el = this.phraseInput,
        selectionStart = el.selectionStart,
        selectionEnd = el.selectionEnd;

    if (!el.value) return;

    el.select();

    try {
      // Now that we've selected the text, execute the copy command
      var successful = document.execCommand('copy');
      if (successful) {
        // TODO: clear this attached handler to refresh the message on each click <<<<---
        $('#passphrase .copied-success').show().delay(500).fadeOut(2000);

        // Remove the selection and replace cursor where it was
        window.getSelection().removeAllRanges();
        el.setSelectionRange(selectionStart, selectionEnd);

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
  showAltMessage: function() {
    $('#passphrase .copy-failed').show().delay(4000).fadeOut(2000);
  },
  render: function() {
    let phrase = this.state.generatedPhrase;

    return (
      <section>
        <div id="title">
          <h1>Passphrase</h1>
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
          <div className="message-area">
            <p className="copied-success">Your phrase has been copied to your clipboard</p>
            <p className="copy-failed">Press &#8984;+C (Mac) or Ctrl+C (Windows) to copy your passphrase</p>
          </div>
          <div className="button-group">
            <button
              id="generate"
              className="primary"
              onClick={this.generatePhrase}>
              Generate
            </button>
            <CopyButton onClick={this.copyToClipboard} phrase={phrase} />
          </div>
        </div>
      </section>
    );
  }
});

const CopyButton = React.createClass({
  render: function() {
    if (this.props.phrase) {
     return (
        <button
          id="copy-to-clipboard"
          className="secondary"
          onClick={this.props.onClick}>
          Copy
        </button>
      );
    } else return null;
  }
});

renderDOM(
  <PassphraseGenerator />,
  document.getElementById('react')
);
