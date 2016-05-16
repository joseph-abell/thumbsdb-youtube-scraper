var casper = require('casper').create();
var fs = require('fs');

var screenshot = 1;
var loadMoreButton = '.browse-items-load-more-button';
var errorButton = '.yt-uix-load-more-error';
var urls = {};

function grabAllLinks (_) {
	var arrayOfLinks = _.getElementsInfo('.yt-uix-tile-link');
	
	for (var i = 0; i < arrayOfLinks.length; i++) {
		var link = "https://youtube.com" + arrayOfLinks[i].attributes.href;
		arrayOfLinks[i] = link;
	}

	urls = {
		listOfUrls: arrayOfLinks
	};

	fs.write('results/urls.js', JSON.stringify(urls), 'w');
}

function clickMoreButton (_) {
	console.log('loading more content...');
	if(_.exists(errorButton) === false) {
		_.click(loadMoreButton);
		_.wait(2000, clickMoreButton);
	} else {
		console.log('Writing file')
		grabAllLinks(_);
	}
}

casper.start('https://www.youtube.com/user/idlevideos/videos', function () {
	var _ = this;

	clickMoreButton(_);
});

casper.run();
