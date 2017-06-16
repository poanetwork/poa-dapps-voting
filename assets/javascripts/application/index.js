"use strict";

$(function() {
	$(".loading-container").hide();
	var api = window.parity.api;
	var config;
	var ballotsArrayFiltered = [];

	var accounts = web3.eth.accounts;
	var votingKey;
	if (readCookie('votingKey'))
		votingKey = readCookie('votingKey');
	for (var i = 0; i < accounts.length; i++) {
		if (readCookie('votingKey') == accounts[i] || (!readCookie('votingKey') && i == 0))
			$option = "<option name='key' value=" + accounts[i] + " selected>" + accounts[i] + "</option>"
		else
			$option = "<option name='key' value=" + accounts[i] + ">" + accounts[i] + "</option>"
		$(".key-select").append($option);
	}

	//key select onchange event
	$(".key-select").change(function() {
		createCookie('votingKey', $(this).val(), 365);
		votingKey = $(this).val();
	});

	$.getJSON("./assets/javascripts/config.json", function(_config) {
		config = _config;

		//choose key button onclick event
		$(".choose-key-button").on("click", function() {
			ballotsNavPan();
			$(".key-content").addClass("hidden");
			$(".content").removeClass("hidden");
			$(".container.vote").empty();
			$(".container.new-ballot").addClass("hidden");
			$(".container.vote").removeClass("hidden");
			$(".loading-container").hide();

			votingKey = $(".key-select").val();
			getBallots(api, 
				"getBallots()", 
				votingKey,
				config.Ethereum[config.environment].contractAddress,
				function(_ballotsArray) {
					ballotsArrayFiltered = _ballotsArray;
					getBallotsCallBack(_ballotsArray);
				}
			);

			// ballots list nav filters onclick events
			$(".nav-i").on("click", function() {
				$(".search-input").val('');
				$(".loading-container").show();
				if ($(this).hasClass("nav-i_actual")) {
					$(".nav-i").removeClass("nav-i_active");
					$(this).addClass("nav-i_active");
					getBallotsArray();
				} else if ($(this).hasClass("nav-i_unanswered")) {
					$(".nav-i").removeClass("nav-i_active");
					$(this).addClass("nav-i_active");
					getBallotsArray({filter: "unanswered"});
				} else if ($(this).hasClass("nav-i_expired")) {
					$(".nav-i").removeClass("nav-i_active");
					$(this).addClass("nav-i_active");
					getBallotsArray({filter: "expired"});
				}
			});

			// search input onkeyup event
			$(".search-input").on("keyup", function() {
				var searchInput = $(this).val();
				var ballotsArrayFiltered = filterBallots(searchInput);
				$(".container.vote").empty();
				getBallotsCallBack(ballotsArrayFiltered);
			});
		});
	});

	//back button onclick event
	$(".back").on("click", function() {
		ballotsNavPan();
		getBallotsArray();
	});

	//settings button onclick event
	$(".header-settings").on("click", function() {
		$(".key-content").removeClass("hidden");
		$(".content").addClass("hidden");
	});

	//new ballot button onclick event
	$(".header-new-ballot").on("click", function() {
		$(".key-content").addClass("hidden");
		$(".content").removeClass("hidden");
		$(".container.new-ballot").removeClass("hidden");
		$(".container.vote").addClass("hidden");
		$(".container.new-ballot").empty();
		$(".container.new-ballot").load("./newBallot.html", function() {
			newBallotNavPan();
			$(".new-ballot-add").on("click", function() {
				$(".loading-container").show();
				var ballotViewObj = {
					ballotID: generateBallotID(),
					memo: $("#memo").val(),
					miningKey: $("#key").val(),
					affectedKey: $("#key").val(),
					affectedKeyType: 0,
					owner: votingKey,
					addAction: $("input[name=type]:checked").val()
				};
				var validatorViewObj = {
					miningKey: $("#key").val(),
					fullName:  $("#full-name").val(),
					streetName: $("#address").val(),
					state: $("#state").val(),
					zip: $("#zip").val(),
					licenseID: $("#license-id").val(),
					licenseExpiredAt: new Date($("#license-expiration").val()).getTime() / 1000,
				};
				var isAddress = web3.isAddress($("#key").val());
				if (!isAddress) {
					$(".loading-container").hide();
					showAlert(null, "Incorrect mining key");
					return;
				}

				addBallot(api, 
					"addBallot(uint256,address,address,address,uint256,bool,string)",
					ballotViewObj,
					votingKey,
					config.Ethereum[config.environment].contractAddress,
					function(txHash, err) {
						if (err) {
							$(".loading-container").hide();
							showAlert(err, err.message);
							return;
						}

						if (!ballotViewObj.addAction) {
							getTxCallBack(txHash, function() {
								$(".loading-container").hide();
								$(".back").trigger("click");
							});
						} else {
							addValidator(api, 
								"addValidator(address,uint256,uint256,uint256,string,string,string)",
								validatorViewObj,
								votingKey,
								config.Ethereum[config.environment].contractAddress,
								function(txHash, err) {
									if (err) {
										$(".loading-container").hide();
										showAlert(err, err.message);
										return;
									}

									getTxCallBack(txHash, function() {
										$(".loading-container").hide();
										$(".back").trigger("click");
									});
								}
							);
						}
					}
				);
			});
		});
	});

	function getBallotsCallBack(_ballotsArray) {
		for(var i = 0; i < _ballotsArray.length; i++) {
			var ballot = _ballotsArray[i];
			if (ballot) {
				var ballotID = Object.keys(ballot)[0];
				var ballotPropsObj = ballot[ballotID];
				var ballotView = getBallotView(votingKey, ballotID, ballotPropsObj, false);
				$(".container.vote").append(ballotView);
			}
		}

		//vote now button onclick event
		$(".vote-now").on("click", function() {
			getBallotView(
				votingKey, 
				$(this).attr("ballot-id"), 
				null, 
				true, 
				api, 
				config.Ethereum[config.environment].contractAddress, 
				function(ballotView) 
			{
				$(".container.vote").empty();
				$(".container.vote").append(ballotView);
				newBallotNavPan();

				//vote button onclick event
				$(".vote-button").on("click", function(e) {
					voteButtonClick(e, $(this));
				});
			});
		});
	}

	function voteButtonClick(e, $this) {
		$(".loading-container").show();
		var voteFor = $this.hasClass("vote-rating-yes")?true:false;

		var ballotID = $this.closest(".vote-i").attr("ballot-id");

		vote(api, 
			"vote(uint256,bool)", 
			ballotID,
			voteFor,
			votingKey,
			config.Ethereum[config.environment].contractAddress,
			function(txHash, err) {
				if (err) {
					$(".loading-container").hide();
					showAlert(err, "You are already voted or have no rights to vote");
					return;
				}

				getTxCallBack(txHash, function() {
					$(".loading-container").hide();
					$(".back").trigger("click");
				});
			}
		);
	}

	//change to new ballot navigation pan
	function newBallotNavPan() {
		$(".nav").addClass("hidden");
		$(".search-form").addClass("hidden");
		$(".back").removeClass("hidden");
	}

	//change to ballots navigation pan
	function ballotsNavPan() {
		$(".nav").removeClass("hidden");
		$(".search-form").removeClass("hidden");
		$(".back").addClass("hidden");
	}

	function getBallotsArray(filterObj) {
		$(".container.new-ballot").addClass("hidden");
		$(".container.vote").removeClass("hidden");
		$(".container.vote").empty();
		getBallots(api, 
			"getBallots()",
			votingKey,
			config.Ethereum[config.environment].contractAddress,
			function(_ballotsArray) {
				$(".loading-container").hide();
				if (!filterObj) {
					ballotsArrayFiltered = _ballotsArray;
					getBallotsCallBack(ballotsArrayFiltered);
					return;
				}

				if (filterObj.filter == "expired") {
					var _ballotsArrayFiltered = [];
					for (var i = 0; i < _ballotsArray.length; i++) {
						var ballot = _ballotsArray[i];
						var ballotID = Object.keys(ballot)[0];
						if (new Date(ballot[ballotID].votingEnd*1000) < new (Date)) { //expired
							_ballotsArrayFiltered.push(ballot);
						}
					}
					ballotsArrayFiltered = _ballotsArrayFiltered;
					getBallotsCallBack(ballotsArrayFiltered);
				} else if (filterObj.filter == "unanswered") {
					var _ballotsArrayFiltered = [];
					for (var i = 0; i < _ballotsArray.length; i++) {
						var ballot = _ballotsArray[i];
						var ballotID = Object.keys(ballot)[0];
						if (!ballot[ballotID].voted && (new Date(ballot[ballotID].votingEnd*1000) >= new (Date))) {
							_ballotsArrayFiltered.push(ballot);
						}
					}
					ballotsArrayFiltered = _ballotsArrayFiltered;
					getBallotsCallBack(ballotsArrayFiltered);
				}
			}
		);
	}
});