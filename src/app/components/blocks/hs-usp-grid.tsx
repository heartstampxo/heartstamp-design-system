import * as React from "react";
import { useInjectedStyle, cssMin } from "../ui/hs-style-inject";
import { useRevealCascade } from "../ui/hs-reveal";
import { Btn } from "../ui/btn";

/* ═══════════════════════════════════════════════════════════════════════════
   USP GRID — "Why we are different", the selling-points grid.

   An eyebrow and headline over a grid of icon/title/copy cells. The marketing
   page drives the hover from its behaviour class, tracking which cell is under
   the pointer in React state; here it is plain CSS, which is the same result
   without a re-render per mouse movement.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface UspItem {
  title: React.ReactNode;
  desc: React.ReactNode;
  /**
   * SVG path data, drawn on a 40x40 viewBox and filled with currentColor so
   * the hover tint reaches it. Pass `iconNode` instead for anything richer.
   */
  icon?: string;
  /** A whole icon element, when a single path will not do. */
  iconNode?: React.ReactNode;
}

export const USP_ITEMS: UspItem[] = [
  {
    title: "Customization is free",
    desc: "Skip generic cards. Stampy crafts unique designs fast and prints them for you.",
    icon: "M31.5928 26.3816C32.0893 26.3816 32.5428 26.4473 32.9746 26.5788V27.4558C33.1689 27.5216 33.3634 27.6093 33.5361 27.697L34.1621 27.0612C34.9826 27.5437 35.6307 28.2456 36.0625 29.0788L35.4355 29.737C35.5003 29.9123 35.5652 30.0657 35.6299 30.2409H36.5156C36.6235 30.6574 36.667 31.074 36.667 31.5124C36.667 32.0386 36.6022 32.5653 36.4512 33.0476V33.07H35.5439C35.5008 33.2015 35.4358 33.3546 35.3711 33.4861L35.9971 34.1228C35.5005 34.9558 34.8311 35.614 34.0107 36.0525L33.3848 35.4157C33.2552 35.4815 33.1256 35.5262 32.9961 35.57V36.4685C32.5859 36.622 32.0893 36.6882 31.6143 36.6882C31.1393 36.6882 30.6857 36.6225 30.2539 36.4909V35.5915C30.1244 35.5696 29.9948 35.504 29.8652 35.4382L29.2178 36.0739C28.3975 35.6136 27.7065 34.9558 27.2314 34.1228L27.8359 33.5085C27.7712 33.3552 27.7063 33.2015 27.6416 33.07H26.7559C26.6263 32.5876 26.54 32.083 26.54 31.5349C26.54 31.0965 26.605 30.658 26.7129 30.2634H27.5762C27.6409 30.0881 27.7057 29.9123 27.792 29.737L27.1445 29.0788C27.598 28.2456 28.2459 27.5437 29.0664 27.0612L29.6924 27.697C29.8867 27.6093 30.0596 27.5216 30.2539 27.4558V26.5573C30.6642 26.4477 31.0962 26.3816 31.5928 26.3816ZM13.4707 7.83566C13.9437 4.97517 16.6439 3.05062 19.502 3.53781L29.8955 5.31027C32.7407 5.79566 34.6725 8.48982 34.2197 11.3405L31.9922 25.3571L29.5254 24.9529L31.7529 10.9353C31.99 9.4421 30.9776 8.03128 29.4873 7.77707L19.0947 6.00461C17.5976 5.74927 16.1824 6.75715 15.9346 8.25558L13.4082 23.5349C13.1624 25.0215 14.17 26.4862 15.7119 26.8288C19.1873 27.6006 22.2272 28.4387 25.9004 29.0652L25.4922 31.531C25.1283 31.4689 24.7698 31.4019 24.415 31.3357V32.3806C24.415 34.4908 22.7039 36.2016 20.5938 36.2019H8.59961C5.70018 36.2019 3.34972 33.8513 3.34961 30.9519V13.2409C3.34985 10.3416 5.70026 7.99094 8.59961 7.99094H13.4453L13.4707 7.83566ZM31.6143 29.2546C30.3619 29.2546 29.3682 30.2631 29.3682 31.5349C29.3682 32.8067 30.3836 33.8152 31.6143 33.8152C32.8665 33.8151 33.8593 32.8066 33.8594 31.5349C33.8594 30.2631 32.8665 29.2547 31.6143 29.2546ZM8.59961 10.4909C7.08097 10.4909 5.84985 11.7224 5.84961 13.2409V30.9519C5.84972 32.4706 7.0809 33.7019 8.59961 33.7019H20.5938C21.3232 33.7016 21.915 33.11 21.915 32.3806V30.8279C19.5914 30.3212 17.4073 29.7652 15.1826 29.2712C12.4106 28.6556 10.4694 25.9872 10.9443 23.115L13.0312 10.4909H8.59961Z",
  },
  {
    title: "Design your card in minute",
    desc: "Stop sending generic cards. Stampy creates custom, full-bleed interior designs in minutes.",
    icon: "M34.5422 31.2089L29.7737 35.9472L26.6672 36.3662L26.7493 33.3037L31.5715 28.539L34.5422 31.2089ZM20.8723 3.49604C22.7691 3.14472 24.6058 4.07029 25.5012 5.66303L29.0432 4.33589L29.1819 4.28901C30.611 3.85328 32.0831 4.92179 32.0832 6.44331V8.86225C34.4629 9.36149 36.2501 11.472 36.2502 13.9999V24.9999H33.7502V13.9999C33.7501 12.4814 32.5188 11.2501 31.0002 11.2499H19.0002C17.4817 11.2501 16.2504 12.4814 16.2502 13.9999V30.9999C16.2502 32.5186 17.4816 33.7498 19.0002 33.7499H25.0002V36.2499H19.0002C16.7066 36.2498 14.7569 34.7785 14.0422 32.7285L13.2385 32.8779C10.3876 33.4058 7.6484 31.5227 7.12036 28.6718L4.02368 11.956C3.49597 9.10538 5.37924 6.36615 8.22973 5.83784L20.8723 3.49604ZM23.092 6.56635C22.6664 6.08374 22.0061 5.82834 21.3274 5.95405L8.68579 8.29585C7.19264 8.57256 6.20622 10.0077 6.48266 11.5009L9.57837 28.2167C9.85502 29.71 11.2902 30.6963 12.7834 30.4199L13.7502 30.2402V13.9999C13.7503 12.056 14.8069 10.3585 16.3772 9.45112C16.5126 9.17405 16.7504 8.94586 17.0618 8.82905L23.092 6.56635ZM33.4534 26.6542C33.8621 26.2621 34.4891 26.2616 34.8704 26.6279L36.3684 28.0419C36.7769 28.4083 36.7767 29.0104 36.3684 29.3769H36.3957L35.4963 30.2666L32.5266 27.5703L33.4534 26.6542ZM24.3918 8.74995H29.5832V6.80268L24.3918 8.74995Z",
  },
  {
    title: "Creative sidekick",
    desc: "Have it shipped to you, or let us mail it straight to your recipient. Perfect for Xmas cards.",
    icon: "M12.5005 21.25H9.07374C8.2536 21.25 7.54278 21.8196 7.36476 22.6201L5.22999 32.2285C5.05654 33.0091 5.6502 33.7498 6.44972 33.75H33.5503C34.3498 33.7498 34.9444 33.009 34.771 32.2285L32.6353 22.6201C32.4573 21.8197 31.7472 21.2502 30.9273 21.25H29.1665V18.75H30.9273C32.919 18.7502 34.6436 20.1338 35.0757 22.0781L37.2114 31.6865C37.7317 34.0283 35.9492 36.2498 33.5503 36.25H6.44972C4.05082 36.2498 2.26916 34.0283 2.78956 31.6865L4.92433 22.0781C5.35647 20.1336 7.08179 18.75 9.07374 18.75H12.5005V21.25ZM27.4683 6.29102C28.4934 5.19634 30.1223 5.14806 31.2261 6.04395L31.44 6.23633L31.4429 6.23926L33.7495 8.54688L33.9448 8.76172C34.854 9.86893 34.7757 11.4822 33.8101 12.5215L19.2671 28.3447C18.9183 28.7241 18.4497 28.9724 17.94 29.0479L14.4624 29.5625L14.4546 29.5645L14.4458 29.5654C13.1343 29.7415 12.0839 28.6853 12.0835 27.4658V27.4385L12.1636 23.7607L12.1773 23.5566C12.2307 23.0843 12.4332 22.6386 12.7573 22.2861L27.4605 6.2998L27.4683 6.29102ZM29.4702 7.91699C29.4135 7.91749 29.3531 7.93726 29.2964 7.99609L14.6597 23.9092L14.5933 27.0156L17.4858 26.5879L31.9702 10.8301L31.978 10.8213C32.1278 10.6612 32.1051 10.4371 31.9878 10.3203L29.6743 8.00684V8.00586C29.6042 7.93814 29.5295 7.91663 29.4702 7.91699ZM9.20362 8.3418C9.22123 8.3418 9.23924 8.34226 9.25245 8.35547C9.26124 8.35548 9.27003 8.35986 9.27882 8.36426C9.29201 8.37306 9.30567 8.38622 9.31886 8.39941C9.32743 8.40387 9.33209 8.41265 9.33643 8.41699C9.34953 8.43013 9.35842 8.44389 9.3628 8.45703C9.36713 8.47002 9.37117 8.48311 9.3755 8.49609C9.3799 8.5049 9.38429 8.50975 9.38429 8.51855L9.46827 9.02441C9.73238 10.6487 11.0042 11.9257 12.6284 12.1943L13.1528 12.2822C13.1545 12.283 13.1708 12.291 13.1792 12.291C13.188 12.2954 13.2017 12.2993 13.2105 12.3037C13.2235 12.304 13.2365 12.3175 13.2495 12.3262C13.2582 12.3349 13.2672 12.339 13.2759 12.3477C13.2847 12.3609 13.2935 12.3706 13.3023 12.3838C13.3025 12.3924 13.3116 12.4011 13.3159 12.4141C13.3247 12.4272 13.3286 12.4405 13.3286 12.458C13.333 12.4668 13.3374 12.4761 13.3374 12.4805H13.3335V12.5195C13.3335 12.5195 13.3335 12.5332 13.3247 12.542C13.3247 12.5595 13.3198 12.5728 13.311 12.5859C13.3067 12.5988 13.3027 12.6076 13.2983 12.6162C13.2895 12.6294 13.2808 12.6435 13.272 12.6523C13.2633 12.661 13.2543 12.6652 13.2456 12.6738C13.2324 12.6826 13.2188 12.6919 13.2056 12.6963C13.1968 12.7007 13.1831 12.7046 13.1743 12.709C13.1656 12.7133 13.1567 12.7178 13.148 12.7178L12.6245 12.8057C11.0089 13.0742 9.74071 14.3424 9.47218 15.958L9.38429 16.4814C9.38429 16.4814 9.3799 16.4995 9.3755 16.5039C9.37113 16.517 9.36717 16.5303 9.3628 16.5391C9.3584 16.5523 9.34915 16.5659 9.34034 16.5791C9.33173 16.5878 9.32756 16.5968 9.31886 16.6055C9.31009 16.6142 9.29685 16.6231 9.2837 16.6318C9.27491 16.6362 9.26562 16.6401 9.25245 16.6445C9.23927 16.6533 9.22606 16.6582 9.20851 16.6582C9.19973 16.6626 9.19483 16.667 9.18604 16.667H9.15089C9.14903 16.6665 9.13281 16.6623 9.12452 16.6582C9.10702 16.6582 9.09373 16.6533 9.08058 16.6445C9.0677 16.6402 9.05891 16.6361 9.0503 16.6318C9.03727 16.6231 9.02807 16.6142 9.01515 16.6055C9.00642 16.5967 9.00133 16.5878 8.99268 16.5791C8.98388 16.5659 8.97463 16.5523 8.97022 16.5391C8.96584 16.5303 8.96191 16.5166 8.95753 16.5078C8.95753 16.4991 8.95742 16.4901 8.94874 16.4814L8.86085 15.958C8.59232 14.3336 7.31533 13.0615 5.69093 12.8018L5.18507 12.7178C5.18507 12.7178 5.17141 12.7178 5.16261 12.709C5.1495 12.7046 5.13621 12.7007 5.12745 12.6963C5.10993 12.6919 5.09665 12.6787 5.08351 12.6699C5.0747 12.6655 5.07033 12.6607 5.06593 12.6562C5.05273 12.643 5.03957 12.625 5.03077 12.6074C5.02637 12.6074 5.02198 12.5942 5.02198 12.5898C5.01331 12.5724 5.00835 12.5551 5.00831 12.542C5.00391 12.5332 4.99952 12.5239 4.99952 12.5195C4.99961 12.5109 5.0044 12.5063 5.0044 12.502C5.00432 12.4933 4.99952 12.4887 4.99952 12.4844C4.99959 12.4758 5.00401 12.4714 5.00831 12.4629C5.00831 12.4453 5.01318 12.4273 5.02198 12.4141C5.02201 12.4054 5.02645 12.397 5.03077 12.3926C5.03958 12.375 5.05272 12.3609 5.06593 12.3477C5.07039 12.3391 5.07916 12.3344 5.08351 12.3301C5.09665 12.3213 5.10992 12.3125 5.12745 12.3037C5.13621 12.2993 5.1495 12.2954 5.16261 12.291C5.17141 12.291 5.17626 12.2866 5.18507 12.2822L5.69093 12.1982C7.32414 11.9341 8.60062 10.6576 8.86476 9.02441L8.94874 8.51855C8.94874 8.51855 8.95753 8.5049 8.95753 8.49609C8.96189 8.48299 8.96586 8.46971 8.97022 8.46094C8.97903 8.44333 8.98876 8.4302 8.99757 8.41699C9.00193 8.40833 9.0059 8.40377 9.01026 8.39941C9.02787 8.38621 9.04148 8.37306 9.05909 8.36426C9.06768 8.35992 9.07196 8.35552 9.08058 8.35547C9.09378 8.34666 9.11179 8.3418 9.1294 8.3418C9.13385 8.33754 9.14237 8.33309 9.15089 8.33301C9.15524 8.33301 9.15986 8.33779 9.16847 8.33789C9.17281 8.33789 9.17746 8.33312 9.18604 8.33301C9.19033 8.33301 9.19912 8.33751 9.20362 8.3418ZM19.189 5.00488C19.1995 5.00488 19.2103 5.00575 19.2183 5.01367C19.2235 5.01374 19.2287 5.01595 19.2339 5.01855C19.2418 5.02384 19.2494 5.03212 19.2573 5.04004C19.2624 5.04259 19.2655 5.04708 19.2681 5.0498C19.276 5.05773 19.2811 5.06629 19.2837 5.07422C19.2863 5.0821 19.2899 5.08977 19.2925 5.09766C19.2951 5.10285 19.2974 5.10609 19.2974 5.11133L19.3472 5.41504C19.5057 6.38945 20.2693 7.1552 21.2437 7.31641L21.5581 7.36914C21.5581 7.36914 21.5684 7.37478 21.5737 7.375C21.579 7.37762 21.587 7.38019 21.5923 7.38281C21.6002 7.38281 21.6088 7.39023 21.6167 7.39551C21.622 7.40073 21.6271 7.40393 21.6323 7.40918C21.6375 7.41687 21.6428 7.422 21.648 7.42969C21.648 7.4349 21.6531 7.44048 21.6558 7.44824C21.661 7.45609 21.6635 7.46419 21.6636 7.47461C21.6662 7.47989 21.6694 7.48564 21.6694 7.48828H21.6665V7.51172C21.6665 7.51172 21.6669 7.52011 21.6616 7.52539C21.6616 7.53579 21.659 7.54392 21.6538 7.55176C21.6512 7.55963 21.6477 7.56505 21.645 7.57031C21.6399 7.57807 21.6346 7.58563 21.6294 7.59082C21.6241 7.5961 21.6191 7.59921 21.6138 7.60449C21.606 7.60967 21.5981 7.61451 21.5903 7.61719C21.5852 7.61976 21.5771 7.62243 21.5718 7.625C21.5665 7.62764 21.5605 7.63086 21.5552 7.63086L21.2417 7.68359C20.2723 7.84471 19.5112 8.60583 19.3501 9.5752L19.2974 9.88867C19.2974 9.88867 19.2951 9.89943 19.2925 9.90234C19.2898 9.91027 19.2863 9.91855 19.2837 9.92383C19.281 9.93158 19.2762 9.93951 19.271 9.94727C19.2657 9.95255 19.2626 9.95761 19.2573 9.96289C19.2521 9.96806 19.2446 9.97335 19.2368 9.97852C19.2316 9.98112 19.226 9.98372 19.2183 9.98633C19.2104 9.99157 19.2023 9.99508 19.1919 9.99512C19.1866 9.99776 19.1835 10 19.1782 10H19.1577C19.1577 10 19.1464 9.99776 19.1411 9.99512C19.1307 9.99506 19.1226 9.99155 19.1148 9.98633C19.1071 9.98373 19.1014 9.98111 19.0962 9.97852C19.0885 9.97335 19.0834 9.96805 19.0757 9.96289C19.0704 9.95761 19.0673 9.95255 19.062 9.94727C19.0569 9.93951 19.052 9.93158 19.0493 9.92383C19.0468 9.91869 19.0441 9.91055 19.0415 9.90527C19.0415 9.89999 19.0409 9.89395 19.0357 9.88867L18.9829 9.5752C18.8218 8.60064 18.0561 7.83659 17.0816 7.68066L16.7778 7.63086C16.7778 7.63086 16.7695 7.63028 16.7642 7.625C16.7563 7.62239 16.7479 7.6198 16.7427 7.61719C16.7324 7.61442 16.7241 7.60676 16.7163 7.60156C16.7114 7.59905 16.7091 7.59627 16.7066 7.59375C16.6986 7.58583 16.6904 7.57502 16.6851 7.56445C16.6824 7.56445 16.6802 7.55635 16.6802 7.55371C16.675 7.54334 16.6715 7.53323 16.6714 7.52539C16.6688 7.52011 16.6665 7.51436 16.6665 7.51172C16.6666 7.50655 16.6694 7.50359 16.6694 7.50098C16.6693 7.49621 16.6668 7.49365 16.6665 7.49121C16.6665 7.48599 16.6688 7.48271 16.6714 7.47754C16.6714 7.46698 16.6749 7.45616 16.6802 7.44824C16.6803 7.44313 16.6825 7.43818 16.6851 7.43555C16.6904 7.42498 16.6986 7.4171 16.7066 7.40918C16.7091 7.40408 16.7136 7.40099 16.7163 7.39844C16.7241 7.39324 16.7324 7.38801 16.7427 7.38281C16.7479 7.3802 16.7563 7.37761 16.7642 7.375C16.7695 7.375 16.7726 7.37178 16.7778 7.36914L17.0816 7.31934C18.0613 7.16078 18.8273 6.39473 18.9858 5.41504L19.0357 5.11133C19.0357 5.11133 19.0415 5.10294 19.0415 5.09766C19.0441 5.0898 19.0467 5.08141 19.0493 5.07617C19.0545 5.06584 19.0597 5.05761 19.065 5.0498C19.0675 5.04489 19.0703 5.04255 19.0728 5.04004C19.0833 5.03212 19.0915 5.02384 19.1021 5.01855C19.1071 5.01599 19.1097 5.01377 19.1148 5.01367C19.1227 5.0084 19.1335 5.00489 19.1441 5.00488C19.1467 5.0023 19.1525 5 19.1577 5C19.1602 5.00023 19.1627 5.00281 19.1675 5.00293C19.1701 5.00293 19.1731 5.00007 19.1782 5C19.1808 5 19.1863 5.00231 19.189 5.00488Z",
  },
  {
    title: "Free address book",
    desc: "Have it shipped to you, or let us mail it straight to your recipient. Perfect for Xmas cards.",
    icon: "M29.333 4.1748C32.2322 4.1748 34.5826 6.52568 34.583 9.4248V24.5547C34.5829 25.6508 34.0303 26.673 33.1133 27.2734L29.9219 29.3623C29.7104 29.5011 29.583 29.737 29.583 29.9893C29.5832 31.295 29.5836 32.8425 29.584 34.0635C29.584 34.1022 29.584 34.1406 29.584 34.1787L29.5859 34.1797V36.6797L13.999 36.6758C11.1837 36.6751 8.88618 34.4589 8.75586 31.6758H5V29.1758H8.75V25.0088H5V22.5088H8.75V18.3418L5 18.3428V15.8428L8.75 15.8418V11.6758H5V9.17578H8.75586C8.88627 6.39227 11.1843 4.17481 14 4.1748H29.333ZM14 6.6748C12.4815 6.67481 11.2504 7.9064 11.25 9.4248V31.4258C11.25 32.9442 12.4806 34.1752 13.999 34.1758L27.083 34.1787V16.0703C27.083 14.9838 27.6263 13.969 28.5303 13.3662L32.083 10.9971V9.4248C32.0826 7.9064 30.8515 6.6748 29.333 6.6748H14ZM19.167 20C21.468 20.0002 23.333 21.8659 23.333 24.167V26.667H15V24.167C15 21.8658 16.8658 20 19.167 20ZM29.917 15.4463C29.7085 15.5854 29.583 15.8197 29.583 16.0703V26.5957L31.7441 25.1816C31.9555 25.0431 32.0829 24.8074 32.083 24.5547V14.002L29.917 15.4463ZM19.167 13.333C20.5474 13.3332 21.6668 14.4526 21.667 15.833C21.667 17.2136 20.5476 18.3328 19.167 18.333C17.7863 18.333 16.667 17.2137 16.667 15.833C16.6672 14.4524 17.7864 13.333 19.167 13.333Z",
  },
  {
    title: "Mail to Multi recipients",
    desc: "Have it shipped to you, or let us mail it straight to your recipient. Perfect for Xmas cards.",
    icon: "M14.4185 33.4517C14.7915 33.6421 15.2148 33.7504 15.6665 33.7505H17.1997V36.2505H15.6665C14.8105 36.2504 13.9986 36.0442 13.2817 35.6782L14.4185 33.4517ZM22.311 36.2505H19.2446V33.7505H22.311V36.2505ZM27.4224 36.2505H24.355V33.7505H27.4224V36.2505ZM33.3843 35.6782C32.6674 36.0441 31.8554 36.2505 30.9995 36.2505H29.4663V33.7505H30.9995C31.4512 33.7505 31.8745 33.642 32.2476 33.4517L33.3843 35.6782ZM12.9165 31.0005C12.9166 31.4522 13.0249 31.8755 13.2153 32.2485L10.9888 33.3853C10.6228 32.6684 10.4166 31.8565 10.4165 31.0005V29.4146H12.9165V31.0005ZM36.2495 31.0005C36.2495 31.8564 36.0442 32.6684 35.6782 33.3853L33.4517 32.2485C33.6421 31.8755 33.7495 31.4522 33.7495 31.0005V29.2007H36.2495V31.0005ZM23.3335 3.3335C26.0949 3.3335 28.3335 5.57207 28.3335 8.3335V21.6665C28.3335 24.3418 26.2324 26.527 23.5903 26.6606L23.3335 26.6665H12.9165V27.3003H10.4165V26.6665H8.3335L8.07666 26.6606C5.43459 26.527 3.3335 24.3418 3.3335 21.6665V8.3335C3.3335 5.57207 5.57207 3.3335 8.3335 3.3335H23.3335ZM36.2495 26.8003H33.7495V23.2007H36.2495V26.8003ZM8.3335 5.8335C6.95279 5.8335 5.8335 6.95278 5.8335 8.3335V21.6665C5.8335 23.0472 6.95278 24.1665 8.3335 24.1665H23.3335C24.7142 24.1665 25.8335 23.0472 25.8335 21.6665V8.3335C25.8335 6.95278 24.7142 5.8335 23.3335 5.8335H8.3335ZM35.6782 16.6157C36.0442 17.3326 36.2495 18.1445 36.2495 19.0005V20.8003H33.7495V19.0005C33.7495 18.5487 33.6421 18.1255 33.4517 17.7524L35.6782 16.6157ZM24.2622 10.8364L18.2495 17.5181C16.9585 18.9523 14.7085 18.9523 13.4175 17.5181L7.40479 10.8364L9.26221 9.16455L15.2759 15.8462C15.5738 16.1768 16.0932 16.1768 16.3911 15.8462L22.4048 9.16455L24.2622 10.8364ZM30.9995 13.7505C31.8555 13.7505 32.6674 13.9568 33.3843 14.3228L32.2476 16.5493C31.8745 16.3589 31.4513 16.2505 30.9995 16.2505H29.6333V13.7505H30.9995Z",
  },
  {
    title: "RSVP invitation management",
    desc: "Have it shipped to you, or let us mail it straight to your recipient. Perfect for Xmas cards.",
    icon: "M28.0029 3.75C29.7979 3.75 31.2529 5.20507 31.2529 7V12.624L32.7695 13.6543C34.2164 14.6364 35.0796 16.2748 35.0713 18.0234L35.0059 31.4707C34.9919 34.3634 32.6408 36.6997 29.7481 36.6953L10.2676 36.666C7.37555 36.6614 5.03131 34.3188 5.0254 31.4268L4.99806 17.917C4.99438 16.0376 5.99546 14.299 7.62306 13.3594L8.75294 12.707V7C8.75294 5.20519 10.2082 3.75018 12.0029 3.75H28.0029ZM22.2559 28.3994C20.8777 29.2607 19.1291 29.2607 17.751 28.3994L7.50587 21.9961L7.5254 31.4219C7.52861 32.9366 8.75676 34.1635 10.2715 34.166L29.752 34.1953C31.2672 34.1976 32.4985 32.9742 32.5059 31.459L32.5518 21.9639L22.2559 28.3994ZM12.0029 6.25C11.5889 6.25018 11.2529 6.5859 11.2529 7V21.3896L19.0762 26.2793C19.6436 26.6339 20.3633 26.6339 20.9307 26.2793L28.7529 21.3896V7C28.7529 6.58579 28.4172 6.25 28.0029 6.25H12.0029ZM8.75294 15.5996C7.97204 16.1057 7.49627 16.9752 7.49806 17.9121L7.50001 19.0449L8.75294 19.8271V15.5996ZM31.2529 19.8271L32.5664 19.0068L32.5713 18.0117C32.5756 17.0958 32.1231 16.2371 31.3652 15.7227L31.2529 15.6455V19.8271ZM20.4111 12.9883C22.4143 10.9286 27.4233 14.5325 20.4111 19.166C13.3995 14.5315 18.4079 10.9289 20.4111 12.9883Z",
  },
  {
    title: "Special Day Reminder",
    desc: "Have it shipped to you, or let us mail it straight to your recipient. Perfect for Xmas cards.",
    icon: "M27.667 3.75C30.5663 3.75017 32.917 6.10061 32.917 9V23.333H30.417V12.917H6.25V24.333C6.25 25.8518 7.48122 27.083 9 27.083H21.667V29.583H9C6.10051 29.583 3.75 27.2325 3.75 24.333V9C3.75 6.10051 6.1005 3.75 9 3.75H27.667ZM9 6.25C7.48122 6.25 6.25 7.48122 6.25 9V10.417H30.417V9C30.417 7.48132 29.1856 6.25017 27.667 6.25H9Z",
  },
  {
    title: "500+ Amazing presets",
    desc: "Have it shipped to you, or let us mail it straight to your recipient. Perfect for Xmas cards.",
    icon: "M31.0005 3.75C33.8998 3.75018 36.2505 6.10061 36.2505 9V22.667C36.2503 25.5662 33.8997 27.9168 31.0005 27.917H29.5776C29.447 30.7002 27.1489 32.9168 24.3335 32.917H23.1763C22.621 35.0733 20.6631 36.666 18.3335 36.666H8.3335C5.57207 36.666 3.3335 34.4274 3.3335 31.666V18.333C3.33367 15.6579 5.43471 13.4735 8.07666 13.3398L8.3335 13.333H10.4604C10.7882 10.7486 12.9932 8.75016 15.6665 8.75H17.0894C17.2198 5.96659 19.5178 3.75 22.3335 3.75H31.0005ZM8.3335 15.833C6.9529 15.833 5.83367 16.9524 5.8335 18.333V31.666C5.8335 33.0467 6.95278 34.166 8.3335 34.166H18.3335C19.7142 34.166 20.8335 33.0467 20.8335 31.666V18.333C20.8333 16.9524 19.7141 15.833 18.3335 15.833H8.3335ZM15.6665 11.25C14.3782 11.2501 13.2998 12.137 13.0015 13.333H18.3335L18.5903 13.3398C21.2323 13.4735 23.3333 15.6579 23.3335 18.333V30.417H24.3335C25.852 30.4168 27.0833 29.1855 27.0835 27.667V14C27.0835 12.4813 25.8521 11.2502 24.3335 11.25H15.6665ZM22.3335 6.25C20.899 6.25 19.7226 7.34844 19.5962 8.75H24.3335C27.2328 8.75018 29.5835 11.1006 29.5835 14V25.417H31.0005C32.519 25.4168 33.7503 24.1855 33.7505 22.667V9C33.7505 7.48133 32.5191 6.25018 31.0005 6.25H22.3335Z",
  },
  {
    title: "Printing is customizable",
    desc: "Have it shipped to you, or let us mail it straight to your recipient. Perfect for Xmas cards.",
    icon: "M29.584 10.417H31C33.8995 10.417 36.25 12.7675 36.25 15.667V26C36.2498 28.8993 33.8994 31.25 31 31.25H29.584V36.25H10.417V31.25H9C6.10061 31.25 3.75018 28.8993 3.75 26V15.667C3.75 12.7675 6.10051 10.417 9 10.417H10.417V3.75H29.584V10.417ZM12.917 33.75H27.084V24.583H12.917V33.75ZM9 12.917C7.48122 12.917 6.25 14.1482 6.25 15.667V26C6.25018 27.5186 7.48133 28.75 9 28.75H10.417V24.583H8.33301V22.083H31.666V24.583H29.584V28.75H31C32.5187 28.75 33.7498 27.5186 33.75 26V15.667C33.75 14.1482 32.5188 12.917 31 12.917H9ZM12.917 10.417H27.084V6.25H12.917V10.417Z",
  },
];

const USP_CSS = `
.hs-usp {
  container-type: inline-size;
  width: 100%;
  background: var(--color-bg-main);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  align-items: center;
}
.hs-usp__inner {
  /* The design system grid track. Its contract: --grid-max-width is the OUTER
     width and --grid-margin is subtracted from inside it, so content lands at
     1168px on the 1200px tier and lines up with .hs-page-grid — and the wide
     tier follows automatically, because tokens.css restates --grid-max-width
     as 1400px at >= 2000px. Retune one block with --hs-track-max /
     --hs-track-margin rather than redefining the grid tokens, which would
     retune every consumer in the subtree and, if pinned to a number, sever
     the wide tier. */
  width: min(var(--hs-track-max, var(--grid-max-width, 1200px)), 100%);
  margin-inline: auto;
  padding-inline: var(--hs-track-margin, var(--grid-margin, 16px));
  /* Block padding lives here, not on the root: the root establishes the
     inline-size container, and a @container query cannot style the element
     that establishes it — the narrow-tier padding below never applied while
     it targeted the root. */
  padding-block: 56px 68px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
  align-items: center;
}
.hs-usp__top {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  align-items: center;
}
.hs-usp__head {
  width: 518px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  align-items: center;
}
.hs-usp__eyebrow {
  align-self: stretch;
  font-family: var(--font-family-heading);
  font-weight: 500;
  font-size: 16px;
  line-height: 100%;
  text-align: center;
  text-transform: uppercase;
  color: var(--color-text-secondary);
}
.hs-usp__h {
  font-family: var(--font-family-heading);
  font-weight: 600;
  font-size: var(--font-size-h2);
  line-height: 1.1;
  text-align: center;
  color: var(--color-text-primary);
  /* One line. The head above is 518px and the headline is wider than that at
     h2, so it is meant to overrun its box rather than break — centred, it
     stays symmetrical. Released again under 560px, where it genuinely cannot
     fit a phone. */
  white-space: nowrap;
}
/* Three fixed 384px columns on the marketing grid; below that they share the
   track evenly so the block still fills whatever column it is given. */
.hs-usp__grid {
  align-self: stretch;
  display: grid;
  grid-template-columns: repeat(3, 384px);
  row-gap: 72px;
  column-gap: var(--space-6);
  justify-content: center;
}
.hs-usp__cell {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  align-items: center;
  text-align: center;
  padding: 0 var(--space-2);
  box-sizing: border-box;
}
.hs-usp__ico {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-3);
  color: var(--color-text-primary);
  transition: transform 150ms ease, color 150ms ease;
}
/* Hovering anywhere on the cell lifts and tints its icon. */
.hs-usp__cell:hover .hs-usp__ico {
  transform: translateY(-4px);
  color: var(--color-brand-primary);
}
.hs-usp__t {
  align-self: stretch;
  font-family: var(--font-family-heading);
  font-weight: 600;
  font-size: var(--font-size-h4);
  line-height: 100%;
  color: var(--color-text-primary);
}
.hs-usp__d {
  align-self: stretch;
  font-family: var(--font-family-heading);
  font-weight: 400;
  font-size: 16px;
  line-height: 1.5;
  color: var(--color-text-secondary);
}
/* ── The closing band ────────────────────────────────────────────────────
   Sits on the grid track under the cells, on a warm ground of its own. The
   marketing site drives that ground from its own --hs-n15; there is no DS
   token at that value, so the block carries both themes itself and exposes
   --hs-usp-foot-bg for anyone who wants a different one. */
.hs-usp__foot {
  align-self: stretch;
  box-sizing: border-box;
  height: 148px;
  background: var(--hs-usp-foot-bg, rgb(241, 240, 228));
  padding: var(--space-8);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
@media (prefers-color-scheme: dark) {
  .hs-usp__foot { background: var(--hs-usp-foot-bg, hsl(55 11% 14%)); }
}
.hs-usp__footcopy {
  width: 571px;
  flex: none;
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: flex-start;
}
.hs-usp__footh {
  font-family: var(--font-family-heading);
  font-weight: 600;
  font-size: var(--font-size-subheadline);
  line-height: 100%;
  color: var(--color-text-primary);
  white-space: nowrap;
}
.hs-usp__footp {
  align-self: stretch;
  font-family: var(--font-family-heading);
  font-weight: 300;
  font-size: 16px;
  line-height: 1.5;
  color: var(--color-text-primary);
}
.hs-usp__footcta {
  flex: none;
  display: flex;
  flex-direction: row;
  gap: var(--space-3);
  align-items: flex-start;
}

@container (max-width: 1240px) {
  .hs-usp__grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
@container (max-width: 900px) {
  .hs-usp__inner { padding-block: var(--space-10) var(--space-12); gap: var(--space-10); }
  /* The band stacks: a fixed 148px row with a 571px column and two xl buttons
     has nowhere to go below this. */
  .hs-usp__foot {
    height: auto;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-6);
    padding: var(--space-6);
  }
  .hs-usp__footcopy { width: 100%; }
  .hs-usp__footh { white-space: normal; }
  .hs-usp__top { gap: var(--space-8); }
  .hs-usp__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); row-gap: var(--space-10); }
}
@container (max-width: 560px) {
  .hs-usp__grid { grid-template-columns: minmax(0, 1fr); row-gap: var(--space-8); }
  .hs-usp__footcta { width: 100%; flex-direction: column; align-items: stretch; }
  .hs-usp__h { white-space: normal; }
}
@media (prefers-reduced-motion: reduce) {
  .hs-usp__ico { transition: none; }
}

/* ── Type scale below 768px of the BLOCK's width ───────────────────────────
   tokens.css drops the headline sizes at a 767px viewport, which is right for
   a page but blind to a block that is phone-width inside a desktop one — the
   docs preview, or a narrow page column. The same -sm tokens are applied here
   from the block's own container so the type matches the layout that is
   actually being drawn. The tokens are set on the children rather than on the
   root, because an element cannot be matched by the container it establishes. */
@container (max-width: 767px) {
  .hs-usp > * {
    --font-size-h1: var(--font-size-h1-sm, 34px);
    --line-height-h1: var(--line-height-h1-sm, 1.15);
    --font-size-h2: var(--font-size-h2-sm, 28px);
    --line-height-h2: var(--line-height-h2-sm, 1.2);
    --font-size-h3: var(--font-size-h3-sm, 24px);
    --line-height-h3: var(--line-height-h3-sm, 1.25);
    --font-size-h4: var(--font-size-h4-sm, 18px);
    --font-size-h5: var(--font-size-h5-sm, 16px);
    --font-size-subheadline: var(--font-size-subheadline-sm, 20px);
    --font-size-subheadline-md: var(--font-size-subheadline-sm, 20px);
  }
}
`;

const USP_CSS_MIN = cssMin(USP_CSS);

export interface UspFooter {
  /** The claim, held on one line. */
  title?: React.ReactNode;
  /** The line under it. */
  text?: React.ReactNode;
  /** Primary action label. `false` removes the button. */
  action?: React.ReactNode | false;
  onAction?: () => void;
  /** Secondary, outlined action. `false` removes it. */
  secondary?: React.ReactNode | false;
  onSecondary?: () => void;
}

/** The closing band under the grid, as the marketing site ships it. */
export const USP_FOOTER: UspFooter = {
  title: "№-stamped. One of one. Never reprinted.",
  text: "Every card gets its own serial number — yours is never printed twice. Not for anyone.",
  action: "Make My Free Card",
  secondary: "Browse The Rack",
};

export interface UspGridProps {
  /** Small uppercase line above the headline. `false` removes it. */
  eyebrow?: React.ReactNode | false;
  /** The headline. `false` removes it. */
  heading?: React.ReactNode | false;
  /** The selling points. Any number; the grid reflows to fit. */
  items?: UspItem[];
  /** Columns on the widest tier. Drops to 2 then 1 as the block narrows. @default 3 */
  columns?: number;
  /**
   * The closing band under the grid — a claim, a line, and two actions on a
   * warm ground. `false` removes it. @default USP_FOOTER
   */
  footer?: UspFooter | false;
  /** Fade-and-rise on scroll. Ignored under reduced motion. @default true */
  reveal?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * The "Why we are different" grid: an eyebrow and headline over selling
 * points, each with an icon that lifts and tints on hover.
 *
 * Bare it is the approved nine. Pass `items` for your own — any number, the
 * grid reflows — and either `icon` (path data on a 40×40 viewBox) or
 * `iconNode` for a whole element.
 */
export function UspGrid({
  eyebrow = "Why We Are different",
  heading = "Anything but off-the-shelf",
  items = USP_ITEMS,
  columns = 3,
  footer = USP_FOOTER,
  reveal = true,
  className,
  style,
}: UspGridProps) {
  useInjectedStyle("hs-usp", USP_CSS_MIN);
  const rootRef = React.useRef<HTMLDivElement>(null);
  useRevealCascade(rootRef, reveal, [items, eyebrow, heading]);

  return (
    <div ref={rootRef} className={["hs-usp", className].filter(Boolean).join(" ")} style={style}>
      <div className="hs-usp__inner">
        <div className="hs-usp__top">
          {(eyebrow !== false || heading !== false) && (
            <div className="hs-usp__head" data-reveal-stagger>
              {eyebrow !== false && <span className="hs-usp__eyebrow">{eyebrow}</span>}
              {heading !== false && <span className="hs-usp__h">{heading}</span>}
            </div>
          )}
          {items.length > 0 && (
            <div
              className="hs-usp__grid"
              data-reveal-stagger
              style={columns !== 3 ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` } : undefined}
            >
              {items.map((it, i) => (
                <div className="hs-usp__cell" key={i}>
                  <span className="hs-usp__ico" aria-hidden="true">
                    {it.iconNode ??
                      (it.icon ? (
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                          <path d={it.icon} fill="currentColor" />
                        </svg>
                      ) : null)}
                  </span>
                  <span className="hs-usp__t">{it.title}</span>
                  <span className="hs-usp__d">{it.desc}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {footer !== false && (
          <div className="hs-usp__foot" data-reveal>
            {(footer.title != null || footer.text != null) && (
              <div className="hs-usp__footcopy">
                {footer.title != null && <span className="hs-usp__footh">{footer.title}</span>}
                {footer.text != null && <span className="hs-usp__footp">{footer.text}</span>}
              </div>
            )}
            {(footer.action !== false || footer.secondary !== false) && (
              <div className="hs-usp__footcta">
                {footer.action !== false && (
                  <Btn size="xl" onClick={footer.onAction}>{footer.action}</Btn>
                )}
                {footer.secondary !== false && (
                  <Btn variant="outline" size="xl" onClick={footer.onSecondary}>{footer.secondary}</Btn>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
