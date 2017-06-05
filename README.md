# SCM Music Player

<http://scmplayer.net>

## Introduction

SCM Music Player is a free and open source web music player, that brings a seamless music experience to your website:

* __Continous Playback Cross Pages__ - Seamless playback throughout your website.
* __Full Featured Control__ - Play, pause, next, previous, seek, shuffle, repeat mode, volume and more.
* __Custom Skins__ - Match your look and feel. Choose or design your own skin with CSS.
* __Dynamic Playlist__ - Music from various sources: MP3, SoundCloud, Youtube, RSS in HTML5 or Flash.
* __Flexible UI__ - Dockable player on top or bottom. Playlist can be toggled.
* __Setup Wizard__ - Create your SCM Music Player without any pain.

This is the Github repository of SCM Music Player. You can fork my source code, report issues or feature request. 

## Usage

Normally you don't need to download anything to use SCM Music Player. Just go to http://scmplayer.net and get the script via Setup Wizard. But if you want to self host or customize the source code, it is free to do so under the GNU General Public License.

To start with, place files into your server, run __index.html__ and you will be redirected to the Setup Wizard, configured for your self hosted SCM Music Player.

## API
SCM Music Player provides full featured control on your music. Apart from Setup Wizard, you can also control SCM Music Player via Javascript. The script exposes SCM to global scope with the following methods.

#### SCM.play() 
Plays the current song.
#### SCM.pause();
Pause the currently playing song.
#### SCM.previous();
Loads the previous song in playlist.
#### SCM.next();
Loads the next song in playlist.
#### SCM.queue({title:'x',url:'y'});
Queue a song title x url y to the playlist.
#### SCM.play({title:'x',url:'y'});
Add a song title x url y to the playlist and play it.
#### SCM.volume(vol);
Sets the volume. Accepts an integer vol between `0` and `100`.
#### SCM.skin('x');
Change skin of SCM Music Player, with x being the link to a custom skin css file.
#### SCM.placement(pos);
Change placement of the player bar. Accepts a string pos `"top"` or `"bottom"`
#### SCM.loadPlaylist('x');
Loads the specified playlist url x.
#### SCM.loadPlaylist([{title:'x1',url:'y1'}, {title:'x2',url:'y2'}, ...]);
Loads the specified list of songs with their title and url respectively.
#### SCM.repeatMode(no);
Set the repeat mode of playlist. Accepted values of no are:
`0` (play playlist once), `1` (repeat playlist), `2` (repeat item).
#### SCM.isShuffle(x);
Set whether playback order should be shuffled. Accepts a boolean x `true` or `false`.
#### SCM.showPlaylist(x);
Set whether playlist is being shown. Accepts a boolean x 	`true` or `false`.

## Credits
SCM Music Player is made possible with these open source projects:

* [Soundmanager 2](http://www.schillmania.com/projects/soundmanager2/) - Javascript Sound API supporting HTML5 and Flash.
* [Knockout.js](http://knockoutjs.com/) - Javascript MVVM framework does data binding and dependency tracking.
* [Require.js](http://requirejs.org/) - Javascript Module loader using AMD (Asynchronous Module Definition).
* [Underscore.js](http://underscorejs.org/) - Javascript utility library.
* [jQuery](http://jquery.com/).

## License

Copyright 2015 Adrian C Shum

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

<http://www.gnu.org/licenses/>
