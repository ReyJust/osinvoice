export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 250 80"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="OSInvoice"
    >
      <rect x="4" y="4" width="72" height="72" rx="12" fill="#00786f" />
      <text
        x="40"
        y="56"
        textAnchor="middle"
        fill="white"
        fontSize="44"
        fontWeight="bold"
        fontStyle="italic"
        fontFamily="sans-serif"
      >
        OS
      </text>
      <text
        x="90"
        y="55"
        fill="#111111"
        fontSize="38"
        fontWeight="bold"
        fontFamily="sans-serif"
      >
        invoice
      </text>
    </svg>
  )
}
