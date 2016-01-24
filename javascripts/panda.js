$(function() {

  // we will want a more modular way to store/update this - put it in a DB so we can choose words by length, commonality, part of speech, etc. - automated get updated word lists regularly?
  var wordArray = [
    'panda',
    'gumdrop',
    'pizza',
    'polo',
    'puppy',
    'window',
    'pope',
    'giraffe',
    'tower',
    'happy',
    'mountains',
    'apricot'
  ];

  // user options - words to use, separator, numbers, special chars
  var generatedPhrase,
      wordsToUse = 4;

  // generate function on user click
  $('#generate').click(function() {

    // build phrase using lodash sampleSize - is this random enough?
    generatedPhrase = _.sampleSize(wordArray, wordsToUse).join(' ');

    // display generated phrase and automatically copy to clipboard - add fallback to zeroclipboard for older browsers? make sure it works cross-browser or at least doesn't mislead user
    $('#passphrase .generated').val(generatedPhrase).select();

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
