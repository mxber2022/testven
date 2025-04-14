import { SVGProps } from 'react'

const FinkFiSquare = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={24}
    fill="none"
    {...props}
  >
    <g clipPath="url(#finkfi-square)">
      <path fill="#0151AF" d="M.5 0h24v24H.5z" />
      <path
        fill="#F9EDDD"
        d="M6.5 5h12v2h-10v5h8v2h-8v5h10v2h-12V5z"
      />
    </g>
    <defs>
      <clipPath id="finkfi-square">
        <path fill="#fff" d="M.5 0h24v24H.5z" />
      </clipPath>
    </defs>
  </svg>
)

export default FinkFiSquare 