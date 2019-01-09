import React from 'react'

export const NewBallotMenu = ({ networkBranch, menuItems }) => {
  return (
    <ul className={`mn-NewBallotMenu mn-NewBallotMenu-${networkBranch}`}>
      {menuItems.map((item, index) => (
        <li
          className={`mn-NewBallotMenu_Item mn-NewBallotMenu_Item-${networkBranch} ${
            item.active ? 'mn-NewBallotMenu_Item-active' : ''
          }`}
          key={index}
          onClick={item.onClick}
        >
          {item.text}
        </li>
      ))}
    </ul>
  )
}
