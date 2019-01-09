import React from 'react'

export const IconPOA = ({
  backgroundColor = '#fff',
  color = '#000',
  height = 30,
  iconHeight = 8,
  iconWidth = 18,
  text = '',
  url = '',
  width = 30
}) => {
  return (
    <a
      className={`sw-IconPOA`}
      href={url}
      rel="noopener noreferrer"
      style={{ backgroundColor: backgroundColor, height: height, width: width }}
      target="_blank"
      title={text}
    >
      <svg
        className="sw-IconPOA_SVG"
        style={{ height: iconHeight, width: iconWidth }}
        viewBox="0 0 125 40"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill={color} fillRule="evenodd">
          <path d="M61.4 0C50.482 0 41.6 8.883 41.6 19.8c0 10.918 8.882 19.8 19.8 19.8 10.918 0 19.8-8.882 19.8-19.8C81.2 8.883 72.318 0 61.4 0M21.206 31.718h2.505c8.06 0 14.949-6.26 15.24-14.323C39.254 8.95 32.476 1.98 24.103 1.98H3.127C2.504 1.98 2 2.485 2 3.108v34.044c0 .622.504 1.128 1.127 1.128H18.88c.615 0 1.117-.494 1.127-1.11l.073-4.343a1.127 1.127 0 0 1 1.126-1.109M98.002 1.271l-21.295 34.65c-.388.745.16 1.629 1.014 1.632l17.47.067 25.129-.067c.852-.003 1.401-.887 1.013-1.632l-21.294-34.65c-.425-.815-1.612-.815-2.037 0" />
        </g>
      </svg>
      <span style={{ fontSize: 0 }} className="sw-IconPOA_Text">
        {text}
      </span>
    </a>
  )
}
