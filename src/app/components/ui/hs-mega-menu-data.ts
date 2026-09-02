// ═══════════════════════════════════════════════════════════════════════════
// Mega menu datasets — transcribed verbatim from the "HeartStamp Mega Menu"
// handoff. Eleven categories sharing one panel shell. In product these come
// from the CMS; this is the spec's demo data and the docs fallback.
// ═══════════════════════════════════════════════════════════════════════════

export interface MegaColumn {
  title: string;
  items: string[];
}

export interface MegaMenu {
  /** Filter rail entries, above the shared style list. */
  filters: string[];
  /** Exactly four link columns. */
  cols: MegaColumn[];
  /** Promo tile copy. The image is supplied by the consumer; the handoff's
   *  own art is not bundled with the design system. */
  promoText: string;
}

/** One shared style set across every category. */
export const MEGA_STYLES: readonly string[] = [
  "Cute",
  "Funky",
  "Giant",
  "Multi Photo Upload",
  "Create Own",
  "Premium Cards",
  "Traditional",
  "Trending",
  "Romantic",
];

/** Category order is the row order. */
export const MEGA_CATEGORY_LABELS: readonly string[] = [
  "Bday",
  "Congrats",
  "Thank you",
  "Cards for Kids",
  "Anniversary",
  "Wedding",
  "Thinking of you",
  "Baby",
  "New Home",
  "Graduation",
  "Retirement",
];

export const MEGA_MENUS: Record<string, MegaMenu> = {
  "Bday": {
    filters: ["Photo Cards", "Top Picks", "Special Offers", "Special Cards"],
    cols: [
      {
        title: "By Recipient",
        items: [
          "For Her",
          "For Him",
          "For Mum",
          "For Dad",
          "For Kids",
          "For Friends",
          "For Daughter",
          "For Son",
          "A to Z of Recipients",
        ],
      },
      {
        title: "By Age",
        items: [
          "1st Birthday",
          "10 th Birthday",
          "13 th Birthday",
          "18 th Birthday",
          "21 th Birthday",
          "30 th Birthday",
          "40 th Birthday",
          "50 th Birthday",
          "All Ages",
        ],
      },
      { title: "Customize Styles", items: [...MEGA_STYLES] },
      {
        title: "Most Popular",
        items: [
          "Top Picks",
          "New Designs",
          "Top Suggestions",
          "Birthday By Month",
          "Milestone",
        ],
      },
    ],
    promoText: "Your First Digital Card Is Free",
  },
  "Congrats": {
    filters: ["Photo Cards", "New Job", "Big Wins", "Special Cards"],
    cols: [
      {
        title: "By Recipient",
        items: [
          "For Her",
          "For Him",
          "For Friends",
          "For Colleague",
          "For Team",
          "For Family",
          "For Couples",
        ],
      },
      {
        title: "By Milestone",
        items: [
          "New Job",
          "Promotion",
          "New Home",
          "Engagement",
          "Driving Test",
          "Retirement",
          "Exam Results",
        ],
      },
      {
        title: "Customize Styles",
        items: [
          "Confetti",
          "Bold Type",
          "Photo Collage",
          "Minimal",
          "Create Own",
          "Premium Cards",
          "Gold Foil",
        ],
      },
      {
        title: "Most Popular",
        items: [
          "Top Picks",
          "New Designs",
          "Work Wins",
          "Life Wins",
          "Group Signed",
        ],
      },
    ],
    promoText: "Celebrate The Big News",
  },
  "Thank you": {
    filters: ["Handwritten", "Same Day Post", "Top Picks", "Bulk Orders"],
    cols: [
      {
        title: "By Recipient",
        items: [
          "For Her",
          "For Him",
          "For Friends",
          "For Family",
          "For Teachers",
          "For Colleague",
          "For Neighbours",
        ],
      },
      {
        title: "By Reason",
        items: [
          "Gifts",
          "Hospitality",
          "Kindness",
          "Wedding Gifts",
          "Support",
          "Mentoring",
          "Just Because",
        ],
      },
      {
        title: "Customize Styles",
        items: [
          "Minimal",
          "Floral",
          "Handwriting",
          "Photo Upload",
          "Create Own",
          "Premium Cards",
          "Gold Foil",
        ],
      },
      {
        title: "Most Popular",
        items: [
          "Top Picks",
          "New Designs",
          "Packs of Ten",
          "Business Thanks",
          "Thank You Notes",
        ],
      },
    ],
    promoText: "Two Words, Posted Today",
  },
  "Cards for Kids": {
    filters: ["Photo Cards", "Age 0-12", "Activity Cards", "Special Cards"],
    cols: [
      {
        title: "By Recipient",
        items: [
          "For Daughter",
          "For Son",
          "For Grandchild",
          "For Niece",
          "For Nephew",
          "For Classmates",
          "For Godchild",
        ],
      },
      {
        title: "By Moment",
        items: [
          "Birthday",
          "Well Done",
          "First Day",
          "Sports Day",
          "Sleepover",
          "Get Well",
          "Tooth Fairy",
        ],
      },
      {
        title: "Customize Styles",
        items: [
          "Cartoon",
          "Storybook",
          "Dinosaurs",
          "Animals",
          "Create Own",
          "Sticker Sheets",
          "Colour In",
        ],
      },
      {
        title: "Most Popular",
        items: [
          "Top Picks",
          "New Designs",
          "Age 1-5",
          "Age 6-9",
          "Age 10-12",
        ],
      },
    ],
    promoText: "Made For Little Hands",
  },
  "Anniversary": {
    filters: ["Photo Cards", "Milestone Years", "Special Offers", "Handwritten"],
    cols: [
      {
        title: "By Recipient",
        items: [
          "For Her",
          "For Him",
          "For Wife",
          "For Husband",
          "For Partner",
          "For Parents",
          "For Couples",
        ],
      },
      {
        title: "By Year",
        items: [
          "1st Year",
          "5th Year",
          "10th Year",
          "20th Year",
          "25th Silver",
          "40th Ruby",
          "50th Golden",
          "All Years",
        ],
      },
      {
        title: "Customize Styles",
        items: [
          "Elegant",
          "Romantic",
          "Photo Collage",
          "Minimal",
          "Create Own",
          "Premium Cards",
          "Gold Foil",
        ],
      },
      {
        title: "Most Popular",
        items: [
          "Top Picks",
          "New Designs",
          "First Anniversary",
          "Milestone",
          "Renewal Vows",
        ],
      },
    ],
    promoText: "Another Year Together",
  },
  "Wedding": {
    filters: ["Save The Dates", "Invitations", "On The Day", "Bespoke"],
    cols: [
      {
        title: "By Recipient",
        items: [
          "For The Couple",
          "For Bride",
          "For Groom",
          "For Friends",
          "For Daughter",
          "For Son",
          "For Guests",
        ],
      },
      {
        title: "By Moment",
        items: [
          "Engagement",
          "Save The Date",
          "Invitation",
          "Wedding Day",
          "Hen & Stag",
          "Renewal Vows",
          "Thank You",
        ],
      },
      {
        title: "Customize Styles",
        items: [
          "Monogram",
          "Script",
          "Botanical",
          "Art Deco",
          "Create Own",
          "Premium Cards",
          "Gold Foil",
        ],
      },
      {
        title: "Most Popular",
        items: [
          "Top Picks",
          "New Designs",
          "Wedding Suites",
          "Letterpress",
          "Luxe Stock",
        ],
      },
    ],
    promoText: "Foil, Letterpress, Linen",
  },
  "Thinking of you": {
    filters: ["Handwritten", "Same Day Post", "Top Picks", "Special Cards"],
    cols: [
      {
        title: "By Recipient",
        items: [
          "For Her",
          "For Him",
          "For Partner",
          "For Friend",
          "For Family",
          "For Colleague",
        ],
      },
      {
        title: "By Tone",
        items: [
          "Sincere",
          "Light Hearted",
          "Formal",
          "Heartfelt",
          "Short & Simple",
          "Poetic",
        ],
      },
      {
        title: "Customize Styles",
        items: [
          "Minimal",
          "Handwriting",
          "Floral",
          "Muted",
          "Create Own",
          "Premium Cards",
        ],
      },
      {
        title: "Most Popular",
        items: [
          "Top Picks",
          "New Designs",
          "Get Well",
          "Sympathy",
          "Just Because",
        ],
      },
    ],
    promoText: "A Note That Lands Well",
  },
  "Baby": {
    filters: [
      "Photo Cards",
      "New Baby",
      "Baby Shower",
      "Gender Reveal",
      "Christening",
      "Gift Sets",
      "Special Cards",
    ],
    cols: [
      {
        title: "By Recipient",
        items: [
          "For Mum",
          "For Dad",
          "For Parents",
          "For Sister",
          "For Friends",
          "For Grandparents",
        ],
      },
      {
        title: "By Moment",
        items: [
          "New Baby",
          "Baby Shower",
          "Gender Reveal",
          "Christening",
          "Naming Day",
          "1st Birthday",
          "Adoption",
        ],
      },
      {
        title: "Customize Styles",
        items: [
          "Pastel",
          "Storybook",
          "Animals",
          "Multi Photo Upload",
          "Create Own",
          "Premium Cards",
        ],
      },
      {
        title: "Most Popular",
        items: [
          "Top Picks",
          "New Designs",
          "Twins",
          "Baby Girl",
          "Baby Boy",
        ],
      },
    ],
    promoText: "Welcome The Little One",
  },
  "New Home": {
    filters: ["Photo Cards", "Housewarming", "Top Picks", "Special Cards"],
    cols: [
      {
        title: "By Recipient",
        items: [
          "For Her",
          "For Him",
          "For Couples",
          "For Friends",
          "For Family",
          "For Neighbours",
          "For Flatmates",
        ],
      },
      {
        title: "By Moment",
        items: [
          "First Home",
          "Moving Day",
          "Housewarming",
          "New Build",
          "Renting",
          "Downsizing",
        ],
      },
      {
        title: "Customize Styles",
        items: [
          "Illustrated House",
          "Photo Upload",
          "Minimal",
          "Bold Type",
          "Create Own",
          "Premium Cards",
        ],
      },
      {
        title: "Most Popular",
        items: [
          "Top Picks",
          "New Designs",
          "Keys & Doors",
          "With Address Label",
          "Group Signed",
        ],
      },
    ],
    promoText: "Keys, Boxes, And A Card",
  },
  "Graduation": {
    filters: ["Photo Cards", "Class of 2026", "Bulk Orders", "Special Cards"],
    cols: [
      {
        title: "By Recipient",
        items: [
          "For Her",
          "For Him",
          "For Daughter",
          "For Son",
          "For Friends",
          "For Students",
          "For Teachers",
          "For Grandchild",
        ],
      },
      {
        title: "By Level",
        items: [
          "Nursery",
          "Primary School",
          "High School",
          "College",
          "University",
          "Masters",
          "PhD",
          "Trade School",
        ],
      },
      {
        title: "Customize Styles",
        items: [
          "Classic",
          "Photo Collage",
          "Confetti",
          "Minimal",
          "Create Own",
          "Premium Cards",
          "Gold Foil",
          "Trending",
        ],
      },
      {
        title: "Most Popular",
        items: [
          "Top Picks",
          "New Designs",
          "Cap & Gown",
          "With Photo",
          "Money Holders",
        ],
      },
    ],
    promoText: "Cap, Gown, And A Card",
  },
  "Retirement": {
    filters: ["Photo Cards", "Group Signed", "Bulk Orders", "Special Cards"],
    cols: [
      {
        title: "By Recipient",
        items: [
          "For Her",
          "For Him",
          "For Colleague",
          "For Boss",
          "For Team",
          "For Friends",
          "For Family",
        ],
      },
      {
        title: "By Tone",
        items: [
          "Heartfelt",
          "Funny",
          "Formal",
          "Grateful",
          "Cheeky",
          "Short & Simple",
        ],
      },
      {
        title: "Customize Styles",
        items: [
          "Classic",
          "Photo Collage",
          "Bold Type",
          "Minimal",
          "Create Own",
          "Premium Cards",
          "Gold Foil",
        ],
      },
      {
        title: "Most Popular",
        items: [
          "Top Picks",
          "New Designs",
          "Last Day",
          "Big Signable",
          "From The Team",
        ],
      },
    ],
    promoText: "Send Them Off Properly",
  },
};
