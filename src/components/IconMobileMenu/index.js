import React from 'react'

export const IconMobileMenu = ({ networkBranch, onClick, isOpen = false }) => {
  switch (isOpen) {
    case true:
      return (
        <svg onClick={onClick} className="hd-IconMobileMenu" xmlns="http://www.w3.org/2000/svg" width="18" height="18">
          <path
            className={`hd-IconMobileMenu_Path hd-IconMobileMenu_Path-${networkBranch}`}
            d="M17.691 1.719l-3 3-4.265 4.265.019.02 4.245 4.245 3 3a1.019 1.019 0 1 1-1.441 1.441l-3-3-4.265-4.264L4.72 14.69l-3 3a1.02 1.02 0 0 1-1.442-1.441l3-3 4.265-4.265-.02-.019-4.245-4.246-3-3A1.019 1.019 0 1 1 1.719.278l3 3 4.265 4.265 4.266-4.265 3-3a1.019 1.019 0 1 1 1.441 1.441z"
            fillRule="evenodd"
          />
        </svg>
      )
    default:
      return (
        <svg onClick={onClick} className="hd-IconMobileMenu" xmlns="http://www.w3.org/2000/svg" width="18" height="14">
          <path
            className={`hd-IconMobileMenu_Path hd-IconMobileMenu_Path-${networkBranch}`}
            d="M17 8H1a1 1 0 0 1 0-2h16a1 1 0 0 1 0 2zm0-6H1a1 1 0 0 1 0-2h16a1 1 0 0 1 0 2zM1 12h16a1 1 0 0 1 0 2H1a1 1 0 0 1 0-2z"
            fillRule="evenodd"
          />
        </svg>
      )
  }
}
