## News-api

This news API is deployed on heroku/rapid api. https://rapidapi.com/winsor-tse/api/east-china-news

## About
This API, essientialy is a web scrapper that is able to parse through anchor tags in multiple newpaper websites and displays JSON data that is formatted like:

title: ..
url : ...
source: ...
*section: ...

There are 10 different requests that can be made to look for specific news. One example would be to filter by only Japan news. Example:

.../japan

There are more options to filter the japan news by newspaper company. Example:

.../japan/abc

There are also many other options that can be filtered, look at the deployment into the rapid api.

