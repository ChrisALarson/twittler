/*
1. Show new tweets from the tweeters (via button push or/ auto refresuh)
  // display streams.home tweet object
    "displayTweets" function, and interval to execute the functioon
   // Create a container in the center of the home page that displays all genereated tweets.
   Optional - // Display max number of tweets ~100
   // Each tweet has its own div that displays the user, message, time stamp.
2. Display the timestamp associated with each tweet
3. Design the interface to look nice
  // Header at top of page showing Twittler title, add image/icon
// Footer to indicate bottom of page
// Optional display user profile top left and trends panel under the user profile.
4. Enable displaying a specific tweeter's timeline
*/

/* 
 filter based on link click?
*/


$(document).ready(function(){
  var $body = $('body');
  let $tweetsContainer = $(".tweets-container");
 
  let targetUser = "";

  const filterUser = (userName) => {
    targetUser = userName;
    renderTweets();
  };

  $('.tweets-container').on("click", "h4", function() {
    filterUser($(this).context.textContent.substr(1));
  });


  $('.tweets-container').on("click", "img", function() {
    filterUser($(this).context.className);
  });


  $('.home').click(function() {
    filterUser($(this).context.value);
  });


  $('#tweet-form').submit(function(event) {
    event.preventDefault();
    let $tweetTextbox = $('#tweet-textbox');
    if ($tweetTextbox.val()) {
      writeTweet($tweetTextbox.val());
      renderTweets();
    }
    $tweetTextbox.val('');
  });


  const renderTweets = () => {
    $tweetsContainer.html('');
    let tweetArr = (targetUser) ? streams.users[targetUser] : streams.home;

    var index = tweetArr.length - 1;
    while(index >= 0){
      var tweet = tweetArr[index];
      var $tweet = $(`<div class="tweet"></div>`);

      let $avatar = $(`<div class="avatar"><img src="images/${tweet.user}.png" class="${tweet.user}"/></div>`);

      let $content = $(`<div class="content"></div>`);
      let $user = $(`<h4>@${tweet.user}</h4>`);
      let $message = $(`<p>${tweet.message}</p>`);
      let $created_at = $(`<h6>${moment(tweet.created_at).fromNow()}</h6>`);

      $content.append($user, $message, $created_at);
      $tweet.append($avatar, $content);
      $tweet.appendTo($tweetsContainer);
      index -= 1;
     }
  };

  renderTweets();
  setInterval(renderTweets, 10000);
});