//launches main application
function startDapp(web3, isOraclesNetwork) {
  	$(function() {
		if (!isOraclesNetwork) {
			$(".loading-container").hide();
			return;
		}
		var ballotsArrayFiltered = [];
		var votingKey;

		getAccounts(function(accounts) {
			getConfig(function(contractAddress) {
				getConfigCallBack(web3, accounts, contractAddress);	
			})
		});

		//getting of config callback
		function getConfigCallBack(web3, accounts, contractAddress) {
			//checks if chosen account is valid voting key
			if (accounts.length == 1) {
				var possiblePayoutKey = accounts[0];
				checkVotingKey(web3,
				"checkVotingKeyValidity(address)", 
				possiblePayoutKey,
				contractAddress,
				function(_isActive) {
					_isActive = !!+_isActive;
					if (!_isActive) {
						$(".loading-container").hide();
						swal("Warning", "Current key isn't valid voting key. Please, choose your voting key in MetaMask client and reload the page. Check Oracles network <a href='https://github.com/oraclesorg/oracles-wiki' target='blank'>wiki</a> for more info.", "warning");
					} else $(".choose-key-button").trigger("click");
				});
			} else if (accounts.length == 0) {
				$(".loading-container").hide();
				swal("Warning", "You haven't chosen any account in MetaMask. Please, choose your voting key in MetaMask client and reload the page. Check Oracles network <a href='https://github.com/oraclesorg/oracles-wiki' target='blank'>wiki</a> for more info.", "warning");
			}

			$(".loading-container").hide();

			//choose key button onclick event
			$(".choose-key-button").on("click", function() {
				$(".loading-container").show();
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
					contractAddress,
					function(_ballotsArray) {
						$(".loading-container").hide();
						ballotsArrayFiltered = _ballotsArray;
						showBallotsPage(_ballotsArray, web3, contractAddress);
					}
				);

				// ballots list nav filters onclick events
				$(".nav-i").on("click", function() {
					$(".search-input").val('');
					$(".loading-container").show();
					if ($(this).hasClass("nav-i_actual")) {
						$(".nav-i").removeClass("nav-i_active");
						$(this).addClass("nav-i_active");
						getBallotsList(web3, contractAddress);
					} else if ($(this).hasClass("nav-i_unanswered")) {
						$(".nav-i").removeClass("nav-i_active");
						$(this).addClass("nav-i_active");
						getBallotsList(web3, contractAddress, {filter: "unanswered"});
					} else if ($(this).hasClass("nav-i_expired")) {
						$(".nav-i").removeClass("nav-i_active");
						$(this).addClass("nav-i_active");
						getBallotsList(web3, contractAddress, {filter: "expired"});
					}
				});

				// search input onkeyup event
				$(".search-input").on("keyup", function() {
					var searchInput = $(this).val();
					var ballotsArrayFiltered = filterBallots(searchInput);
					$(".container.vote").empty();
					showBallotsPage(ballotsArrayFiltered, web3, contractAddress);
				});
			});

			if (readCookie('votingKey')) {
				votingKey = readCookie('votingKey');
				$(".choose-key-button").trigger("click");
			}
			for (var i = 0; i < accounts.length; i++) {
				if (i == 0) votingKey = accounts[i];
				if (readCookie('votingKey') == accounts[i] || (!readCookie('votingKey') && i == 0)) {
					$option = "<option name='key' value=" + accounts[i] + " selected>" + accounts[i] + "</option>";
					votingKey = accounts[i];
				} else 
					$option = "<option name='key' value=" + accounts[i] + ">" + accounts[i] + "</option>";
				$(".key-select").append($option);
			}

			//back button onclick event
			$(".back").on("click", function() {
				if ($(".new-ballot-add").attr("step") == 2) {
					$(".new-ballot-inputs").removeClass("hidden");
					$(".personal-data-inputs").addClass("hidden");
					$(".new-ballot-add").attr("step", 1);
					$(".new-ballot-add").html("Continue");
				} else {
					ballotsNavPan();
					getBallotsList(web3, contractAddress);
				}
			});

			//key select onchange event
			$(".key-select").change(function() {
				createCookie('votingKey', $(this).val(), 365);
				votingKey = $(this).val();
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
							addBallotClick(web3, ballotViewObj, null, contractAddress);
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
							addBallotClick(web3, ballotViewObj, validatorViewObj, contractAddress);
						}
					});
				});
			});
		}

		//triggers after clicking "Add Ballot" button
		function addBallotClick(web3, ballotViewObj, validatorViewObj, contractAddress) {
			addBallot(web3, 
				"addBallot(uint256,address,address,address,uint256,bool,string)",
				ballotViewObj,
				votingKey,
				contractAddress,
				function(txHash, err) {
					addBallotCallBack(err, web3, txHash, ballotViewObj.addAction, validatorViewObj, contractAddress);
				}
			);
		}

		//Adding of ballot to contract callback
		function addBallotCallBack(err, web3, txHash, addAction, validatorViewObj, contractAddress) {
			if (err) {
				$(".loading-container").hide();
				showAlert(err, err.message);
				return;
			}

			if (!addAction) {
				getTxCallBack(txHash, function() {
					$(".loading-container").hide();
					$(".back").trigger("click");
				});
			} else {
				addValidator(web3, 
					"addValidator(address,uint256,uint256,uint256,string,string,string)",
					validatorViewObj,
					votingKey,
					contractAddress,
					function(txHash, err) {
						addValidatorCallBack(err, txHash, web3, contractAddress);
					}
				);
			}
		}

		//Adding of validator to contract callback
		function addValidatorCallBack(err, txHash, web3, contractAddress) {
			if (err) {
				$(".loading-container").hide();
				showAlert(err, err.message);
				return;
			}

			getTxCallBack(txHash, function() {
				$(".loading-container").hide();
				//$(".back").trigger("click");
				ballotsNavPan();
				getBallotsList(web3, contractAddress);
			});
		}

		//shows page with list of ballots
		function showBallotsPage(_ballotsArray, web3, contractAddress) {
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
				getBallotView(votingKey, $(this).attr("ballot-id"), null, true, web3, contractAddress, function(ballotView) {
					showSingleBallotPage(ballotView, web3, contractAddress);
				});
			});
		}

		//shows page with single ballot
		function showSingleBallotPage(ballotView, web3, contractAddress) {
			$(".container.vote").empty();
			$(".container.vote").append(ballotView);
			newBallotNavPan();

			//vote button onclick event
			$(".vote-button").on("click", function(e) {
				voteButtonClick(web3, contractAddress, e, $(this));
			});
		}

		//triggers after .vote-button clicked
		function voteButtonClick(web3, contractAddress, e, $this) {
			$(".loading-container").show();
			var voteFor = $this.hasClass("vote-rating-yes")?true:false;

			var ballotID = $this.closest(".vote-i").attr("ballot-id");

			vote(web3, 
				"vote(uint256,bool)", 
				ballotID,
				voteFor,
				votingKey,
				contractAddress,
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

		function getBallotsList(web3, contractAddress, filterObj) {
			$(".container.new-ballot").addClass("hidden");
			$(".container.vote").removeClass("hidden");
			$(".container.vote").empty();
			getBallots(web3, 
				"getBallots()",
				votingKey,
				contractAddress,
				function(_ballotsArray) {
					$(".loading-container").hide();
					if (!filterObj) {
						ballotsArrayFiltered = _ballotsArray;
						showBallotsPage(ballotsArrayFiltered, web3, contractAddress);
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
						showBallotsPage(ballotsArrayFiltered, web3, contractAddress);
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
						showBallotsPage(ballotsArrayFiltered, web3, contractAddress);
					}
				}
			);
		}
	});
}


window.addEventListener('load', function() {
	getWeb3(startDapp);
});