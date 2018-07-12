$(document).ready(function(){
  //jquery objects
  let $body = $('body');
  let $trendsDisplay = $('.trends-display');
  let $tweetForm = $('.tweet-form');

  // state variables
  let targetUser = 'all';
  let targetTrend = '';
  //let lastTweetRendered = 0;
  //TODO: don't re-render entire page, only add new tweets, or update elements

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

  // add likes
  const addLike = (tweetIndex, tweetTextContent = '') => {
    streams.home[tweetIndex].likes = streams.home[tweetIndex].likes + 1;
    let newLikeCount = streams.home[tweetIndex].likes;
    console.log(`Liked "${tweetTextContent}"! Total likes: `, newLikeCount);
  };

  // event handlers
  $trendsDisplay.on('click', '.trend', function() {
    filterTrend($(this).context.textContent);
  });

  $body.on('click', '.user-link', function() {
    filterUser($(this).context.dataset.user);
  });

  $body.on('click', '.tweet', function() {
    addLike($(this).context.dataset.homeindex, $(this).context.children[1].children[1].innerText);
  });

  $tweetForm.on('submit', function(event) {
    event.preventDefault();
    let $tweetTextbox = $('.tweet-textbox');
    if ($tweetTextbox.val()) {
      writeTweet($tweetTextbox.val());
      //targetUser = 'all';
      renderDisplay();
    }
    $tweetTextbox.val('');
  });

  // renderers
  const renderFollowers = () => {
    let $followers = $('.followers');
    $followers.html('');

    //users is window property from data_generator.js
    users.forEach((user) => {
      let $follower = $(`<p class="${user} follower user-link" data-user="${user}">@${user}</p>`);
      $followers.append($follower);
    });
   };

  const renderTrends = () => {
    let trends = Object.keys(streams.trends);
    
    let $trends = $('.trends');
    $trends.html('');
    
    trends.forEach((trend) => {
      let $trend = $(`<h3 class="trend">${trend}</h3>`);
      if (trend) $trends.append($trend);
    });
   };

  const renderProfile = () => {
    let numVisitorTweets = streams.users.visitor.length;

     let numVisitorFollowers = Math.floor((new Date() - 1499999999999) / 1000);
     let $userHandle = $(`<h2 class="visitor user-handle user-link" data-user="visitor">@visitor</h2>`);
     let $tweetCount = $(`<p class="tweet-count">${numVisitorTweets} tweets</p>`);
     let $followerCount = $(`<p class="follower-count">${numVisitorFollowers.toLocaleString()} followers</p>`);

     let $profileData = $('.profile-data');
     $profileData.html('');
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

    //let index = (shouldRenderAll) ? 0 : lastTweetRendered;
    let index = tweets.length - 1;
    for (let i = index; i >= 0; i--) {
      let tweet = tweets[i];

      let $tweet = $(`<div class="tweet" data-homeindex="${tweet.homeIndex}"></div>`);
      let $avatar = $(`<div class="avatar-img-container"><img src="images/${tweet.user}.png" class="${tweet.user} avatar-img user-link" data-user="${tweet.user}"/></div>`);
      let $content = $(`<div class="content"></div>`);
      
      let $user = $(`<p class="${tweet.user} handle user-link" data-user="${tweet.user}">@${tweet.user}</p>`);
      let $message = $(`<p class="message">${tweet.message}</p>`);
      let $created_at = $(`<p class="time">${moment(tweet.created_at).fromNow()}</p>`);
  
      $content.append($user, $message, $created_at);
      $tweet.append($avatar, $content);
      $tweetsDisplay.append($tweet);
    }
    //lastTweetRendered = tweets.length - 1;
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