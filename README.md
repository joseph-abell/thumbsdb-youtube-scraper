# thumbsdb-youtube-scraper

[![Build Status](https://travis-ci.org/gerbilsinspace/thumbsdb-youtube-scraper.svg?branch=master)](https://travis-ci.org/gerbilsinspace/thumbsdb-youtube-scraper)

This is a small script that scrapes all the youtube videos uploaded by IdleVideos, and outputs into json.

This is pretty hacky, and involves a two step process, the first to get all the urls we will be using, and the second, to produce the JSON file.

## Prerequisites.

You will need to have nodejs and casper installed on your computer.

## Installation.

- Download the code. 
- in your command line, go to the root folder, and run npm install. 

## Run
- run casperjs urlGenerator.js
- run casperjs scraper.js
- look in the results folder, and see result.js. there will be a little clean up you need to do, such as removing inneeded escaping in the url, but other than that it should be ready for you.
