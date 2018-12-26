import React from 'react'
import { ButtonVoting } from '../ButtonVoting'
import { VoteProgressBar } from '../VoteProgressBar'

export const Votes = ({ votes, networkBranch }) => {
  const buttonSize = votes.length === 3 ? 'md' : 'sm'

  return (
    <div className="vt-Votes">
      {votes.map((item, index) => {
        return (
          <div className="vt-Votes_ScaleColumn" key={index}>
            <ButtonVoting
              networkBranch={networkBranch}
              onClick={item.onClick}
              side={item.side ? item.side : undefined}
              size={buttonSize}
              text={item.text}
              type={item.type}
            />
            <VoteProgressBar
              networkBranch={networkBranch}
              type={item.type}
              votesAmount={item.votesAmount}
              votesPercentage={item.votesPercentage}
            />
          </div>
        )
      })}
    </div>
  )
}
