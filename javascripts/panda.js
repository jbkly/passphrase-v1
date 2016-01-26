$(function() {

  // user options - words to use, separator, numbers, special chars
  var options = {
    generatedPhrase: '',
    wordCount: 4,
    capitals: 'startCase',
    separator: ' ',
    wordList: localStorage.wordArray ? JSON.parse(localStorage.wordArray) : window.wordArray,
    words: []
  };

  // generate function on user click
  $('#generate').click(function() {

    // build phrase using lodash sampleSize - is this random enough?
    options.words = _.sampleSize(options.wordList, options.wordCount);

    switch (options.capitals) {
      case 'startCase':
        options.words.forEach(function(word, i, words) {
          words[i] = _.upperFirst(word);
        });
        break;
      case 'upperCase':
        options.words.forEach(function(word, i, words) {
          words[i] = word.toUpperCase();
        });
        break;
      case 'lowerCase':
        options.words.forEach(function(word, i, words) {
          words[i] = word.toLowerCase();
        });
        break;
      // kebab case? camel case? snake case?
    }

    options.generatedPhrase = options.words.join(options.separator);

    // display generated phrase and automatically copy to clipboard - add fallback to zeroclipboard for older browsers? make sure it works cross-browser or at least doesn't mislead user
    $('#passphrase .generated').val(options.generatedPhrase).select();

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

  });

});
