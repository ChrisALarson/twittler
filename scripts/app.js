$(document).ready(function(){
  /* 
  ------------------------------
  SETUP
  ------------------------------
  */
  
  //jquery objects
  let $body = $('body');

  // state variables
  let targetUser = 'all';
  let targetTrend = '';


  /* 
  ------------------------------
  ACTIONS
  ------------------------------
  */

  function filterUser(userName) {
    targetUser = userName;
    targetTrend = '';
    renderDisplay();
  }

  function filterTrend(trend) {
    targetTrend = trend;
    targetUser = '';
    renderDisplay();
  }

  function addLike(tweetIndex) {
    let newLikeCount = ++streams.home[tweetIndex].likes;
    return newLikeCount;
  }

  function addRetweet(tweetIndex, tweetTextContent, tweetUser) {
    let newRetweetCount = ++streams.home[tweetIndex].retweets;
    let message = `RT: @${tweetUser}: ${tweetTextContent}`;
    setTimeout(writeTweet, 150, message);
    setTimeout(renderDisplay, 150);
    return newRetweetCount;
  }

  function addComment(tweetIndex, comment) {
    let newCommentCount = streams.home[tweetIndex].comments.push(comment);
    return newCommentCount;
  }


  /* 
  ------------------------------
  EVENT HANDLERS
  ------------------------------
  */

  // viewing trend's timeline
  $body.on('click', '.trend', function() {
    let trend = $(this).context.dataset.trend;
    filterTrend(trend);
  });

  // viewing user's timeline 
  $body.on('click', '.user-link', function() {
    let user = $(this).data('user');
    filterUser(user);
  });

  // liking
  $body.on('click', '.like-button', function() {
    let tweetIndex = $(this).data('index');
    let tweetText = $(this).data('message');
    let newLikeCount = addLike(tweetIndex, tweetText);
    $(this).attr('src', 'images/like-filled.png');
    $(this).next().html(newLikeCount.toString());
  });

  // retweeting
  $body.on('click', '.retweet-button', function() {
    let tweetIndex = $(this).data('index');
    let tweetText = $(this).data('message');
    let tweetUser = $(this).data('user');
    let newRetweetCount = addRetweet(tweetIndex, tweetText, tweetUser);
    $(this).attr('src', 'images/retweet-filled.png');
    $(this).next().html(newRetweetCount.toString());
  });

  // commenting
  $body.on('click', '.comment-button', function() {
    let tweetIndex = $(this).data('index');
    let commentText = prompt('What do you think about this tweet?');
    let comment = { commenter: '@visitor', comment: commentText };
    let newCommentCount = addComment(tweetIndex, comment);
    $(this).attr('src', 'images/comment-filled.png');
    $(this).next().html(newCommentCount.toString());
  });

  // viewing comments
  $body.on('click', '.comment-display', function() {
    let tweetIndex = $(this).data('index');
    let comments = streams.home[tweetIndex].comments;
    let commentsString = comments.reduce((total, current) => {
      return total + `${current.commenter}: ${current.comment}` + '\n';
    }, '');
    alert(commentsString);
  });

  // posting tweet
  $body.on('submit', '.tweet-form', function(event) {
    event.preventDefault();
    let $tweetTextbox = $('.tweet-textbox');
    if ($tweetTextbox.val()) {
      writeTweet($tweetTextbox.val());
      renderDisplay();
    }
    $tweetTextbox.val('');
  });


  /* 
  ------------------------------
  RENDERERS
  ------------------------------
  */

 // followers aside
 function renderFollowers() {
   let $followers = $('.followers');
   $followers.html('');
   users.forEach((user) => {
     let $follower = $(`<p class="follower user-link" data-user="${user}">@${user}</p>`);
     $followers.append($follower);
   });
 }
 
 // tweets display
 function renderTweets() {
   let $tweetsDisplay = $('.tweets-display');
    $tweetsDisplay.html('');
    let tweets = getTargetTweets();
    let index = tweets.length - 1;
    for (let i = index; i >= 0; i--) {
      let tweet = tweets[i];
      let $tweet = createTweetContainer(tweet);
      $tweetsDisplay.append($tweet);
    }
  }
  
  // trends aside
  function renderTrends() {
    let $trends = $('.trends');
    $trends.html('');
    let trends = Object.keys(streams.trends);
    trends.sort((trendOne, trendTwo) => {
      let numTrendOne = streams.trends[trendOne].length;
      let numTrendTwo = streams.trends[trendTwo].length;
      return (numTrendOne >= numTrendTwo) ? -1 : 1;
    });
    trends.forEach((trend) => {
      let $trend = $(`<h3 class="trend" data-trend="${trend}">${trend}</h3>`);
      if (trend) $trends.append($trend);
    });
  }

  // profile aside
  function renderProfile() {
    let user = (targetUser === 'all' || targetTrend) ? 'visitor' : targetUser;
    let numUserTweets = streams.users[user].length;
    let numUserFollowers = makeFollowerCount(user);    

    // clear existing profile
    let $profile = $('.profile');
    $profile.html('');

    // user's image
    let $profileImageContainer = $(`<div class="profile-img-container"></div>`);
    let $userProfileImg = $(`<img src="images/${user}.png" alt="Profile Picture" class="profile-img user-link"></img>`)
    $profileImageContainer.append($userProfileImg);
    
    // user's data
    let $profileData = $(`<div class="profile-data"></div>`);
    let $userHandle = $(`<h2 class="user-handle user-link">@${user}</h2>`);
    let $tweetCount = $(`<p class="tweet-count user-link">${numUserTweets} tweets</p>`);
    let $followerCount = $(`<p class="follower-count">${numUserFollowers.toLocaleString()} followers</p>`);
    $profileData.append($userHandle, $tweetCount, $followerCount);

    //add metadata to profile elements
    $profile.append($profileImageContainer, $profileData);
    $profile.find('*').data('user', user);
  }

  function renderDisplay() {
    renderFollowers();
    renderTweets();
    renderProfile();
    renderTrends();
  }


  /* 
  ------------------------------
  UTILITY FUNCTIONS
  ------------------------------
  */

  function createTweetContainer(tweet) {
    // tweeter's avatar
    let $avatar = $(`<div class="avatar-img-container"><img src="images/${tweet.user}.png" class="avatar-img user-link"/></div>`);

    // main tweet content
    let $content = $(`<div class="tweet-content"></div>`);
    let $user = $(`<p class="handle user-link">@${tweet.user}</p>`);
    let $message = $(`<p class="message">${tweet.message}</p>`);
    let $createdAt = $(`<p class="time">${moment(tweet.created_at).fromNow()}</p>`);
    $content.append($user, $message, $createdAt);

    // tweet actions and metadata
    let $actions = $(`<div class="tweet-actions"></div>`);
    let $like = createActionContainer('like', (tweet.likes));
    let $retweet = createActionContainer('retweet', (tweet.retweets));
    let $comment = createActionContainer('comment', (tweet.comments.length));
    $actions.append($like, $retweet, $comment);

    // tweet body
    let $tweet = $(`<div class="tweet"></div>`);
    $tweet.append($avatar, $content, $actions);

    // add data attributes to all elements in tweet
    $tweet.find('*').data('user', tweet.user);
    $tweet.find('*').data('message', tweet.message);
    $tweet.find('*').data('index', tweet.homeIndex);

    return $tweet;

    // utility function
    function createActionContainer(name, prop) {
      let img = (prop) ? `${name}-filled` : `${name}`;
      let $container = $(`<div class="${name}-container tweet-data"></div>`);
      let $button = $(`<img src="images/${img}.png" alt="${name}" class="${name}-button"></img>`);
      let $numData = $(`<span class="${name}-display">${prop}</span>`);
      $container.append($button, $numData);
      return $container;
    } 
  };

  function makeFollowerCount(user) {
    let followerCount;
    if (user === 'visitor') {
      followerCount = Math.floor((new Date() - 1499999999999) / 10000);
    } else {
      followerCount = user.split('').reduce((acc, char) => acc + char.charCodeAt(), 0) * 2;
    }
    return followerCount;
  }

  function getTargetTweets() {
    let tweets;
    if (targetUser === 'all') {
      tweets = streams.home;
    } else if (targetUser) {
      tweets = streams.users[targetUser];
    } else if (targetTrend) {
      tweets = streams.trends[targetTrend];
    } else {
      return streams.home;
    }
    return tweets;
  }


  /* 
  ------------------------------
  LAUNCH APP
  ------------------------------
  */

  renderDisplay();
  setInterval(renderDisplay, 20000);
});