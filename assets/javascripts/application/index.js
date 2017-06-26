function getWeb3(callback) {
  if (typeof window.web3 === 'undefined') {
  	// no web3, use fallback
    console.error("Please use a web3 browser");
    var msgNotEthereum = "You aren't connected to Ethereum. Please, switch on Parity or MetaMask client and refresh the page. Check Oracles network <a href='https://github.com/oraclesorg/oracles-wiki' target='blank'>wiki</a> for more info.";
    swal("Warning", msgNotEthereum, "warning");
    callback(myWeb3, false);
  } else {
  	// window.web3 == web3 most of the time. Don't override the provided,
    // web3, just wrap it in your Web3.
    var myWeb3 = new Web3(window.web3.currentProvider); 

    // the default account doesn't seem to be persisted, copy it to our
    // new instance
    myWeb3.eth.defaultAccount = window.web3.eth.defaultAccount;

    checkNetworkVersion(myWeb3, function(isOraclesNetwork) {
    	callback(myWeb3, isOraclesNetwork);
    });
  }
}

function checkNetworkVersion(web3, cb) {
	var msgNotOracles = "You aren't connected to Oracles network. Please, switch on Parity or MetaMask client and choose Oracles network. Check Oracles network <a href='https://github.com/oraclesorg/oracles-wiki' target='blank'>wiki</a> for more info.";
	web3.version.getNetwork(function(err, netId) {
	  if (err)
	  	console.log(err);
	  console.log("netId: " + netId);
	  switch (netId) {
	    case "1": {
	      console.log('This is mainnet');
	      swal("Warning", msgNotOracles, "warning"); 
	      cb(false);
	    } break;
	    case "2": {
	      console.log('This is the deprecated Morden test network.');
	      swal("Warning", msgNotOracles, "warning");
	      cb(false);
	    } break;
	    case "3": {
	      console.log('This is the ropsten test network.');
	      swal("Warning", msgNotOracles, "warning");
	      cb(false);
	    }  break;
	     case "12648430": {
	       console.log('This is Oracles from Metamask');
	       cb(true);
	    }  break;
	    default: {
	      console.log('This is an unknown network.');
	      swal("Warning", msgNotOracles, "warning");
	      cb(false);
	  	} break;
	  }
	})
}

function startDapp(web3, isOraclesNetwork) {
  	$(function() {
		$(".loading-container").hide();
		if (!isOraclesNetwork) return;
		var config;
		var ballotsArrayFiltered = [];

		web3.eth.getAccounts(function(error, accounts) {
			console.log(accounts);

			var votingKey;
			if (readCookie('votingKey'))
				votingKey = readCookie('votingKey');
			for (var i = 0; i < accounts.length; i++) {
				if (i == 0) votingKey = accounts[i];
				if (readCookie('votingKey') == accounts[i] || (!readCookie('votingKey') && i == 0)) {
					$option = "<option name='key' value=" + accounts[i] + " selected>" + accounts[i] + "</option>";
					votingKey = accounts[i];
				} else 
					$option = "<option name='key' value=" + accounts[i] + ">" + accounts[i] + "</option>";
				$(".key-select").append($option);
			}

			//key select onchange event
			$(".key-select").change(function() {
				createCookie('votingKey', $(this).val(), 365);
				votingKey = $(this).val();
			});

			$.getJSON("./assets/javascripts/config.json", function(_config) {
				config = _config;

				if (accounts.length == 1) {
					var possiblePayoutKey = accounts[0];
					checkVotingKey(web3,
					"checkVotingKeyValidity(address)", 
					possiblePayoutKey,
					config.Ethereum[config.environment].contractAddress,
					function(_isActive) {
						_isActive = !!+_isActive;
						if (!_isActive) swal("Warning", "Current key isn't valid voting key. Please, choose your voting key in MetaMask client and reload the page. Check Oracles network <a href='https://github.com/oraclesorg/oracles-wiki' target='blank'>wiki</a> for more info.", "warning");
						else $(".choose-key-button").trigger("click");
					});
				}

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
					getBallots(web3, 
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
				if ($(".new-ballot-add").attr("step") == 2) {
					$(".new-ballot-inputs").removeClass("hidden");
					$(".personal-data-inputs").addClass("hidden");
					$(".new-ballot-add").attr("step", 1);
					$(".new-ballot-add").html("Continue");
				} else {
					ballotsNavPan();
					getBallotsArray();
				}
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


					$("#type_add").click(function() {
						$(".new-ballot-add").attr("step", 1);
						$(".new-ballot-add").html("Continue");
					});

					$("#type_remove").click(function() {
						$(".new-ballot-add").attr("step", 2);
						$(".new-ballot-add").html("Add Ballot");
					});

					$(".new-ballot-add").on("click", function() {
						if ($(this).attr("step") == 1) {
							$(".new-ballot-inputs").addClass("hidden");
							$(".personal-data-inputs").removeClass("hidden");
							$(".new-ballot-add").attr("step", 2);
							$(".new-ballot-add").html("Add Ballot");
							return;
						}

						$(".loading-container").show();
						var addAction = $("input[name=type]:checked").val();
						var ballotViewObj = {
							ballotID: generateBallotID(),
							memo: $("#memo").val(),
							miningKey: $("#mining-key").val(),
							affectedKey: $("#affected-key").val(),
							affectedKeyType: parseInt($("#affected-key-type").val()),
							owner: votingKey,
							addAction: addAction
						};

						var isAddress1 = web3.isAddress($("#mining-key").val());
						var isAddress2 = web3.isAddress($("#affected-key").val());
						if (!isAddress1 || !isAddress2) {
							$(".loading-container").hide();
							showAlert(null, "One or both keys are incorrect");
							return;
						}

						if (!addAction) {
							newBallotClickCallback(ballotViewObj, null);
						} else {
							var validatorViewObj = {
								miningKey: $("#mining-key").val(),
								fullName:  $("#full-name").val(),
								streetName: $("#address").val(),
								state: $("#state").val(),
								zip: $("#zip").val(),
								licenseID: $("#license-id").val(),
								licenseExpiredAt: new Date($("#license-expiration").val()).getTime() / 1000,
							};
							newBallotClickCallback(ballotViewObj, validatorViewObj);
						}
					});
				});
			});

			function newBallotClickCallback(ballotViewObj, validatorViewObj) {
				addBallot(web3, 
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
							addValidator(web3, 
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
										//$(".back").trigger("click");
										ballotsNavPan();
										getBallotsArray();
									});
								}
							);
						}
					}
				);
			}

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
						web3, 
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

				vote(web3, 
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
				getBallots(web3, 
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
	});
}


window.addEventListener('load', function() {
	getWeb3(startDapp);
});