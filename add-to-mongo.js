var parallel = require('async').parallel;
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

var mongoURL = 'mongodb://admin:FatherRecordingMilkMarriott@ds055575.mongolab.com:55575/wordlist';
var mongoCollection = 'ngram10k';

// module.exports = function() {
  var testList = [
    'panda',
    'pancake',
    'princess',
    'palindrome',
    'pillbug'
  ];

  function add_word(word, db, callback) {
    db.collection(mongoCollection).insertOne({
      'word' : word,
      'length': word.length
    }, function(err, result) {
      assert.equal(err,null);
      console.log('inserted a record into the ' + mongoCollection + ' collection.');
      callback(result);
    });
  }

  MongoClient.connect(mongoURL, function(err, db) {
    if(err) return done(err);

    var job_list = testList.map(function(word) {
      return function(callback) {
        add_word(word, db, function(err) {
          if(err) return callback(err);
          callback(null);
        });
      };

    });

    parallel(job_list, function(err) {
      if(err) return done(err);
      done(null, 'Success.');
    });
  });


// };
