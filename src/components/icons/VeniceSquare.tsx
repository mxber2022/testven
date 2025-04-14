import { SVGProps } from 'react'

const VeniceSquare = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={24}
    fill="none"
    {...props}
  >
    <g clipPath="url(#venice-square)">
      <path fill="#0151AF" d="M.5 0h24v24H.5z" />
      <path
        fill="#F9EDDD"
        d="M6.5 5l5 14h3l5-14h-3l-3.5 10L9.5 5h-3z"
      />
    </g>
    <defs>
      <clipPath id="venice-square">
        <path fill="#fff" d="M.5 0h24v24H.5z" />
      </clipPath>
    </defs>
  </svg>
)

export default VeniceSquare 