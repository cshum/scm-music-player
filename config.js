var requirejs = ({
	shim: {
		'underscore': {exports: '_'},
		'jquery.ui': {deps: ['jquery'],exports: 'jQuery'},
		'jquery.scrollto': {deps: ['jquery'],exports: 'jQuery'}
	},
	paths: {
		'jquery': 'http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min',
		'jquery.ui': 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.min',
		'jquery.scrollto': 'lib/jquery/jquery.scrollTo.min',
		'underscore': 'http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.1/underscore-min',
		'knockout':'http://cdnjs.cloudflare.com/ajax/libs/knockout/2.1.0/knockout-min',

		/*
		'jquery': 'lib/jquery/jquery-1.8.2.min',
		'jquery.ui': 'lib/jquery/jquery-ui.min',
		'underscore': 'lib/underscore/underscore',
		'knockout':'lib/knockout/knockout-2.1.0',
	   */

		'text': 'lib/require/text',
		'domready': 'lib/require/domready'
	},
	config:{
		'scm':{
			playback:{
				'youtube':'(youtube.com|youtu.be)',
				'soundmanager':'.*'
			},
			playlist:{
				'youtube':'(youtube.com|youtu.be)',
				'rss':'.*'
			}
		},
		'playback/soundmanager':{
			script:'js/lib/soundmanager/soundmanager2-nodebug-jsmin.js',
			url:'swf/',
		}
	},
	waitSeconds: 90,
	baseUrl: 'js/'
});

