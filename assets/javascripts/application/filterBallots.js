function filterBallots(searchInput) {
	return ballotsArrayFiltered.map(function(ballot, i) {
		if (ballot) {
			var searchValidated = validateSearch(ballot, searchInput.toLowerCase());
	      	if (!searchValidated) return null;
	      	else return ballot;
		} else return null;
    })
}

function validateSearch(ballot, searchInput) {
	var ballotID = Object.keys(ballot)[0];

	var ballotObj = ballot[ballotID];
	if (ballotObj["memo"].toLowerCase().indexOf(searchInput) > -1) return true;
	else if (ballotObj["fullName"].toLowerCase().indexOf(searchInput) > -1) return true;
	else if (ballotObj["address"].toLowerCase().indexOf(searchInput) > -1) return true;
	else if (ballotObj["state"].toLowerCase().indexOf(searchInput) > -1) return true;
	else if (ballotObj["zip"].toLowerCase().indexOf(searchInput) > -1) return true;
	else if (ballotObj["zip"].toLowerCase().indexOf(searchInput) > -1) return true;
	else if (ballotObj["licenseID"].toLowerCase().indexOf(searchInput) > -1) return true;
	else if (ballotObj["licenseExpiredAt"].toLowerCase().indexOf(searchInput) > -1) return true;
	else if (ballotObj["miningKey"].toString().indexOf(searchInput) > -1) return true;

	return false;
}