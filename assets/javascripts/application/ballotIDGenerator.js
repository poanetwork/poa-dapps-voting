function generateBallotID() {
	var min = 10000000;
	var max = 99999999;
  	return Math.floor(Math.random() * (max - min)) + min;
}