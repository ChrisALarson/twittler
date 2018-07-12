// set up data structures
window.streams = {};
streams.home = [];
streams.users = {};
streams.users.shawndrost = [];
streams.users.sharksforcheap = [];
streams.users.mracus = [];
streams.users.douglascalhoun = [];
window.users = Object.keys(streams.users);

window.visitor = 'visitor';
streams.users.visitor = [];
streams.trends = {};

// utility function for adding tweets to our data structures
var addTweet = function(newTweet){
  var username = newTweet.user;
  streams.users[username].push(newTweet);
  streams.home.push(newTweet);
  if (streams.trends[newTweet.trend]) {
    streams.trends[newTweet.trend].push(newTweet);
  } else {
    streams.trends[newTweet.trend] = [newTweet];
  }

};

// utility function
var randomElement = function(array){
  var randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

// random tweet generator
var opening = ['just', '', '', '', '', 'ask me how i', 'completely', 'nearly', 'productively', 'efficiently', 'last night i', 'the president', 'that wizard', 'a ninja', 'a seedy old man'];
var verbs = ['downloaded', 'interfaced', 'deployed', 'developed', 'built', 'invented', 'experienced', 'navigated', 'aided', 'enjoyed', 'engineered', 'installed', 'debugged', 'delegated', 'automated', 'formulated', 'systematized', 'overhauled', 'computed'];
var objects = ['my', 'your', 'the', 'a', 'my', 'an entire', 'this', 'that', 'the', 'the big', 'a new form of'];
var nouns = ['cat', 'koolaid', 'system', 'city', 'worm', 'cloud', 'potato', 'money', 'way of life', 'belief system', 'security system', 'bad decision', 'future', 'life', 'pony', 'mind'];
var tags = ['#techlife', '#burningman', '#sf', 'but only i know how', 'for real', '#sxsw', '#ballin', '#omg', '#yolo', '#magic', '', '', '', ''];

var randomMessage = function(){
  return [randomElement(opening), randomElement(verbs), randomElement(objects), randomElement(nouns)].join(' ');
};

// generate random tweets on a random schedule
var generateRandomTweet = function(time){
  var tweet = {};

  tweet.user = randomElement(users);
  tweet.trend = randomElement(tags);
  tweet.message = randomMessage() + ' ' + tweet.trend;

  if (time) {
    tweet.created_at = new Date(time);
  } else {
    tweet.created_at = new Date();
  }

  addTweet(tweet);
};

for(var i = 100; i > 0; i--){
  let time = new Date() - i * 10000000;

  generateRandomTweet(time);
}

var scheduleNextTweet = function(){
  generateRandomTweet();
  setTimeout(scheduleNextTweet, Math.random() * 15000);
};
scheduleNextTweet();

// utility function for letting students add "write a tweet" functionality
// (note: not used by the rest of this file.)
let getTrend = function(message) {
  let hashIndex = message.indexOf('#');
  let spaceIndex;
  if (hashIndex > -1) {
    spaceIndex = message.indexOf(' ', hashIndex);
    if (spaceIndex < 0) spaceIndex = message.length;
  }
  if (hashIndex >-1) {
    return message.substring(hashIndex, spaceIndex);
  }
  return '';
}

var writeTweet = function(message){
  if(!visitor){
    throw new Error('set the global visitor property!');
  }
  var tweet = {};
  tweet.user = visitor;
  tweet.message = message;
  tweet.created_at = new Date();
  tweet.trend = getTrend(message);
  addTweet(tweet);
};
