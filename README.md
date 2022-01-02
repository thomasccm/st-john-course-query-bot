# st-john-course-query-bot

A simple Telegram bot used to retrieve St John one day renew course (ODRC) data. You can start using it by searching [@StJohnRenewQueryBot](https://t.me/StJohnRenewQueryBot) on Telegram.

## Installation

1. Make sure you have [Node.js](http://nodejs.org/) and the [Heroku CLI](https://cli.heroku.com/) installed.

2. Run following command

		$ git clone https://github.com/thomasccm/st-john-course-query-bot.git # or clone your own fork
		$ cd st-john-course-query-bot
		$ npm install
	
3. Create your .env file by running following command, and customize your own version

		### MacOS
		$ cp env.example .env

		### Windows
		$ copy env.example .env

## Running Locally

```sh
$ npm start
```

Your app should now be running on [localhost:3000](http://localhost:3000/).

## Deploying to Heroku

```sh
$ heroku create YOUR_APP_NAME
$ heroku git:remote -a YOUR_APP_NAME
$ git push heroku master
```
or

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

---
#### Set a config var
```sh
$ heroku config:set APP_ENV=prd ^
  BOT_API_TOKEN_PRD=YOUR_TOKEN_FROM_BOT_FATHER ^
  URL=YOUR_HEROKU_APP_URL
```
#### Review current config var values
```sh
$ heroku config
```
Then you should get following output:
```sh
=== YOUR_APP_NAME Config Vars
APP_ENV:			prd
BOT_API_TOKEN_PRD:	YOUR_TOKEN_FROM_BOT_FATHER
URL:				YOUR_HEROKU_APP_URL
```
or 

You can also edit config vars from your app’s `Settings` tab in the [Heroku Dashboard](https://dashboard.heroku.com/):

![Config Vars in Dashboard](https://devcenter1.assets.heroku.com/article-images/321-imported-1443570183-321-imported-1443554644-389-original.jpg)

## Documentation

For more information, see these Dev Center articles:

- [Getting Started on Heroku with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Github - heroku/node-js-getting-started](https://github.com/heroku/node-js-getting-started)
- [Github - telegraf/telegraf](https://github.com/telegraf/telegraf)
- [Telegraf: Modern Telegram Bot Framework for Node.js](https://telegraf.js.org/)