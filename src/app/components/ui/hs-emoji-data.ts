/* ═══════════════════════════════════════════════════════
   HeartStamp — Emoji dataset

   Curated set rendered with the platform emoji font — no image
   sprites and no emoji package. The picker ships the categories the
   product actually needs rather than the full Unicode table, so the
   data stays small enough to live in the bundle.

   `name` is the accessible label and the primary search term;
   `keywords` add synonyms so search matches how people actually type.
═══════════════════════════════════════════════════════ */

export interface EmojiEntry {
  char: string;
  name: string;
  keywords?: string[];
}

export interface EmojiCategory {
  id: string;
  label: string;
  /** Representative emoji shown in the category nav. */
  icon: string;
  emoji: EmojiEntry[];
}

export const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    id: "smileys",
    label: "Smileys & people",
    icon: "😀",
    emoji: [
      { char: "😀", name: "Grinning face", keywords: ["smile", "happy"] },
      { char: "😃", name: "Grinning face with big eyes", keywords: ["smile", "happy"] },
      { char: "😄", name: "Grinning face with smiling eyes", keywords: ["smile", "happy"] },
      { char: "😁", name: "Beaming face", keywords: ["grin", "smile"] },
      { char: "😆", name: "Grinning squinting face", keywords: ["laugh", "haha"] },
      { char: "😅", name: "Grinning face with sweat", keywords: ["relief", "phew"] },
      { char: "😂", name: "Face with tears of joy", keywords: ["laugh", "lol", "crying"] },
      { char: "🤣", name: "Rolling on the floor laughing", keywords: ["rofl", "lol"] },
      { char: "🙂", name: "Slightly smiling face", keywords: ["smile"] },
      { char: "😉", name: "Winking face", keywords: ["wink", "flirt"] },
      { char: "😊", name: "Smiling face with smiling eyes", keywords: ["blush", "shy"] },
      { char: "😍", name: "Smiling face with heart eyes", keywords: ["love", "crush"] },
      { char: "🥰", name: "Smiling face with hearts", keywords: ["love", "adore"] },
      { char: "😘", name: "Face blowing a kiss", keywords: ["kiss", "love"] },
      { char: "😋", name: "Face savouring food", keywords: ["yum", "tasty"] },
      { char: "😎", name: "Smiling face with sunglasses", keywords: ["cool", "sunglasses"] },
      { char: "🤩", name: "Star struck", keywords: ["starry", "amazed", "wow"] },
      { char: "🥳", name: "Partying face", keywords: ["party", "celebrate", "birthday"] },
      { char: "🤗", name: "Hugging face", keywords: ["hug", "thanks"] },
      { char: "🤔", name: "Thinking face", keywords: ["hmm", "think"] },
      { char: "😴", name: "Sleeping face", keywords: ["sleep", "tired", "zzz"] },
      { char: "😢", name: "Crying face", keywords: ["sad", "tear"] },
      { char: "😭", name: "Loudly crying face", keywords: ["sob", "sad", "cry"] },
      { char: "😡", name: "Enraged face", keywords: ["angry", "mad"] },
      { char: "🥺", name: "Pleading face", keywords: ["please", "puppy eyes", "beg"] },
    ],
  },
  {
    id: "gestures",
    label: "Gestures",
    icon: "👍",
    emoji: [
      { char: "👍", name: "Thumbs up", keywords: ["yes", "like", "approve"] },
      { char: "👎", name: "Thumbs down", keywords: ["no", "dislike"] },
      { char: "👌", name: "OK hand", keywords: ["ok", "perfect"] },
      { char: "✌️", name: "Victory hand", keywords: ["peace", "two"] },
      { char: "🤞", name: "Crossed fingers", keywords: ["luck", "hope"] },
      { char: "🤟", name: "Love you gesture", keywords: ["ily", "love"] },
      { char: "🤙", name: "Call me hand", keywords: ["shaka", "hang loose"] },
      { char: "👏", name: "Clapping hands", keywords: ["applause", "bravo", "clap"] },
      { char: "🙌", name: "Raising hands", keywords: ["celebrate", "praise", "hooray"] },
      { char: "🙏", name: "Folded hands", keywords: ["please", "thanks", "pray"] },
      { char: "💪", name: "Flexed biceps", keywords: ["strong", "muscle"] },
      { char: "🤝", name: "Handshake", keywords: ["deal", "agree", "meet"] },
      { char: "👋", name: "Waving hand", keywords: ["hi", "hello", "bye"] },
      { char: "✍️", name: "Writing hand", keywords: ["write", "sign", "note"] },
    ],
  },
  {
    id: "hearts",
    label: "Hearts",
    icon: "❤️",
    emoji: [
      { char: "❤️", name: "Red heart", keywords: ["love"] },
      { char: "🧡", name: "Orange heart", keywords: ["love"] },
      { char: "💛", name: "Yellow heart", keywords: ["love", "friendship"] },
      { char: "💚", name: "Green heart", keywords: ["love"] },
      { char: "💙", name: "Blue heart", keywords: ["love"] },
      { char: "💜", name: "Purple heart", keywords: ["love"] },
      { char: "🖤", name: "Black heart", keywords: ["love", "dark"] },
      { char: "🤍", name: "White heart", keywords: ["love", "pure"] },
      { char: "💕", name: "Two hearts", keywords: ["love", "couple"] },
      { char: "💖", name: "Sparkling heart", keywords: ["love", "sparkle"] },
      { char: "💗", name: "Growing heart", keywords: ["love", "pulse"] },
      { char: "💘", name: "Heart with arrow", keywords: ["cupid", "love", "valentine"] },
      { char: "💝", name: "Heart with ribbon", keywords: ["gift", "valentine", "love"] },
      { char: "💌", name: "Love letter", keywords: ["card", "mail", "valentine"] },
      { char: "💔", name: "Broken heart", keywords: ["sad", "breakup"] },
    ],
  },
  {
    id: "celebration",
    label: "Celebration",
    icon: "🎉",
    emoji: [
      { char: "🎉", name: "Party popper", keywords: ["celebrate", "congrats", "party"] },
      { char: "🎊", name: "Confetti ball", keywords: ["celebrate", "party"] },
      { char: "🎈", name: "Balloon", keywords: ["party", "birthday"] },
      { char: "🎁", name: "Wrapped gift", keywords: ["present", "birthday"] },
      { char: "🎂", name: "Birthday cake", keywords: ["birthday", "cake"] },
      { char: "🧁", name: "Cupcake", keywords: ["cake", "sweet"] },
      { char: "🍰", name: "Slice of cake", keywords: ["cake", "dessert"] },
      { char: "🎆", name: "Fireworks", keywords: ["celebrate", "new year"] },
      { char: "✨", name: "Sparkles", keywords: ["shine", "magic", "new"] },
      { char: "🏆", name: "Trophy", keywords: ["win", "award", "first"] },
      { char: "🥇", name: "First place medal", keywords: ["gold", "win", "award"] },
      { char: "🎓", name: "Graduation cap", keywords: ["graduate", "school"] },
      { char: "💍", name: "Ring", keywords: ["engaged", "wedding", "marry"] },
      { char: "🕯️", name: "Candle", keywords: ["light", "memory"] },
    ],
  },
  {
    id: "food",
    label: "Food & drink",
    icon: "🍎",
    emoji: [
      { char: "🍎", name: "Red apple", keywords: ["fruit"] },
      { char: "🍏", name: "Green apple", keywords: ["fruit"] },
      { char: "🍌", name: "Banana", keywords: ["fruit"] },
      { char: "🍓", name: "Strawberry", keywords: ["fruit", "berry"] },
      { char: "🍒", name: "Cherries", keywords: ["fruit"] },
      { char: "🍑", name: "Peach", keywords: ["fruit"] },
      { char: "🍉", name: "Watermelon", keywords: ["fruit", "summer"] },
      { char: "🍇", name: "Grapes", keywords: ["fruit", "wine"] },
      { char: "🍊", name: "Tangerine", keywords: ["fruit", "orange"] },
      { char: "🍕", name: "Pizza", keywords: ["food", "slice"] },
      { char: "🍔", name: "Hamburger", keywords: ["food", "burger"] },
      { char: "🍟", name: "French fries", keywords: ["food", "chips"] },
      { char: "🍩", name: "Doughnut", keywords: ["sweet", "dessert"] },
      { char: "🍪", name: "Cookie", keywords: ["sweet", "biscuit"] },
      { char: "🍫", name: "Chocolate bar", keywords: ["sweet", "candy"] },
      { char: "☕", name: "Hot beverage", keywords: ["coffee", "tea"] },
      { char: "🍵", name: "Teacup", keywords: ["tea", "green tea"] },
      { char: "🍷", name: "Wine glass", keywords: ["wine", "drink"] },
      { char: "🍺", name: "Beer mug", keywords: ["beer", "drink"] },
      { char: "🥂", name: "Clinking glasses", keywords: ["cheers", "toast", "celebrate"] },
    ],
  },
  {
    id: "animals",
    label: "Animals",
    icon: "🐶",
    emoji: [
      { char: "🐶", name: "Dog face", keywords: ["puppy", "pet"] },
      { char: "🐱", name: "Cat face", keywords: ["kitten", "pet"] },
      { char: "🐰", name: "Rabbit face", keywords: ["bunny"] },
      { char: "🦊", name: "Fox", keywords: ["animal"] },
      { char: "🐻", name: "Bear", keywords: ["animal"] },
      { char: "🐼", name: "Panda", keywords: ["bear", "animal"] },
      { char: "🦁", name: "Lion", keywords: ["animal", "brave"] },
      { char: "🐯", name: "Tiger face", keywords: ["animal"] },
      { char: "🐵", name: "Monkey face", keywords: ["animal"] },
      { char: "🦄", name: "Unicorn", keywords: ["magic", "rainbow"] },
      { char: "🐝", name: "Honeybee", keywords: ["bee", "insect"] },
      { char: "🦋", name: "Butterfly", keywords: ["insect", "spring"] },
      { char: "🐢", name: "Turtle", keywords: ["slow", "animal"] },
      { char: "🐙", name: "Octopus", keywords: ["sea", "animal"] },
      { char: "🐬", name: "Dolphin", keywords: ["sea", "animal"] },
    ],
  },
  {
    id: "nature",
    label: "Nature",
    icon: "🌸",
    emoji: [
      { char: "🌸", name: "Cherry blossom", keywords: ["flower", "spring"] },
      { char: "🌷", name: "Tulip", keywords: ["flower"] },
      { char: "🌹", name: "Rose", keywords: ["flower", "love"] },
      { char: "🌻", name: "Sunflower", keywords: ["flower", "summer"] },
      { char: "🌼", name: "Blossom", keywords: ["flower", "daisy"] },
      { char: "🌵", name: "Cactus", keywords: ["plant", "desert"] },
      { char: "🌲", name: "Evergreen tree", keywords: ["tree", "pine"] },
      { char: "🍀", name: "Four leaf clover", keywords: ["luck", "lucky"] },
      { char: "🍁", name: "Maple leaf", keywords: ["autumn", "fall", "leaf"] },
      { char: "🌈", name: "Rainbow", keywords: ["pride", "colour"] },
      { char: "⭐", name: "Star", keywords: ["favourite"] },
      { char: "🌟", name: "Glowing star", keywords: ["shine", "sparkle"] },
      { char: "🔥", name: "Fire", keywords: ["hot", "lit", "flame"] },
      { char: "☀️", name: "Sun", keywords: ["sunny", "summer"] },
      { char: "🌙", name: "Crescent moon", keywords: ["night", "sleep"] },
      { char: "❄️", name: "Snowflake", keywords: ["cold", "winter", "snow"] },
    ],
  },
  {
    id: "symbols",
    label: "Symbols",
    icon: "✨",
    emoji: [
      { char: "✨", name: "Sparkles", keywords: ["shine", "magic", "new"] },
      { char: "✅", name: "Check mark", keywords: ["done", "yes", "tick"] },
      { char: "🔔", name: "Bell", keywords: ["notification", "alert"] },
      { char: "🎵", name: "Musical note", keywords: ["music", "song"] },
      { char: "💯", name: "Hundred points", keywords: ["100", "perfect"] },
      { char: "👑", name: "Crown", keywords: ["king", "queen", "royal"] },
      { char: "💎", name: "Gem stone", keywords: ["diamond", "jewel"] },
      { char: "🔑", name: "Key", keywords: ["unlock", "access"] },
      { char: "⚡", name: "High voltage", keywords: ["lightning", "fast", "power"] },
      { char: "🚀", name: "Rocket", keywords: ["launch", "fast", "ship"] },
      { char: "🎯", name: "Bullseye", keywords: ["target", "goal", "aim"] },
      { char: "🧩", name: "Puzzle piece", keywords: ["piece", "fit"] },
      { char: "✈️", name: "Airplane", keywords: ["travel", "flight"] },
      { char: "🗺️", name: "World map", keywords: ["travel", "map"] },
    ],
  },
];

/** Case-insensitive match against name and keywords. */
export function matchesEmoji(entry: EmojiEntry, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (entry.name.toLowerCase().includes(q)) return true;
  return !!entry.keywords?.some((k) => k.includes(q));
}
