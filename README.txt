-----------------------------------------------------------------
How to start the backend server?
-----------------------------------------------------------------
1) Use yarn or npm to install the packages
          - yarn or npm install

2) Run the start script
          - yarn start 
          - npm run start

-----------------------------------------------------------------
Backend Server built using:
-----------------------------------------------------------------
* NodeJS + Express
* MongoDB (Atlas Cloud)

-----------------------------------------------------------------
Missing from Task 1: Section 2
* Chatting with other users

Missing from Task 1: Section 3
* Threading
-----------------------------------------------------------------

-----------------------------------------------------------------
Authentication
-----------------------------------------------------------------
[POST] ~ /auth/register
          - Required username + password in body
          - Optional email

[POST] ~ /auth/login
          - Required username + password in body
          - Creates a access_token after successful login

[GET] ~ /auth/users 
          - Add "access-token" in header to authenticate
          - Shows all users in database

-----------------------------------------------------------------
Tweets - All routes below require "access-token" in the header
-----------------------------------------------------------------
[GET] ~ /tweets
          - Shows all tweets created by users

[GET] ~ /tweets/:tweet_id
          - Finds a tweet by id

[POST] ~ /tweets/create
          - Creates a new tweet

[POST] ~ /tweets/:tweet_id/update
          - Updates an existing tweet

[POST] ~ /tweets/:tweet_id/delete
          - Deletes an existing tweet

[POST] ~ /tweets/:tweet_id/like
          - Likes a tweet (User ID is added to show who liked a tweet)

[POST] ~ /tweets/:tweet_id/unlike
          - If there is a like removes the like from the history 

[POST] ~ /tweets/:tweet_id/retweet
          - Retweets (Adds the tweet to the user's profile and 
          adds user Id to the original tweet)

-----------------------------------------------------------------
Chats
-----------------------------------------------------------------
- Not Implemented
