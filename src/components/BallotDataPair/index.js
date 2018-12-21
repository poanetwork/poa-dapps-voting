import React from 'react'

export const BallotDataPair = ({ dataType = '', title = '', value = [] }) => {
  return (
    <div className={`blc-BallotDataPair blc-BallotDataPair-${dataType}`}>
      <h2 className="blc-BallotDataPair_Title">{title}</h2>
      {value.map((item, index) => {
        return (
          <p className="blc-BallotDataPair_Value" key={index}>
            {item}
          </p>
        )
      })}
    </div>
  )
}
