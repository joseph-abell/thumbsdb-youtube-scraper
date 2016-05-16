var casper = require('casper').create();
var fs = require('fs');

var content = fs.read('results/urls.js');
content = JSON.parse(content);

content = content.listOfUrls;
var shallContinue = true;
var urlInteger = 0;

var newContent = [];

casper.start('https://google.com', function () {
	console.log('Loading each page, to scrape content. Scraping ' + content.length + " urls");
})

function cycleThroughUrls () {
	casper.thenOpen(content[urlInteger], function () {
		var _ = this;

		var title = _.getElementInfo('#eow-title');
		title = title.attributes.title;
		
		var description = _.getElementInfo('#eow-description');
		description = description.html;
		despription = JSON.stringify(description);
		description = description.replace(/<br><br>[\s\S].*/g, '');
		
		var links = _.getElementInfo('#eow-description');
		links = links.html;
		links = JSON.stringify(links);
		links = links.split('<br>');

		var cleanedUpLinks = [];
		for (var i = 0; i < links.length; i++) {
			var link = links[i];

			if (link.substring(0, 2) == "<a") {
				cleanedUpLinks[cleanedUpLinks.length] = link
			}
		}

		links = [];
		for (var j = 0; j < cleanedUpLinks.length; j++) {
			var cleanedUpLink = cleanedUpLinks[j];
			var url = cleanedUpLink.replace(/( — [\s\S].*)/g, '');

			var seekTo = url.replace(/(<a[\s\S].*seekTo\()/g, '');
			seekTo = seekTo.replace(/\)[\s\S].*/g, '');

			var time = cleanedUpLink;
			time = time.replace(/<a[\s\S].*">/g, '');
			time = time.replace(/<\/a>[\s\S].*/g, '');
			
			var text = cleanedUpLink;
			text = text.replace(/<a [\s\S].* — /g, '')
			
			links[j] = {
				url: url,
				seekTo: seekTo,
				time: time,
				text: text
			}
		}
		
		newContent[newContent.length] = {
			title: title,
			description: description,
			links: links
		}

		if (urlInteger < content.length) {
			console.log('Scraping ' + JSON.stringify(content[urlInteger]) + '. ' + urlInteger + " out of " + content.length);
			urlInteger = ++urlInteger;
			cycleThroughUrls();
		} else {
			goToEnd();
		}
	})
}

function goToEnd () {
	console.log('Writing file');
	fs.write('results/result.js', JSON.stringify(newContent), 'w');	
}

casper.run();
cycleThroughUrls();

