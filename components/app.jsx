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
    this.state.words = _.sampleSize(this.state.wordList, this.state.wordCount);

    switch (this.state.capitals) {
      case 'startCase':
        this.state.words.forEach(function(word, i, words) {
          words[i] = _.upperFirst(word);
        });
        break;
      case 'upperCase':
        this.state.words.forEach(function(word, i, words) {
          words[i] = word.toUpperCase();
        });
        break;
      case 'lowerCase':
        this.state.words.forEach(function(word, i, words) {
          words[i] = word.toLowerCase();
        });
        break;
      // kebab case? camel case? snake case?
    }

    this.state.generatedPhrase = this.state.words.join(this.state.separator);

    // display generated phrase and automatically copy to clipboard - add fallback to zeroclipboard for older browsers? make sure it works cross-browser or at least doesn't mislead user
    $('#passphrase .generated').val(this.state.generatedPhrase).select();

    try {
      // Now that we've selected the text, execute the copy command
      var successful = document.execCommand('copy');
      if (successful) {
        $('#passphrase .copied-success').show().delay(2000).fadeOut(1000);

        // Remove the selections
        window.getSelection().removeAllRanges();
      }
    } catch(err) {
      console.log('Oops, unable to copy');
    }
  },
  render: function() {
    return (
      <section>
        <div id="title">
          <h1>Passphrase Pam</h1>
          <p>Instantly generate secure, memorable passphrases</p>
        </div>

        <div id="passphrase">
          <input type="text" className="generated" />
          <button id="generate" className="go" onClick={this.generatePhrase} >Generate</button>
          <p className="copied-success">Your phrase has been copied to your clipboard</p>
        </div>
      </section>
    );
  }
});

renderDOM(
  <PassphraseGenerator />,
  document.getElementById('react')
);
