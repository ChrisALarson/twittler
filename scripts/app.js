$(document).ready(function(){
  let $body = $('body');
  let $tweetsDisplay = $(".tweets-display");
  let $followersDisplay = $('.followers-display');
  let targetUser = "";
  let targetTrend = "";
  let targetTweets = "all";

  const filterUser = (userName) => {
    targetUser = userName;
    targetTweets = "user";
    renderDisplay();
  };

  const filterTrend = (trend) => {
    targetTrend = trend;
    targetTweets = 'trend';
    renderDisplay();
  };

  $('.trends-display').on("click", ".trend", function() {
    filterTrend($(this).context.textContent);
  });

  $tweetsDisplay.on("click", ".handle", function() {
    filterUser($(this).context.classList[0]);
  });

  $tweetsDisplay.on("click", ".avatar-img", function() {
    filterUser($(this).context.classList[0]);
  });

  $followersDisplay.on('click', '.follower', function() {
    filterUser($(this).context.classList[0]);
  });

  $(".profile-img-container").on("click", function() {
    filterUser("visitor");
  });

  $('.logo-img-container').click(function() {
    targetTweets = 'all';
    renderDisplay();
  });

  $('.tweet-form').submit(function(event) {
    event.preventDefault();
    let $tweetTextbox = $('.tweet-textbox');
    if ($tweetTextbox.val()) {
      writeTweet($tweetTextbox.val());
      renderDisplay();
    }
    $tweetTextbox.val('');
  });

  const renderFollowers = () => {
    let usersArr = users;
    let $followers = $('.followers');
     $followers.html('');

     usersArr.forEach((user) => {
       let $follower = $(`<p class="${user} follower">@${user}</p>`);
       $followers.append($follower);
     });
   };

  const renderTrends = () => {
    let $trends = $('.trends');
     $trends.html('');
     let trends = Object.keys(streams.trends);
     trends.forEach(trend => {
      let $trend = $(`<h3 class="trend">${trend}</h3>`);

      if (trend) $trends.append($trend);
     });
   };

  const renderProfile = () => {
    let numVisitorTweets = streams.users.visitor.length;

     let numVisitorFollowers = Math.floor((new Date() - 1499999999999) / 1000);
     let $userHandle = $(`<h2 class="user-handle">@visitor</h2>`);
     let $tweetCount = $(`<p class="tweet-count">Tweets: ${numVisitorTweets}</p>`);
     let $followerCount = $(`<p class="follower-count">Followers: ${numVisitorFollowers.toLocaleString()}</p>`);

     let $profileData = $('.profile-data');
     $profileData.html('');
     $profileData.append($userHandle, $tweetCount, $followerCount);
  };

  const renderTweets = () => {
    $tweetsDisplay.html('');
    let tweetArr;
    if (targetTweets === 'all') {
      tweetArr = streams.home;
    } else if (targetTweets === 'user') {
      tweetArr = streams.users[targetUser];
    } else if (targetTweets === 'trend') {
      tweetArr = streams.trends[targetTrend];
    }

    let index = tweetArr.length - 1;
    while(index >= 0){
      let tweet = tweetArr[index];
      let $tweet = $(`<div class="tweet"></div>`);

      let $avatar = $(`<div class="avatar-img-container"><img src="images/${tweet.user}.png" class="${tweet.user} avatar-img"/></div>`);

      let $content = $(`<div class="content"></div>`);
      let $user = $(`<p class="${tweet.user} handle">@${tweet.user}</p>`);
      let $message = $(`<p class="message">${tweet.message}</p>`);
      let $created_at = $(`<p class="time">${moment(tweet.created_at).fromNow()}</p>`);

      $content.append($user, $message, $created_at);
      $tweet.append($avatar, $content);
      $tweet.appendTo($tweetsDisplay);
      index -= 1;
     }
   };

  const renderDisplay = () => {
    renderFollowers();
    renderTweets();
    renderProfile();
    renderTrends();
  };

  renderDisplay();
  setInterval(renderDisplay, 10000);
});
