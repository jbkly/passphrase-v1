import React from 'react';
import { render as renderDOM } from 'react-dom';
import { CASING_OPTIONS, DEFAULT_OPTIONS } from './options';
import _ from 'lodash'; // todo: import only modules needed from lodash

// todo: redo with updated dependencies (react, babel, yarn)
// todo: over-engineer the state management
// todo: internationalization?

const PassphraseGenerator = React.createClass({
  // todo: get/save options in localstorage
  // todo: proptypes/typing
  getInitialState: function() {
    return {
      generatedPhrase: '',
      wordList: localStorage.wordArray ? JSON.parse(localStorage.wordArray) : window.wordArray,
      words: [],
      options: DEFAULT_OPTIONS,
    }
  },
  generatePhrase: function() {
    console.log('this.state.options: ', this.state.options);
    // build phrase using lodash sampleSize - is this random enough?
    let words = [];
    // defaults for now - allow more customization
    let characterLimit = this.state.options.characterLimit ? 20 : Number.MAX_SAFE_INTEGER;
    let separator = this.state.options.useSpaces ? ' ' : '';

    // generate a set of words until one is found within 
    do {
      let wordCount = this.state.options.wordCount;
      let number = null;
      if (this.state.options.includeNumbers) {
        number = getRandomInt(0, 999);
        wordCount--;
      }

      words = _.sampleSize(this.state.wordList, wordCount);

      if (number) {
        let randomIndex = getRandomInt(0, wordCount + 1);
        words.splice(randomIndex, 0, number);
      }
    } while (this.checkPhraseLength(words) > characterLimit);

    // move logic with options?
    switch (this.state.options.casing) {
      case CASING_OPTIONS.upperCase:
        words.forEach((word, i, words) => words[i] = word.toUpperCase());
        break;
      case CASING_OPTIONS.lowerCase:
        words.forEach((word, i, words) => words[i] = word.toLowerCase());
        break;
      case CASING_OPTIONS.startCase:
      default:
        words.forEach((word, i, words) => words[i] = _.upperFirst(word));
        break;
      // TODO: kebab case? camel case? snake case?
    }

    let generatedPhrase = words.join(separator);
    this.setState({words, generatedPhrase}, this.copyToClipboard);
  },
  checkPhraseLength: function(words) {
    return words.join(this.state.options.separator).length;
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
    this.setState({ generatedPhrase: event.target.value }, this.copyToClipboard);
  },
  onOptionsChange: function(optionChanged) {
    console.log('option changed: ', optionChanged);

    if (optionChanged.hasOwnProperty('useSpaces')) {
      optionChanged.separator = optionChanged.useSpaces ? ' ' : '';
    }

    const updatedOptions = Object.assign(this.state.options, optionChanged);
    this.setState({ options: updatedOptions });
  },
  showAltMessage: function() {
    $('#passphrase .copy-failed').show().delay(4000).fadeOut(2000);
  },
  render: function() {
    let phrase = this.state.generatedPhrase;

    return (
      <section>
        <header id="title">
          <h1>Passphrase</h1>
          <p className="lead">Instantly generate secure, memorable passphrases</p>
        </header>

        <main id="passphrase">
          <input
            type="text"
            className="generated"
            ref={(input) => this.phraseInput = input}
            value={this.state.generatedPhrase}
            onChange={this.handlePhraseChange}
            placeholder="Your next passphrase..."
          />
          <div className="button-group">
            <DisplayCharCount charCount={phrase.length} />
            <button
              id="generate"
              className="primary"
              onClick={this.generatePhrase}>
              Generate
            </button>
            <CopyButton onClick={this.copyToClipboard} phrase={phrase} />
          </div>
          <div className="message-area">
            <p className="copied-success">Your phrase has been copied to your clipboard</p>
            <p className="copy-failed">Press &#8984;+C (Mac) or Ctrl+C (Windows) to copy your passphrase</p>
          </div>
          <OptionsPanel
            {...this.state.options}
            onChange={this.onOptionsChange}
          />
        </main>
        <footer>
          <article className="credits">
            <aside><a href="https://xkcd.com/936/">Why passphrases are better than passwords</a></aside>
            <aside><a href="https://github.com/jbkly/passphrase">View the Project on GitHub</a></aside>
          </article>
        </footer>
      </section>
    );
  }
});

const DisplayCharCount = React.createClass({
  render: function() {
    if (this.props.charCount) {
      return (
        <div className="display-char-count">
          <span>{this.props.charCount} characters</span>
        </div>
      );
    } else return null;

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

// todo: factor this component out
const OptionsPanel = React.createClass({
  handleChange: function(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.props.onChange && this.props.onChange({ [name]: value });
  },
  render: function() {
    return (
      <form className="options-panel">
        <h3>Options</h3>
        <label className="option">
          <input type="checkbox" name="includeNumbers" checked={this.props.includeNumbers} onChange={this.handleChange} />
          &nbsp;Include numbers
        </label>
          <label className="option">
          <input type="checkbox" name="useSpaces" checked={this.props.useSpaces} onChange={this.handleChange} />
          &nbsp;Use spaces
        </label>
        <label className="option">
          <input type="checkbox" name="characterLimit" checked={this.props.characterLimit} onChange={this.handleChange} />
          &nbsp;Limit characters
        </label>
      </form>
    );
  }
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

renderDOM(
  <PassphraseGenerator />,
  document.getElementById('react')
);
