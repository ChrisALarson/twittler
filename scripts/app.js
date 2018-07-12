$(document).ready(function(){
  //jquery objects
  let $body = $('body');
  let $trendsDisplay = $('.trends-display');
  let $tweetForm = $('.tweet-form');

  // state variables
  let targetUser = 'all';
  let targetTrend = '';

  // filters
  const filterUser = (userName) => {
    targetUser = userName;
    targetTrend = '';
    renderDisplay();
  };

  const filterTrend = (trend) => {
    targetTrend = trend;
    targetUser = '';
    renderDisplay();
  };

  // like and retweet
  const addLike = (tweetIndex, tweetTextContent = '') => {
    streams.home[tweetIndex].likes = streams.home[tweetIndex].likes + 1;
    let newLikeCount = streams.home[tweetIndex].likes;
    console.log(`Liked "${tweetTextContent}"! Total likes: `, newLikeCount);
  };

  const addRetweet = (tweetIndex, tweetTextContent = '', tweetUser = '') => {
    streams.home[tweetIndex].retweets = streams.home[tweetIndex].retweets + 1;
    let newRetweetCount = streams.home[tweetIndex].retweets;
    let message = `RT: @${tweetUser}: ${tweetTextContent}`;
    writeTweet(message);
    renderDisplay();
    console.log(`Retweeted "${tweetTextContent}"! Total retweets: `, newRetweetCount);
  };

  // event handlers
  $trendsDisplay.on('click', '.trend', function() {
    let trend = $(this).context.dataset.trend;
    filterTrend(trend);
  });

  $body.on('click', '.user-link', function() {
    let user = $(this).context.dataset.user;
    filterUser(user);
  });

  $body.on('click', '.like', function() {
    let tweetIndex = $(this).context.parentElement.parentElement.dataset.homeindex;
    let tweetText = $(this).context.parentElement.parentElement.children[1].children[1].innerText;
    addLike(tweetIndex, tweetText);
  });

  $body.on('click', '.retweet', function() {
    let tweetIndex = $(this).context.parentElement.parentElement.dataset.homeindex;
    let tweetText = $(this).context.parentElement.parentElement.children[1].children[1].innerText;
    let tweetUser = $(this).context.parentElement.parentElement.children[1].children[0].dataset.user;
    addRetweet(tweetIndex, tweetText, tweetUser);
  });

  $tweetForm.on('submit', function(event) {
    event.preventDefault();
    let $tweetTextbox = $('.tweet-textbox');
    if ($tweetTextbox.val()) {
      writeTweet($tweetTextbox.val());
      renderDisplay();
    }
    $tweetTextbox.val('');
  });

  // renderers
  const renderFollowers = () => {
    let $followers = $('.followers');
    $followers.html('');

    users.forEach((user) => {
      let $follower = $(`<p class="follower user-link" data-user="${user}">@${user}</p>`);
      $followers.append($follower);
    });
   };

  const renderTrends = () => {
    let trends = Object.keys(streams.trends);
    trends.sort((a,b) => {
      if (streams.trends[a].length >= streams.trends[b].length) {
        return -1;
      } else if (streams.trends[a].length < streams.trends[b].length) {
        return 1;
      } else {
        return 0;
      }
    });

    let $trends = $('.trends');
    $trends.html('');
    
    trends.forEach((trend) => {
      let $trend = $(`<h3 class="trend" data-trend="${trend}">${trend}</h3>`);
      if (trend) $trends.append($trend);
    });
   };

  const renderProfile = () => {
    let $profileData = $('.profile-data');
    $profileData.html('');

    let numVisitorTweets = streams.users.visitor.length;
    let numVisitorFollowers = Math.floor((new Date() - 1499999999999) / 1000);
    let $userHandle = $(`<h2 class="user-handle user-link" data-user="visitor">@visitor</h2>`);
    let $tweetCount = $(`<p class="tweet-count">${numVisitorTweets} tweets</p>`);
    let $followerCount = $(`<p class="follower-count">${numVisitorFollowers.toLocaleString()} followers</p>`);

    $profileData.append($userHandle, $tweetCount, $followerCount);
  };

  const renderTweets = () => {
    let $tweetsDisplay = $('.tweets-display');
    $tweetsDisplay.html('');
    
    let tweets;
    if (targetUser === 'all') {
      tweets = streams.home;
    } else if (targetUser) {
      tweets = streams.users[targetUser];
    } else if (targetTrend) {
      tweets = streams.trends[targetTrend];
    }

    let index = tweets.length - 1;
    for (let i = index; i >= 0; i--) {
      let tweet = tweets[i];

      let $tweet = $(`<div class="tweet" data-homeindex="${tweet.homeIndex}"></div>`);
      let $avatar = $(`<div class="avatar-img-container"><img src="images/${tweet.user}.png" class="avatar-img user-link" data-user="${tweet.user}"/></div>`);
      let $content = $(`<div class="content"></div>`);
      let $buttons = $(`<div class="buttons"></div>`);

      let $user = $(`<p class="handle user-link" data-user="${tweet.user}">@${tweet.user}</p>`);
      let $message = $(`<p class="message">${tweet.message}</p>`);
      let $created_at = $(`<p class="time">${moment(tweet.created_at).fromNow()}</p>`);
      $content.append($user, $message, $created_at);
  
      let $retweetButton = $(`<button class="retweet">RT</div>`);
      let $likeButton = $(`<button class="like">Like</div>`);
      $buttons.append($likeButton, $retweetButton);

      $tweet.append($avatar, $content, $buttons);
      $tweetsDisplay.append($tweet);
    }
   };

  const renderDisplay = () => {
    renderFollowers();
    renderTweets();
    renderProfile();
    renderTrends();
  };

  renderDisplay();
  setInterval(renderDisplay, 8000);
});