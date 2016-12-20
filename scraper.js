var casper = require('casper').create();
var fs = require('fs');

var scraper = {
	urls: [],
	finalContent: [],

	init: function () {
		var current = this;

		console.log("Collating a list of videos.");

		casper.start('https://www.youtube.com/user/idlevideos/videos', function () {
			var _ = this;

			current.clickMoreButton(_);
		});

		casper.run();
	},

	clickMoreButton: function (_) {
		console.log('Loading more videos...');

		if(_.exists('.yt-uix-load-more-error') === false) {
			_.click('.browse-items-load-more-button');
			_.wait(2000, scraper.clickMoreButton);
		} else {
			scraper.grabAllLinks(_);
		}
	},

	grabAllLinks: function  (_) {
		var current = this;
		var links = _.getElementsInfo('.yt-uix-tile-link');
		var linkId = 0;

		console.log("Saving links so we can start scraping content from urls.");
		for (linkId; linkId < links.length; linkId++) {
			current.urls[linkId] = "https://youtube.com" + links[linkId].attributes.href;
		}

		scraper.compileResultFromUrls();
	},

	compileResultFromUrls: function () {
		var current = this;

		for (var urlId = 0; urlId < current.urls.length; urlId++) {
			var url = current.urls[urlId];

			if (urlId === current.urls.length - 1) {
				current.addUrlDataToResult(url, true);	
			} else {
				current.addUrlDataToResult(url, false);
			}
		}
	},

	addUrlDataToResult: function (url, isLastUrl) {
		var current = this;

		casper.thenOpen(url, function () {
			var _ = this;
			var title = _.getElementInfo('#eow-title').attributes.title;
			var description = current.cleanupDescription(_.getElementInfo('#eow-description').html);
			var links = current.cleanupLinks(_.getElementInfo('#eow-description').html);

			current.addLinkToJson(title, description, links);

			if (isLastUrl) {
				current.pushContentToFile();
			}
		});
	},

	cleanupDescription: function (description) {
		description = JSON.stringify(description);
		description = description.replace(/<br><br>[\s\S].*/g, '');

		return description;
	},

	cleanupLinks: function (links) {
		var cleanLinks = [];
		var linkId = 0;

		links = JSON.stringify(links);
		links = links.split('<br>');

		for (linkId; linkId < links.length; linkId++) {
			var link = links[linkId];

			if (link.substring(0, 2) == "<a") {
				cleanLinks[cleanLinks.length] = link;
			}
		}

		return cleanLinks;
	},

	addLinkToJson: function (title, description, links) {
		console.log(title);
		var current = this;
		var linkId = 0;
		var newLinks = [];

		for (linkId; linkId < links.length; linkId++) {
			var link = links[linkId];
			var url = link.replace(/( — [\s\S].*)/g, '');
			var seekTo = url.replace(/(<a[\s\S].*seekTo\()/g, '').replace(/\)[\s\S].*/g, '');
			var time = link.replace(/<a[\s\S].*">/g, '').replace(/<\/a>[\s\S].*/g, '');
			var text = link.replace(/<a [\s\S].* — /g, '');

			newLinks[linkId] = {
				url: url,
				seekTo: seekTo,
				time: time,
				text: text
			};
		}

		current.finalContent[current.finalContent.length] = {
			title: title,
			description: description,
			links: newLinks
		};
	},

	pushContentToFile: function () {
		var current = this;

		fs.write('results/result.js', JSON.stringify(current.finalContent), 'w');	
	}
};

scraper.init();