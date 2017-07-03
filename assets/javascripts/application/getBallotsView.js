function getBallotView(acc, ballotID, ballotPropsObj, isVotingEnabled, web3, contractAddress, cb) {
  if (ballotPropsObj) {
    return ballotViewObject(ballotID, ballotPropsObj, isVotingEnabled);
  } else {
    getBallotData(web3, acc, ballotID, contractAddress, function(ballotPropsObj) {
      cb(ballotViewObject(ballotID, ballotPropsObj, isVotingEnabled));
    });
  }
}

function ballotViewObject(ballotID, ballotPropsObj, isVotingEnabled) {
  //votes
  var votesFor = ballotPropsObj["votesFor"];
  var votesAgainst = ballotPropsObj["votesAgainst"];
  var votesTotal = ballotPropsObj["votesFor"] + ballotPropsObj["votesAgainst"];
  var votesForPerc = 0;
  var votesAgainstPerc = 0;
  if (votesTotal > 0) {
    votesForPerc = Math.round((votesFor / votesTotal) * 100, 0);
    votesAgainstPerc = Math.round((votesAgainst / votesTotal) * 100, 0);
  }
  //action
  var actionDN;
  switch(ballotPropsObj["action"]) {
    case 0:
      actionDN = "Remove Notary";
      break;
    case 1:
      actionDN = "Add new Notary";
      break;
  }
  //miningKey
  var miningKey = ballotPropsObj["miningKey"];
  if (miningKey.length > 40) miningKey = "0x" + miningKey.substr(miningKey.length - 40);
  //affectedKey
  var affectedKey = ballotPropsObj["affectedKey"];
  if (affectedKey.length > 40) affectedKey = "0x" + affectedKey.substr(affectedKey.length - 40);
  //affectedKeyType
  var affectedKeyType;
  switch(ballotPropsObj["affectedKeyType"]) {
    case 0:
      affectedKeyType = "mining key";
      break;
    case 1:
      affectedKeyType = "voting key";
      break;
    case 2:
      affectedKeyType = "payout key";
      break;
  }
  //time to start/end
  var timeToVotingStart = getDateDiff(Math.floor(Date.now() / 1000), parseInt(ballotPropsObj["votingStart"]));
  var timeToVotingEnd = getDateDiff(Math.floor(Date.now() / 1000), parseInt(ballotPropsObj["votingEnd"]));
  var timeToVotingStartEnd = timeToVotingStart;
  var timeToVotingStartEndLabel = "To start";
  if (timeToVotingStart == "00:00") {
    timeToVotingStartEnd = timeToVotingEnd;
    timeToVotingStartEndLabel = "To end"
  }

  return `<div class="vote-i" ballot-id="` + ballotID + `">
          <div class="vote-header">
            <div class="vote-person left">
              <img src="./assets/images/person.png" alt="" class="vote-person-img">
              <p class="vote-person-name">` + (ballotPropsObj["owner"]?ballotPropsObj["owner"]:``) + `</p>
              <div class="vote-person-create">` + formatDate(new Date(parseInt(ballotPropsObj["createdAt"])*1000), "MM/dd/yyyy h:mm TT") + `</div>
            </div>
            <div class="vote-time right">
              <div class="vote-time-timer">` + timeToVotingStartEnd + `</div>
              <div class="vote-time-to">` + timeToVotingStartEndLabel + `</div>
            </div>
            ` + (isVotingEnabled?``:`<a href="#" class="vote-now right" ballot-id="` + ballotID + `" ` + (timeToVotingEnd == "00:00"?`hidden`:``) + `>Vote now</a>`) + `
          </div>
          <div class="vote-body">
            <div class="vote-body-i">
              <p class="vote-body-title">
                Proposal
                <span class="vote-tooltip-container">
                  <span class="vote-tooltip-icon"></span>
                  <span class="vote-tooltip">
                    <span class="vote-tooltip-text">
                      <span class="vote-tooltip-title">How does it work?</span>
                      <span class="vote-tooltip-description">
                        If you are a validator in Oracles network you can sign a vote with your voting key.
                        Please refer to voting FAQ on
                        <a href="https://forum.oracles.org/">https://forum.oracles.org/</a>
                      </span>
                    </span>
                    <span class="vote-tooltip-shadow"></span>
                  </span>
                </span>
              </p>
              <p class="vote-body-description">
                ` + ballotPropsObj["memo"] + `
              </p>
            </div>
            <div class="vote-body-i">
              <p class="vote-body-title">Mining key</p>
              <p class="vote-body-description">
                ` + miningKey + `
              </p>
              <p class="vote-body-title-secondary">Affected key (` + affectedKeyType + `)</p>
              <p class="vote-body-description">
                ` + affectedKey + `
              </p>
            </div>
            <div class="vote-body-i">
              <p class="vote-body-title">Title</p>
              <p class="vote-body-description">
                ` + actionDN + `
              </p>
            </div>
          </div>
          <div class="vote-rating">
            <div class="vote-rating-i left">
              <p class="vote-rating-value left">Yes</p>
              <div class="vote-rating-got right">
                <strong>` + votesForPerc + `%</strong>
                <p>Votes: ` + votesFor + `</p>
              </div>
              <div class="vote-rating-scale vote-rating-scale_yes">
                <div class="vote-rating-scale-active" style="width: ` + votesForPerc + `%"></div>
              </div>`
              + (isVotingEnabled? `<a href="#" class="vote-button vote-rating-yes left">Vote</a>`:``) +
            `</div>
            <div class="vote-rating-i right">
              <p class="vote-rating-value left">No</p>
              <div class="vote-button vote-rating-got right">
                <strong>` + votesAgainstPerc + `%</strong>
                <p>Votes: ` + votesAgainst + `</p>
              </div>
              <div class="vote-rating-scale vote-rating-scale_no">
                <div class="vote-rating-scale-active" style="width: ` + votesAgainstPerc + `%"></div>
              </div>`
              + (isVotingEnabled? `<a href="#" class="vote-button vote-rating-no right">Vote</a>`:``) +
            `</div>
          </div>
        </div>`;
}