import React from 'react'

export const VoteProgressBar = ({
  extraClassName = '',
  networkBranch,
  votesAmount = '',
  votesPercentage = '',
  type = 'positive'
}) => {
  return (
    <div className={`vt-VoteProgressBar ${extraClassName} vt-VoteProgressBar-${networkBranch}`}>
      <p className="vt-VoteProgressBar_Votes">{votesAmount} Votes</p>
      <p className="vt-VoteProgressBar_Percentage">{votesPercentage}%</p>
      <div className="vt-VoteProgressBar_Scale">
        <div
          className={`vt-VoteProgressBar_Progress vt-VoteProgressBar_Progress-${networkBranch} vt-VoteProgressBar_Progress-${type}`}
          style={{ width: `${votesPercentage}%` }}
        />
      </div>
    </div>
  )
}
