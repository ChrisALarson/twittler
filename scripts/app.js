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
    return newLikeCount;
  };

  const addRetweet = (tweetIndex, tweetTextContent = '', tweetUser = '') => {
    streams.home[tweetIndex].retweets = streams.home[tweetIndex].retweets + 1;
    let newRetweetCount = streams.home[tweetIndex].retweets;
    let message = `RT: @${tweetUser}: ${tweetTextContent}`;
    writeTweet(message);
    renderDisplay();
    console.log(`Retweeted "${tweetTextContent}"! Total retweets: `, newRetweetCount);
    return newRetweetCount;
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
    let newLikeCount = addLike(tweetIndex, tweetText);
    $(this).context.nextSibling.innerHTML = newLikeCount.toString() + ' likes';
  });

  $body.on('click', '.retweet', function() {
    let tweetIndex = $(this).context.parentElement.parentElement.dataset.homeindex;
    let tweetText = $(this).context.parentElement.parentElement.children[1].children[1].innerText;
    let tweetUser = $(this).context.parentElement.parentElement.children[1].children[0].dataset.user;
    let newRetweetCount = addRetweet(tweetIndex, tweetText, tweetUser);
    $(this).context.nextSibling.innerHTML = newRetweetCount.toString() + ' retweets';
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
    let $profileImageContainer = $('.profile-img-container');
    $profileImageContainer.html('');

    let user = (targetUser === 'all' || targetTrend) ? 'visitor' : targetUser;
    let numUserTweets = streams.users[user].length;
    // generating number of followers based on current date (for us) or user name (for prebuilt users)
    let numUserFollowers = (user === 'visitor') ? Math.floor((new Date() - 1499999999999) / 1000) : user.split('').reduce((acc, element) => acc + element.charCodeAt(), 0) * 2;    

    let $userProfileImg = $(`<img src="images/${user}.png" alt="Profile Picture" class="profile-img user-link" data-user="${user}"></img>`)
    $profileImageContainer.append($userProfileImg);

    let $userHandle = $(`<h2 class="user-handle user-link" data-user="${user}">@${user}</h2>`);
    let $tweetCount = $(`<p class="tweet-count user-link" data-user="${user}">${numUserTweets} tweets</p>`);
    let $followerCount = $(`<p class="follower-count">${numUserFollowers.toLocaleString()} followers</p>`);
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
  
      let $retweetButton = $(`<button class="tweet-action retweet">RT!</div>`);
      let $numRetweets = $(`<p class="retweets-display">${tweet.retweets} retweets</p>`);
      let $likeButton = $(`<button class="tweet-action like">+1</div>`);
      let $numLikes = $(`<p class="likes-display">${tweet.likes} likes</p>`);
      $buttons.append($likeButton, $numLikes, $retweetButton, $numRetweets);

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
  setInterval(renderDisplay, 10000);
});