import { Check, MessageCircle } from "lucide-react";

/**
 * Mini product "screenshot" snippets used in the showcase section.
 * Styled as soft, floating cards (rounded-xl, hairline border, subtle shadow)
 * in the NoDues palette — accent #070094 for data/agent, neutral grays for chrome.
 */

export function CallVolumeChart() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
      <h4 className="font-medium text-black">Call Volume</h4>
      <p className="mb-5 text-sm text-gray-500">
        Daily call volume over the selected period
      </p>
      <svg
        viewBox="0 0 360 150"
        className="w-full"
        role="img"
        aria-label="Daily call volume chart"
      >
        <defs>
          <linearGradient id="cvFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#070094" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#070094" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0,108 C24,112 48,116 72,110 C100,103 120,52 144,40 C168,52 192,100 216,106 C240,112 256,96 288,88 C320,80 340,38 360,26 L360,150 L0,150 Z"
          fill="url(#cvFill)"
        />
        <path
          d="M0,108 C24,112 48,116 72,110 C100,103 120,52 144,40 C168,52 192,100 216,106 C240,112 256,96 288,88 C320,80 340,38 360,26"
          fill="none"
          stroke="#070094"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <div className="mt-3 flex justify-between text-xs text-gray-400">
        <span>Jan</span>
        <span>Feb</span>
        <span>Mar</span>
        <span>Apr</span>
        <span>May</span>
        <span>Jun</span>
      </div>
    </div>
  );
}

export function TrustNote() {
  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
        <Check className="h-4 w-4" />
        Partial payment received
      </div>
      <div className="rounded-lg border border-gray-200 p-4">
        <p className="mb-2 text-xs uppercase tracking-wide text-gray-400">Notes</p>
        <p className="text-sm leading-relaxed text-gray-600">
          Chris Smith requested a call to review his updated repayment plan. He has
          recently cleared a partial payment.
        </p>
      </div>
    </div>
  );
}

export function NegotiationChat() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
        <MessageCircle className="h-4 w-4 text-accent" />
        <span className="text-sm font-medium text-black">
          WhatsApp · Negotiation
        </span>
      </div>
      <div className="space-y-3 bg-gray-50 p-4">
        <div className="max-w-[82%] rounded-2xl rounded-tl-sm border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700">
          I can't pay the full amount this month.
        </div>
        <div className="ml-auto max-w-[82%] rounded-2xl rounded-tr-sm bg-accent px-3 py-2 text-sm text-white">
          No problem—I can split it into 3 instalments of ₹4,000. Shall I set that
          up?
        </div>
        <div className="max-w-[82%] rounded-2xl rounded-tl-sm border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700">
          Yes, that works. Thank you!
        </div>
      </div>
    </div>
  );
}
