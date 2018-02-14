Samaritan = {
	// Overall settings for the Samaritan system.
	Settings: {
		wordDisplayTime: 750,
		wordAnimationTime: 150
	},
	// Samaritan's current display state.
	DisplayState: {
		screen: undefined,
		tickTimeout: undefined,
		talking: false
	},
	HTML: {
		_: function(selector) {
			return $(selector);
			/*if (Samaritan.HTML.Store[selector] == undefined) {
				Samaritan.HTML.Store[selector] = $(selector);
			}
			return Samaritan.HTML.Store[selector];*/
		},
		Store: {}
	},
	Recognition: undefined,
	VoiceCommands: {
		'shut down': function() {
			Samaritan.display(Samaritan.Screens.SHUTDOWN);
		},
		'test': function() {
			Samaritan.Screens.WAIT.data.push("This is a test!");
		},
		'target': function() {
			Samaritan.display(Samaritan.Screens.INPUT);
		}
	},
	// The available screens Samaritan can display.
	Screens: {
		BOOT: {
			// Load sys.
			show: function(oldScreen, data) {
				Samaritan.Screens.BOOT.shouldTick = false;
				Samaritan.Screens.BOOT.data = {
					cooldown: 0,
					logIndex: 0,
				 	logLines: [
						"x0.0/sirv",
						"+0.1/ecom",
						"[eth0]",
						"[eth1]",
						"feed_1 [ ]",
						"feed_2 [ ]",
						"feed_3 [ ]",
						"feed_4 [ ]",
						"feed_5 [ ]",
						"feed_6 [ ]",
						"feed_7 [ ]",
						"feed_8 [ ]",
						"feed_9 [ ]"
					],
					loadingIndex: 0,
					loadingList: [
						"resources.comm.archive",
						"resources.im.users",
						"resources.im.log",
						"resources.rin-im",
						"resources.email.users",
						"resources.email.data",
						"resources.voip",
						"resources.dsn-messaging",
						"resources.dsn-subscribers",
						"resources.web.users",
						"resources.web.content",
						"resources.video.feeds",
						"resources.video.archive",
						"linking.databases.sigint.xxx-",
						"linking.databases.sigint.xxx-100",
						"linking.databases.sigint.xxx-140",
						"linking.databases.sigint.xxx-154",
						"linking.databases.sigint.xxx-194",
						"linking.databases.sigint.xxx-207",
						"linking.databases.sigint.xxx-248",
						"linking.databases.sigint.xxx-274",
						"linking.databases.sigint.xxx-301",
						"linking.databases.sigint.xxx-342",
						"linking.databases.sigint.xxx-400",
						"linking.databases.sigint.xxx-449",
						"linking.databases.sigint.xxx-560",
						"linking.databases.sigint.xxx-631",
						"linking.databases.sigint.xxx-798",
						"linking.databases.sigint.xxx-830",
						"linking.databases.sigint.xxx-904",
						"linking.databases.sigint.xxx-999"
					]
				}
				Samaritan.Screens.BOOT.data.loadingListLength = Samaritan.Screens.BOOT.data.loadingList.length - 1;
				Samaritan.loadBody("screens/boot.html", function() {
					Samaritan.HTML._('#content #left-pane').animate({ width: '20%' }, 1500);
					Samaritan.HTML._('#content #right-pane').animate({ width: '20%' }, 1500, function() {
						Samaritan.HTML._('#loading-pane-container')
							.animate({ opacity: 0.8 }, 200)
							.animate({ opacity: 0.1 }, 80)
							.animate({ opacity: 1 }, 200);
						Samaritan.HTML._('#loading-name, #loading-bar-container')
							.delay(300)
							.animate({ opacity: 1 }, 250, function() {
								Samaritan.Screens.BOOT.shouldTick = true;
								Samaritan.tick();
							});
					});
				});
			},
			hide: function(newScreen) {
				Samaritan.Screens.BOOT.shouldTick = false;
			},
			tick: function() {
				if (Samaritan.Screens.BOOT.data.logLines.length > 0) {
					var index  = Samaritan.Screens.BOOT.data.logIndex++;
					var line = Samaritan.Screens.BOOT.data.logLines.shift();
					Samaritan.HTML._('#boot-log').append($('<span style="color: red;">[[</span>' + (index < 10 ? ' ' : 'x') + index + (index < 10 ? ' ' : '') + '<span style="color: red;">]</span> ' + line + '<br />'));
				}
				
				if (Samaritan.Screens.BOOT.data.loadingList.length > 0) {
					var index  = Samaritan.Screens.BOOT.data.loadingIndex++;
					var line = Samaritan.Screens.BOOT.data.loadingList.shift();
					var percent = (index / Samaritan.Screens.BOOT.data.loadingListLength) * 100;
					Samaritan.HTML._('#loading-bar').animate({ width: percent + '%' }, 300, function() {
						Samaritan.HTML._('#loading-name').text(line);
					});
				} else {
					Samaritan.Screens.BOOT.shouldTick = false;
					Samaritan.HTML._('#loading-pane-container')
						.delay(1000)
						.animate({ opacity: 0 }, 800);
					Samaritan.HTML._('#loading-connected')
						.delay(2000)
						.animate({ opacity: 0.8 }, 200)
						.animate({ opacity: 0.1 }, 80)
						.animate({ opacity: 1 }, 200)
						.delay(1000)
						.animate({ opacity: 0 }, 500, function() {
							Samaritan.display(Samaritan.Screens.WAIT);
						});
					Samaritan.HTML._('#content #left-pane')
						.delay(2400)
						.animate({ width: '0%' }, 1500)
						.css({ position: 'absolute', left: '0px' })
						.animate({ left: '-10px' }, 100);
					Samaritan.HTML._('#content #right-pane')
						.delay(2400)
						.animate({ width: '0%' }, 1500)
						.css({ position: 'absolute', right: '0px' })
						.animate({ right: '-10px' }, 100);
					Samaritan.HTML._('#content #center-pane')
						.delay(2400)
						.animate({ left: '-25%', width: '150%' }, 1900);
				}
			},
			shouldTick: false,
			tickInterval: 300
		},
		WAIT: {
			// Wait for command or data input.
			show: function(oldScreen, data) {
				Samaritan.loadBody("screens/wait.html", function() {
					if (Samaritan.Recognition == undefined) {
						Samaritan.loadRecognition();
					}
					Samaritan.tick();
				});
			},
			hide: function(newScreen) {
				if (Samaritan.Recognition != undefined) {
					Samaritan.Recognition.stop();
				}
			},
			tick: function() {
				if (Samaritan.Screens.WAIT.data.length > 0) {
					Samaritan.say(Samaritan.Screens.WAIT.data.pop(), Samaritan.DisplayState.screen.tick);
				} else if (Samaritan.DisplayState.screen == Samaritan.Screens.WAIT && !Samaritan.DisplayState.talking) {
					Samaritan.HTML._('#triangle').fadeTo(500, 0).fadeTo(500, 1, Samaritan.Screens.WAIT.tick);
				}
				
				if (Samaritan.DisplayState.screen == Samaritan.Screens.WAIT && Samaritan.Recognition == undefined) {
					Samaritan.loadRecognition();
				}
			},
			shouldTick: false,
			tickInterval: -1,
			data: []
		},
		INPUT: {
			// Wait for command or data input.
			show: function(oldScreen, data) {
				Samaritan.loadBody("screens/input.html", function() {
					Samaritan.HTML._('#input-text').css({ opacity: '0' });
					Samaritan.HTML._('#loading-pane-container, #loading-bar-container').css({ opacity: '1' });
					Samaritan.HTML._('#loading-name')
						.animate({ opacity: 0.8 }, 200)
						.animate({ opacity: 0.1 }, 80)
						.animate({ opacity: 1 }, 200);
					Samaritan.HTML._('#input-text')
						.delay(300)
						.animate({ opacity: 1 }, 250, function() {
							Samaritan.HTML._('#input-text').focus();
						});
				});
			},
			hide: function(newScreen) {
			
			},
			tick: function() {
				
			},
			shouldTick: false,
			tickInterval: -1
		},
		SHUTDOWN: {
			// Wait for command or data input.
			show: function(oldScreen, data) {
				Samaritan.say("Shutdown Initiated");
			},
			hide: function(newScreen) {
			
			},
			tick: function() {
				
			},
			shouldTick: false,
			tickInterval: -1
		},
		ERROR: {
			show: function(oldScreen, data) {
				console.log("Show ERROR screen");
				Samaritan.HTML._('#content').html('<center><div id="main"><p>' 
				+ data 
				+ '</p><hr /></div>' 
				+ '<div id="message-marker"><span id="triangle">&#9650</span></div></center>');
				Samaritan.HTML._('#message-container hr').animate({ 'width' : (Samaritan.HTML._('#message-container p').textWidth() + 18) + 'px' }, Samaritan.Settings.wordAnimationTime);
			},
			hide: function(newScreen) {
				console.log("Hide ERROR screen");
			},
			tick: function() {
				console.log("Tick ERROR screen");
			},
			shouldTick: false,
			tickInterval: -1
		}
	},
	
	// =================================
	// ===== Samaritan's functions =====
	// =================================
	
	// Boot the Samaritan system.
	boot: function() {
		Samaritan.HTML._('body').dblclick(function() {
			if (screenfull.enabled) {
                screenfull.toggle();
            }
		});
		if (document.location.search == '?skip') {
			Samaritan.display(Samaritan.Screens.WAIT);
		} else {
			// Boot
			Samaritan.display(Samaritan.Screens.BOOT);
		}
	},
	// Change the current screen.
	display: function(screen, data) {
		var oldScreen = Samaritan.DisplayState.screen;
		Samaritan.DisplayState.screen = screen;
		// Hide current screen
		if (oldScreen != undefined) {
			oldScreen.hide(screen);
		}
		// Clear old screen data.
		Samaritan.DisplayState.data = undefined;
		Samaritan.HTML.Store = [];
		// Show new screen.
		screen.show(oldScreen, data);
		// Check if we need to tick.
		var shouldTick = _fnVar(screen.shouldTick);
		if (shouldTick && Samaritan.DisplayState.tickTimeout == undefined) {
			Samaritan.tick();
		} else if(!shouldTick) {
			clearTimeout(Samaritan.DisplayState.tickTimeout);
		}
	},
	// Tick the current screen.
	tick: function() {
		if (Samaritan.DisplayState.tickTimeout != undefined) {
			clearTimeout(Samaritan.DisplayState.tickTimeout);
		}
		var screen = Samaritan.DisplayState.screen;
		if (screen != undefined) {
			screen.tick();
			if (_fnVar(screen.shouldTick)) {
				Samaritan.DisplayState.tickTimeout = setTimeout(Samaritan.tick, _fnVar(screen.tickInterval));
			} else {
				Samaritan.DisplayState.tickTimeout = undefined;
			}
		} else {
			console.log('Tick with undefined screen!!');
		}
	},
	// Load a html page into the body of this page.
	loadBody: function(name, callback) {
		Samaritan.HTML._('#content').load(name, function(response, status, xhr) {
			if (status == 'error') {
				Samaritan.display(Samaritan.Screens.ERROR, xhr.status + " " + xhr.statusText);
			} else if (callback != undefined) {
				callback();
			}
		});
	},
	loadRecognition: function() {
		if ('webkitSpeechRecognition' in window) {
			var final_transcript = '';
	
			if (Samaritan.Recognition != undefined) {
				Samaritan.Recognition.stop();
			}
			
			var recognition = new webkitSpeechRecognition();
			Samaritan.Recognition = recognition;
			recognition.continuous = true;
			// recognition.interimResults = true;
			recognition.onstart = function() {
				console.log("Starting voice recognition");
			};
			recognition.onend = function() {
				Samaritan.Recognition = undefined;
				console.log("Stopping voice recognition");
			};
			recognition.onerror = function(event) {
				Samaritan.Recognition = undefined;
				console.log(event);
				// Samaritan.display(Samaritan.Screens.ERROR, 'Voice Recognition Error: ' + event.error);
			};
			recognition.onresult = function(event) {
				var interim_transcript = '';
				if (typeof(event.results) == 'undefined') {
					recognition.onend = null;
					recognition.stop();
					return;
				}
				
				for (var i = event.resultIndex; i < event.results.length; ++i) {
					if (event.results[i].isFinal) {
						final_transcript += event.results[i][0].transcript;
					} else {
						interim_transcript += event.results[i][0].transcript;
					}
				}
				
				console.log(interim_transcript);
				console.log(final_transcript);
				
				final_transcript = final_transcript.trim();
				if (final_transcript != '') {
					console.log("Out: " + final_transcript);
					Samaritan.listen(final_transcript);
				}
			
				final_transcript = '';
			};
			recognition.lang = 'en-AU';
			recognition.start();
		} else {
			Samaritan.display(Samaritan.Screens.ERROR, 'Voice Recognition Can\'t be initiated!');
		}
	},
	listen: function(string) {
		var cmd = string.toLowerCase();
		var voiceCommand = Samaritan.VoiceCommands[cmd];
		if (voiceCommand != undefined) {
			console.log("Voice Command: " + cmd);
			voiceCommand();
			return;
		}
		
		console.log("Unknown Voice Command");
		Samaritan.say("Unknown Voice Command");
	},
	say: function(string, callback) {
		if (Samaritan.HTML._('#triangle').length == 0) return;
		
		Samaritan.DisplayState.talking = true;
		
		var phraseArray = string.split(" ");
		Samaritan.HTML._('#triangle')
			.finish()
			.animate({ 'font-size': '0em', 'opacity': '1' }, Samaritan.Settings.wordAnimationTime, function() {
				var timeStart = 0;
				// Create timers for each word
				phraseArray.forEach(function (word, i) {
					var wordTime = Samaritan.Settings.wordDisplayTime;
					if (word.length > 8)
						wordTime *= (word.length / 8);
					setTimeout(function(){
						// Set the text to black, and put in the word
						// so that the length can be measured
						Samaritan.HTML._('#message-container p').addClass('hidden').html(word);
						// Then animate the line with extra padding
						Samaritan.HTML._('#message-container hr').animate({ 'width' : (Samaritan.HTML._('#message-container p').textWidth() + 18) + 'px' }, {
							'duration': Samaritan.Settings.wordAnimationTime,
							// When line starts anmating, set text to white again
							'start': Samaritan.HTML._('#message-container p').removeClass('hidden')
						})
					}, (timeStart + Samaritan.Settings.wordAnimationTime));
					timeStart += wordTime;
				});

				// Set a final timer to hide text and show triangle
				setTimeout(function(){
					// Clear the text
					Samaritan.HTML._('#message-container p').html("");
					// Animate trinagle back in
					Samaritan.HTML._('#triangle').finish().animate({ 'font-size': '2em', 'opacity': '1' }, Samaritan.Settings.wordAnimationTime, function() {
						Samaritan.HTML._('#message-container hr').animate({ 'width' : "30px" }, {
							'duration': Samaritan.Settings.wordAnimationTime,
							'start': Samaritan.HTML._('#message-container p').removeClass('hidden'),
							'done': function() {
								Samaritan.DisplayState.talking = false;
								if (callback != undefined) {
									callback();
								}
							}
						});
					});
				}, timeStart + Samaritan.Settings.wordDisplayTime);
		});
	}
};

// Once the page is loaded boot Samaritan
$(document).ready(function() {
	Samaritan.boot();
});
