import React from 'react'

import { ButtonFinalize } from '../ButtonFinalize'

export const BallotFooter = ({
  buttonText,
  buttonState,
  description = '',
  networkBranch,
  onClick,
  voteId,
  voteType,
  voted
}) => {
  return (
    <div className={`bc-BallotFooter bc-BallotFooter-${networkBranch}`}>
      <ButtonFinalize onClick={onClick} text={buttonText} state={buttonState} networkBranch={networkBranch} />
      {description ? <p className="bc-BallotFooter_Description">{description}</p> : null}
      {voted ? <div className="bc-BallotFooter_Voted">You already voted</div> : null}
      <div className="bc-BallotFooter_ID">
        {voteType} Ballot ID: <span className="bc-BallotFooter_voteID">{voteId}</span>
      </div>
    </div>
  )
}
