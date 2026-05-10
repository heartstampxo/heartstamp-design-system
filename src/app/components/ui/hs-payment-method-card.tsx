import React, { useRef, useState } from "react";

/*
  hs-payment-method-card — Selectable saved payment method row

  PaymentMethodCard
  · Displays a card network brand logo, card type, masked card number, and expiry
  · Checked / unchecked selection state with accessible keyboard interaction
  · Built-in logos: visa | mastercard | amex | discover | unionpay
  · Pass `logo` to render any custom ReactNode in the brand slot
*/

/* ─── Brand logos (inlined from src/assets/payment_logos) ────── */

/* visa.svg — 84×58, white card frame */
function VisaLogo() {
  return (
    <svg width={42} height={29} viewBox="0 0 84 58" fill="none">
      <rect x="0.5" y="0.5" width="83" height="57" rx="3.5" fill="white" stroke="#F3F3F3"/>
      <path d="M37.2957 39.7782H31.7032L35.2011 19.4772H40.7933L37.2957 39.7782Z" fill="#15195A"/>
      <path d="M57.5686 19.9735C56.4655 19.5627 54.7159 19.1092 52.5525 19.1092C47.0298 19.1092 43.1407 21.8734 43.1168 25.8255C43.0709 28.7413 45.9013 30.3608 48.0182 31.333C50.1818 32.3265 50.9173 32.9749 50.9173 33.8605C50.8953 35.2205 49.169 35.8474 47.5588 35.8474C45.3261 35.8474 44.1297 35.5242 42.3116 34.7675L41.5752 34.4432L40.7926 39.0003C42.1043 39.5612 44.5208 40.0589 47.0298 40.0808C52.8978 40.0808 56.7181 37.3593 56.7633 33.1477C56.7857 30.8367 55.2911 29.066 52.069 27.619C50.113 26.6901 48.9151 26.0637 48.9151 25.1133C48.9381 24.2493 49.9283 23.3644 52.1363 23.3644C53.9544 23.321 55.2902 23.7312 56.3022 24.1417L56.808 24.3573L57.5686 19.9735Z" fill="#15195A"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M67.5793 19.4772H71.9051L76.4168 39.7779H71.2387C71.2387 39.7779 70.732 37.4454 70.5714 36.7326H63.3911C63.1835 37.2723 62.2174 39.7779 62.2174 39.7779H56.3494L64.6563 21.1616C65.2319 19.844 66.2453 19.4772 67.5793 19.4772ZM67.2348 26.9062C67.2348 26.9062 65.4625 31.42 65.002 32.5863H69.6504C69.4204 31.5713 68.3614 26.7119 68.3614 26.7119L67.9706 24.9626C67.806 25.4131 67.568 26.0324 67.4074 26.4501C67.2986 26.7332 67.2254 26.9237 67.2348 26.9062Z" fill="#15195A"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M7.47169 19.4772H16.4695C17.6891 19.5199 18.6787 19.8871 19.0007 21.1837L20.956 30.5102C20.9563 30.5111 20.9566 30.512 20.9568 30.5129L21.5553 33.3205L27.0322 19.4772H32.9458L24.1554 39.7567H18.2415L13.2569 22.1169C11.5371 21.1732 9.57422 20.4141 7.37964 19.8874L7.47169 19.4772Z" fill="#15195A"/>
    </svg>
  );
}

/* ms.svg — 84×58, white card frame, Mastercard circles */
function MastercardLogo() {
  return (
    <svg width={42} height={29} viewBox="0 0 84 58" fill="none">
      <rect x="0.5" y="0.5" width="83" height="57" rx="3.5" fill="white" stroke="#F3F3F3"/>
      <path d="M49.6906 42.0159H34.6994V15.2427H49.6906V42.0159Z" fill="#FF5F00"/>
      <path d="M35.6598 28.6272C35.6598 23.1961 38.2187 18.3583 42.2036 15.2406C39.2896 12.9607 35.6119 11.6 31.615 11.6C22.1529 11.6 14.4828 19.2232 14.4828 28.6272C14.4828 38.0311 22.1529 45.6543 31.615 45.6543C35.6119 45.6543 39.2896 44.2936 42.2036 42.0138C38.2187 38.8961 35.6598 34.0582 35.6598 28.6272Z" fill="#EB001B"/>
      <path d="M69.9092 28.6272C69.9092 38.0311 62.239 45.6543 52.7769 45.6543C48.7801 45.6543 45.1024 44.2936 42.1873 42.0138C46.1732 38.8961 48.7321 34.0582 48.7321 28.6272C48.7321 23.1961 46.1732 18.3583 42.1873 15.2406C45.1024 12.9607 48.7801 11.6 52.7769 11.6C62.239 11.6 69.9092 19.2232 69.9092 28.6272Z" fill="#F79E1B"/>
    </svg>
  );
}

/* amex.svg — 84×42, white card frame, AMEX wordmark in #016FD0 */
function AmexLogo() {
  return (
    <svg width={42} height={21} viewBox="0 0 84 42" fill="none">
      <rect x="0.5" y="0.5" width="83" height="41" rx="3.5" fill="white" stroke="#F3F3F3"/>
      <path d="M10.7826 8.85709L7 17.5838H9.46269L10.1606 15.8363H14.2181L14.9124 17.5838H17.4294L13.6504 8.85709H10.7826ZM12.1821 10.8881L13.4189 13.9417H10.9418L12.1821 10.8881V10.8881Z" fill="#016FD0"/>
      <path d="M17.69 17.5824V8.85571L21.1896 8.86861L23.2251 14.495L25.2119 8.85571H28.6835V17.5824H26.4848V11.1522L24.1541 17.5824H22.2259L19.8887 11.1522V17.5824H17.69Z" fill="#016FD0"/>
      <path d="M30.1879 17.5824V8.85571H37.3626V10.8077H32.4097V12.3005H37.2469V14.1377H32.4097V15.6878H37.3626V17.5824H30.1879Z" fill="#016FD0"/>
      <path d="M38.6355 8.85721V17.5839H40.8342V14.4836H41.7599L44.3962 17.5839H47.0831L44.1901 14.3688C45.3774 14.2694 46.6022 13.2582 46.6022 11.6884C46.6022 9.85197 45.1495 8.85721 43.5283 8.85721H38.6355V8.85721ZM40.8342 10.8092H43.3475C43.9504 10.8092 44.389 11.2772 44.389 11.7278C44.389 12.3076 43.8207 12.6464 43.38 12.6464H40.8342V10.8092V10.8092Z" fill="#016FD0"/>
      <path d="M49.7446 17.5824H47.4996V8.85571H49.7446V17.5824Z" fill="#016FD0"/>
      <path d="M55.0678 17.5824H54.5832C52.2386 17.5824 50.815 15.7495 50.815 13.255C50.815 10.6987 52.2226 8.85571 55.1835 8.85571H57.6137V10.9226H55.0947C53.8927 10.9226 53.0427 11.8533 53.0427 13.2765C53.0427 14.9665 54.0147 15.6763 55.415 15.6763H55.9936L55.0678 17.5824Z" fill="#016FD0"/>
      <path d="M59.8522 8.85721L56.0695 17.5839H58.5322L59.2302 15.8364H63.2877L63.982 17.5839H66.4989L62.7199 8.85721H59.8522ZM61.2517 10.8882L62.4885 13.9418H60.0113L61.2517 10.8882Z" fill="#016FD0"/>
      <path d="M66.7556 17.5824V8.85571H69.551L73.1203 14.3386V8.85571H75.319V17.5824H72.614L68.9543 11.956V17.5824H66.7556Z" fill="#016FD0"/>
      <path d="M18.0275 32.8542V24.1275H25.2022V26.0795H20.2494V27.5722H25.0865V29.4094H20.2494V30.9596H25.2022V32.8542H18.0275Z" fill="#016FD0"/>
      <path d="M53.1835 32.8542V24.1275H60.3582V26.0795H55.4054V27.5722H60.2194V29.4094H55.4054V30.9596H60.3582V32.8542H53.1835Z" fill="#016FD0"/>
      <path d="M25.4807 32.8542L28.9741 28.5447L25.3976 24.1275H28.1676L30.2976 26.8582L32.4349 24.1275H35.0964L31.5669 28.4908L35.0667 32.8542H32.2971L30.2289 30.1666L28.211 32.8542H25.4807Z" fill="#016FD0"/>
      <path d="M35.3277 24.129V32.8557H37.5842V30.0999H39.8987C41.857 30.0999 43.3414 29.069 43.3414 27.0642C43.3414 25.4034 42.1772 24.129 40.1843 24.129H35.3277V24.129ZM37.5842 26.1026H40.0216C40.6543 26.1026 41.1065 26.4873 41.1065 27.1073C41.1065 27.6897 40.6566 28.112 40.0144 28.112H37.5842V26.1026Z" fill="#016FD0"/>
      <path d="M44.2962 24.1275V32.8542H46.4949V29.7539H47.4207L50.0569 32.8542H52.7438L49.8508 29.6391C51.0381 29.5397 52.2629 28.5285 52.2629 26.9586C52.2629 25.1222 50.8102 24.1275 49.189 24.1275H44.2962V24.1275ZM46.4949 26.0795H49.0082C49.6111 26.0795 50.0497 26.5475 50.0497 26.9981C50.0497 27.5779 49.4814 27.9167 49.0407 27.9167H46.4949V26.0795V26.0795Z" fill="#016FD0"/>
      <path d="M61.3765 32.8542V30.9596H65.7768C66.4279 30.9596 66.7098 30.6105 66.7098 30.2276C66.7098 29.8607 66.4288 29.4898 65.7768 29.4898H63.7884C62.06 29.4898 61.0974 28.4449 61.0974 26.8761C61.0974 25.4769 61.9789 24.1275 64.5473 24.1275H68.829L67.9032 26.091H64.2001C63.4923 26.091 63.2744 26.4596 63.2744 26.8115C63.2744 27.1733 63.5436 27.5722 64.0844 27.5722H66.1674C68.0942 27.5722 68.9302 28.6567 68.9302 30.0769C68.9302 31.6037 67.9986 32.8542 66.0625 32.8542H61.3765Z" fill="#016FD0"/>
      <path d="M69.4463 32.8542V30.9596H73.8466C74.4977 30.9596 74.7796 30.6105 74.7796 30.2276C74.7796 29.8607 74.4986 29.4898 73.8466 29.4898H71.8582C70.1297 29.4898 69.1671 28.4449 69.1671 26.8761C69.1671 25.4769 70.0486 24.1275 72.6171 24.1275H76.8987L75.973 26.091H72.2699C71.562 26.091 71.3441 26.4596 71.3441 26.8115C71.3441 27.1733 71.6134 27.5722 72.1542 27.5722H74.2372C76.1639 27.5722 77 28.6567 77 30.0769C77 31.6037 76.0683 32.8542 74.1323 32.8542H69.4463Z" fill="#016FD0"/>
    </svg>
  );
}

/* discover — 924-path original is 210KB; simplified to key shapes */
function DiscoverLogo() {
  return (
    <svg width={42} height={29} viewBox="0 0 84 58" fill="none">
      <rect x="0.5" y="0.5" width="83" height="57" rx="3.5" fill="white" stroke="#F3F3F3"/>
      {/* Wordmark approximation */}
      <text x="7" y="34" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="11" fill="#231F20" style={{ letterSpacing: "-0.3px" }}>discover</text>
      {/* Orange starburst approximated as gradient circle */}
      <circle cx="70" cy="29" r="11" fill="#F47521"/>
      <circle cx="70" cy="29" r="8" fill="#F9A020"/>
    </svg>
  );
}

/* unionpay.svg — 84×58, three-band geometric logo */
function UnionPayLogo() {
  return (
    <svg width={42} height={29} viewBox="0 0 84 58" fill="none">
      <path d="M20.7089 6.99506H38.1765C40.6261 6.99506 42.1364 8.99929 41.5673 11.4575L33.4296 46.5462C32.8587 48.9966 30.4148 50.9951 27.9787 50.9951H10.5073C8.06351 50.9951 6.5513 48.9966 7.11838 46.5462L15.2523 11.4575C15.8232 8.99929 18.2651 6.99506 20.7089 6.99506Z" fill="#ED171F"/>
      <path d="M36.7298 6.99506H56.8167C59.2567 6.99506 58.1572 8.99929 57.5825 11.4575L49.4466 46.5462C48.8796 48.9966 49.057 50.9951 46.6132 50.9951H26.5282C24.0786 50.9951 22.5664 48.9966 23.1393 46.5462L31.2693 11.4575C31.846 8.99929 34.2821 6.99506 36.7298 6.99506Z" fill="#082F67"/>
      <path d="M56.022 6.99506H73.4876C75.9314 6.99506 77.4514 8.99929 76.8785 11.4575L68.7408 46.5462C68.1698 48.9966 65.7241 50.9951 63.2822 50.9951H45.8185C43.3766 50.9951 41.8605 48.9966 42.4315 46.5462L50.5692 11.4575C51.1382 8.99929 53.5801 6.99506 56.022 6.99506Z" fill="#006A65"/>
      <path d="M23.9513 20.6056C22.0726 20.625 21.5248 20.6056 21.3455 20.5649C21.2722 20.885 20.0049 26.7599 20.0049 26.7599C19.731 27.9512 19.5285 28.801 18.8592 29.3385C18.4734 29.6605 18.0279 29.8196 17.509 29.8196C16.6796 29.8196 16.1955 29.4025 16.1087 28.609L16.101 28.3451C16.101 28.3451 16.3498 26.7522 16.3556 26.7425C16.3556 26.7425 17.6787 21.3914 17.9179 20.6852C17.9237 20.6425 17.9314 20.6289 17.9411 20.6095C15.3487 20.6328 14.8877 20.6095 14.8588 20.5687C14.8472 20.6211 14.772 20.9548 14.772 20.9548L13.4179 26.9792L13.2984 27.4972L13.0765 29.1677C13.0765 29.6625 13.173 30.0641 13.3659 30.4114C13.9927 31.5037 15.7538 31.659 16.7529 31.659C18.0375 31.659 19.2353 31.3873 20.0512 30.8829C21.467 30.0447 21.8412 28.7331 22.1652 27.5671L22.3234 26.9656C22.3234 26.9656 23.6948 21.4088 23.932 20.6852C23.932 20.6425 23.9397 20.6289 23.9513 20.6095Z" fill="white"/>
      <path d="M28.6133 25.0894C28.2835 25.0894 27.6797 25.1709 27.1377 25.4387C26.9371 25.5434 26.7481 25.654 26.5552 25.7743L26.7288 25.1263L26.6343 25.0176C25.4867 25.2505 25.2263 25.2893 24.1693 25.4367L24.0844 25.4969C23.9513 26.5213 23.8529 27.2935 23.3881 29.3171C23.2126 30.0505 23.0293 30.8014 22.8499 31.5484L22.8962 31.6415C23.9976 31.5891 24.3197 31.5891 25.2629 31.5988L25.3439 31.5173C25.4577 30.8984 25.477 30.7568 25.7471 29.5015C25.8666 28.9039 26.1251 27.6 26.2543 27.1325C26.4954 27.0257 26.7211 26.9249 26.9487 26.9249C27.4791 26.9249 27.4116 27.3827 27.3962 27.5729C27.3769 27.8814 27.1763 28.8961 26.9776 29.7692L26.8503 30.3241C26.7578 30.7451 26.6555 31.1487 26.563 31.5658L26.6054 31.6415C27.6759 31.5891 27.9961 31.5891 28.9161 31.5988L29.0222 31.5173C29.1881 30.553 29.2402 30.2931 29.5334 28.8883L29.6819 28.2423C29.9693 26.9753 30.112 26.337 29.894 25.8151C29.6645 25.2291 29.1129 25.0875 28.6114 25.0875Z" fill="white"/>
      <path d="M33.8096 26.4107C33.2425 26.5213 32.8799 26.5873 32.523 26.6474C32.1643 26.7017 31.8152 26.7522 31.2597 26.8278L31.2172 26.8686L31.1806 26.8996C31.1227 27.3148 31.0841 27.668 31.007 28.089C30.9318 28.5216 30.8372 29.0164 30.6772 29.7207C30.5518 30.262 30.4881 30.4502 30.4168 30.6404C30.3493 30.8324 30.2721 31.0206 30.1351 31.5484L30.1969 31.6415C30.7099 31.6163 31.0417 31.5988 31.3889 31.5949C31.7361 31.5891 32.0929 31.5949 32.6465 31.5988L32.6966 31.5658L32.7468 31.5154C32.8297 31.0342 32.8374 30.9081 32.8876 30.6695C32.9358 30.4192 33.0188 30.0738 33.2251 29.1483C33.3197 28.704 33.4335 28.2752 33.5338 27.8309C33.6418 27.3808 33.7459 26.9462 33.8482 26.5077L33.8308 26.4631L33.8077 26.4088L33.8096 26.4107Z" fill="white"/>
      <path d="M38.4542 25.1263C37.9276 25.1263 36.6739 25.1806 35.6902 26.0944C34.9939 26.7405 34.6679 27.633 34.4654 28.4809C34.2706 29.354 34.0372 30.9159 35.4684 31.5018C35.9159 31.6881 36.5485 31.7404 36.9555 31.7404C38.0086 31.7404 39.083 31.4494 39.8854 30.588C40.5142 29.8914 40.7958 28.8592 40.8903 28.4246C41.2163 27.0025 40.9713 26.3447 40.655 25.9392C40.1689 25.3281 39.3318 25.1263 38.4542 25.1263ZM38.4889 28.3257C38.4465 28.5566 38.2382 29.4491 37.9546 29.8274C37.7618 30.1087 37.5264 30.2775 37.2641 30.2775C37.1928 30.2775 36.7395 30.2775 36.7318 29.6023C36.7221 29.2686 36.7916 28.9233 36.8822 28.5488C37.1156 27.4739 37.4107 26.5717 38.1379 26.5717C38.7069 26.5717 38.7435 27.2489 38.4909 28.3257Z" fill="white"/>
      <path d="M56.1146 24.0048C55.9507 24.7382 55.48 25.361 54.8724 25.654C54.3613 25.9101 53.7499 25.9315 53.1153 25.9315H52.7025L52.7334 25.7704L53.4933 22.4624L53.5126 22.3033L53.528 22.1714L53.8289 22.2005C53.8289 22.2005 55.3797 22.3324 55.4202 22.3324C56.0336 22.5749 56.2882 23.1977 56.1127 24.0048Z" fill="white"/>
    </svg>
  );
}

const BRAND_LOGOS: Record<PaymentBrand, React.ComponentType> = {
  visa:       VisaLogo,
  mastercard: MastercardLogo,
  amex:       AmexLogo,
  discover:   DiscoverLogo,
  unionpay:   UnionPayLogo,
};

const BRAND_NAMES: Record<PaymentBrand, string> = {
  visa:       "VISA",
  mastercard: "MASTERCARD",
  amex:       "AMEX",
  discover:   "DISCOVER",
  unionpay:   "UNIONPAY",
};

/* ─── Types ─────────────────────────────────────────────────── */

export type PaymentBrand = "visa" | "mastercard" | "amex" | "discover" | "unionpay";

/* ─── Private: checkbox ──────────────────────────────────────── */

function CardCheckbox({ checked }: { checked: boolean }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: "var(--space-5)", height: "var(--space-5)", flexShrink: 0,
        borderRadius: "var(--radius-xs)",
        border: checked ? "none" : "1.5px solid var(--color-element-subtle)",
        background: checked ? "var(--color-text-primary)" : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background 0.15s ease, border-color 0.15s ease",
      }}
    >
      {checked && (
        <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
          <path
            d="M1 3.5L4 6.5L10 1"
            stroke="var(--color-bg-main)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PaymentMethodCard
══════════════════════════════════════════════════════════════ */

export interface PaymentMethodCardProps {
  /** Card network brand. Auto-formats the card title and renders the built-in logo. */
  brand?: PaymentBrand;
  /** Custom logo node — overrides the built-in brand logo when provided. */
  logo?: React.ReactNode;
  /** Card type label shown below the logo. e.g. `"Credit"` or `"Debit"`. Defaults to `"Credit"`. */
  type?: string;
  /** Last 4 digits of the card number. Shown as `**** {lastFour}` in the title. */
  lastFour: string;
  /** Expiry in `MM/YYYY` format. Displayed as `Exp. {expiry}`. */
  expiry: string;
  /** Overrides the auto-generated card title (e.g. `"VISA ENDING IN **** 6754"`). */
  cardTitle?: string;
  /** Whether this card is currently selected. Defaults to `false`. */
  selected?: boolean;
  /** Called when the user clicks or presses the card row. */
  onChange?: (selected: boolean) => void;
  style?: React.CSSProperties;
  className?: string;
}

export function PaymentMethodCard({
  brand,
  logo,
  type        = "Credit",
  lastFour,
  expiry,
  cardTitle,
  selected    = false,
  onChange,
  style,
  className,
}: PaymentMethodCardProps) {
  const [focusVisible, setFocusVisible] = useState(false);
  const pointerDown = useRef(false);

  const brandName = brand ? BRAND_NAMES[brand] : "";
  const title     = cardTitle ?? (brandName
    ? `${brandName} ENDING IN **** ${lastFour}`
    : `ENDING IN **** ${lastFour}`
  );

  const LogoComponent = brand ? BRAND_LOGOS[brand] : null;
  const logoNode      = logo ?? (LogoComponent ? <LogoComponent /> : null);

  return (
    <div
      role="checkbox"
      aria-checked={selected}
      aria-label={title}
      tabIndex={0}
      onClick={() => onChange?.(!selected)}
      onKeyDown={e => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onChange?.(!selected))}
      onPointerDown={() => { pointerDown.current = true; }}
      onFocus={() => { if (!pointerDown.current) setFocusVisible(true); }}
      onBlur={() => { setFocusVisible(false); pointerDown.current = false; }}
      style={{
        display: "flex", alignItems: "center", gap: "var(--space-4)",
        minHeight: 96, boxSizing: "border-box",
        padding: "var(--space-4)",
        borderRadius: "var(--radius-2xl)",
        border: "none",
        boxShadow: selected
          ? "0 0 0 2px var(--color-text-primary)"
          : "0 0 0 1px var(--border)",
        outline: focusVisible ? "2px solid var(--color-ring)" : "none",
        outlineOffset: 2,
        background: "var(--color-bg-main)",
        cursor: "pointer",
        userSelect: "none",
        transition: "box-shadow 0.15s ease",
        ...style,
      }}
      className={className}
    >
      {/* ── Brand area ─────────────────────────────────────── */}
      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
        <div style={{ minHeight: "var(--space-5)", display: "flex", alignItems: "center" }}>
          {logoNode}
        </div>
        {type && (
          <span style={{
            fontSize:   "var(--font-size-label-12)",
            fontWeight: "var(--font-weight-label-12)" as React.CSSProperties["fontWeight"],
            color:      "var(--color-text-secondary)",
          }}>
            {type}
          </span>
        )}
      </div>

      {/* ── Card info ──────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
        <span style={{
          fontSize:   "var(--font-size-label-15)",
          fontWeight: "var(--font-weight-label-sb-15)" as React.CSSProperties["fontWeight"],
          color:      "var(--color-text-primary)",
          lineHeight: 1.2,
        }}>
          {title}
        </span>
        <span style={{
          fontSize:   "var(--font-size-body-13)",
          fontWeight: "var(--font-weight-body-13)" as React.CSSProperties["fontWeight"],
          color:      "var(--color-text-secondary)",
        }}>
          Exp. {expiry}
        </span>
      </div>

      {/* ── Checkbox ───────────────────────────────────────── */}
      <CardCheckbox checked={selected} />
    </div>
  );
}
