// Demo conversation script for the Stampy chatbot DS preview.
// Shortened version of the full production script.

import type { ChatScript } from "./hs-chat-types";

const demoChatScript: ChatScript = {
  examplePrompts: [
    "I'm making a card for my girlfriend that will make her laugh for her birthday",
    "I need a heartfelt thank you card for my best friend",
    "Help me write a funny retirement card for my dad",
    "I want to send a sweet anniversary card to my wife",
    "Make a card that'll cheer up my friend who's having a rough week",
    "I need a graduation card for my little sister",
    "Something silly and warm for my mom's 60th birthday",
    "A congratulations card for my colleague's promotion",
  ],

  steps: [
    // 1. Stampy's first reply
    {
      type: "stampy",
      message:
        "I can definitely help you put together a great birthday card for Keith. To get started",
      delay: 3500,
      buttons: ["What kind of vibe are you going for?"],
    },

    // 2. Vibe selection
    {
      type: "overflow",
      pages: [
        {
          question: "What kind of vibe are you going for?",
          options: [
            { num: "1", label: "Funny" },
            { num: "2", label: "Sentimental" },
            { num: "3", label: "Serious/Heartfelt" },
            { num: "4", label: "Celebratory" },
            { num: "5", label: "Formal" },
          ],
        },
      ],
      inputPlaceholder: "Type your own",
      delay: 2500,
    },

    // 3. Stampy responds to vibe
    {
      type: "stampy",
      message:
        "Love that idea. A {{prev}} card always hits the right note. {{prev}} has a lot of flavors",
      delay: 2500,
      buttons: ["What kind of sentimental are we talking?"],
    },

    // 4. Sentimental sub-type
    {
      type: "overflow",
      pages: [
        {
          question: "What kind of sentimental are we talking?",
          options: [
            { num: "1", label: "Nostalgic" },
            { num: "2", label: "Grateful" },
            { num: "3", label: "Proud" },
            { num: "4", label: "Bittersweet" },
            { num: "5", label: "Romantic" },
            { num: "6", label: "Tender" },
            { num: "7", label: "Reassuring" },
          ],
        },
      ],
      inputPlaceholder: "Type your own",
      delay: 2500,
    },

    // 5. Stampy responds to sentimental type
    {
      type: "stampy",
      message: "{{prev}} it is! Let's make this super personal",
      delay: 2500,
      buttons: ["Tell me about the recipient"],
    },

    // 6. Recipient selection
    {
      type: "overflow",
      pages: [
        {
          question: "Tell me about the recipient",
          options: [
            { num: "1", label: "Friend" },
            { num: "2", label: "Partner" },
            { num: "3", label: "Boss" },
            { num: "4", label: "Coworker" },
            { num: "5", label: "Parent" },
            { num: "6", label: "Sibling" },
            { num: "7", label: "Grandparent" },
            { num: "8", label: "Neighbor" },
          ],
        },
      ],
      inputPlaceholder: "Type your own",
      delay: 2500,
    },

    // 7. Stampy responds to recipient
    {
      type: "stampy",
      message:
        "{{prev}} are the best people to get sentimental with! Let's make this personal.",
      delay: 2500,
      buttons: ["What are they into?"],
    },

    // 8. Interests checklist
    {
      type: "checklist",
      pages: [
        {
          question: "What are they into?",
          items: [
            { id: "cooking", label: "Cooking" },
            { id: "golf", label: "Golf" },
            { id: "gaming", label: "Gaming" },
            { id: "hiking", label: "Hiking" },
            { id: "reading", label: "Reading" },
            { id: "running", label: "Running" },
            { id: "sports", label: "Sports" },
            { id: "travel", label: "Travel" },
          ],
        },
      ],
      inputPlaceholder: "You make the call",
      delay: 2500,
      skipMessage:
        "I am sorry if the question wasn't relevant to you, let me know your next step or you can choose to proceed with next step.",
    },

    // 9. Theme intro
    {
      type: "stampy",
      message:
        "Now let's talk about how it should look. What visual style are you feeling?",
      delay: 2200,
    },

    // 10. Style carousel
    {
      type: "style-carousel",
      delay: 500,
    },

    // 11. Stampy responds to style
    {
      type: "stampy",
      message:
        "{{prev}} will look awesome, that helps a lot. Last thing before I put this together",
      delay: 2000,
      buttons: ["What kind of message format for the inside?"],
    },

    // 12. Message format selection
    {
      type: "overflow",
      pages: [
        {
          question: "What kind of message format for the inside?",
          options: [
            { num: "1", label: "One-liner / Quip" },
            { num: "2", label: "Limerick" },
            { num: "3", label: "Poem" },
            { num: "4", label: "Pun or wordplay" },
            { num: "5", label: "Short & sweet" },
            { num: "6", label: "Heartfelt message" },
            { num: "7", label: "Funny message" },
            { num: "8", label: "Inspirational message" },
          ],
        },
      ],
      inputPlaceholder: "Type your own",
      delay: 2500,
    },

    // 13. Stampy presents concepts
    {
      type: "stampy",
      message: "Here are three concepts based on everything you've told me:",
      delay: 2200,
      buttons: ["Pick a template"],
    },

    // 14. Template selection
    {
      type: "template",
      header: "Pick a template",
      cards: [
        {
          num: "1",
          title: "For Someone Who Means the World",
          front: "For Someone Who Means the World!",
          insideBody:
            "From your love of Hiking to the way you light up a room - you make life better just by being in it.",
          giftMessage:
            "Hope this little treat makes your birthday soar even higher!",
        },
        {
          num: "2",
          title: "Have a Bird-tastic Birthday!",
          front: "Have a Bird-tastic Birthday!",
          insideBody:
            "Hope your big day flies high! Squawk and celebrate! You're the coolest bird in the flock.",
          giftMessage:
            "A little something to help you celebrate your big jungle adventure!",
        },
        {
          num: "3",
          title: "Another Trip Around the Sun",
          front: "Another Trip Around the Sun!",
          insideBody:
            "Here's to the trails you've hiked, the views you've conquered, and the adventures still to come. Happy Birthday!",
          giftMessage: "Fuel up for your next great adventure!",
        },
        {
          num: "4",
          title: "Born to Be Wild",
          front: "Born to Be Wild!",
          insideBody:
            "You bring energy and joy wherever you go. May this year take you to new heights — literally and figuratively!",
          giftMessage: "A little boost for your next big climb!",
        },
      ],
      inputPlaceholder: "Something else",
      delay: 2500,
    },

    // 15. Final card summary
    {
      type: "final-card",
      message:
        'Here\'s the final card:\n🎉 Occasion: Birthday\n👤 For: Friend\n💛 Tone: Nostalgic\n✍️ Front: "For Someone Who Means the World"\n✍️ Inside: "From your love of Hiking to the way you light up a room - you make life better just by being in it."\n🎨 Style: Retro Ukiyo Pop\n🎯 Personalized: Hiking',
      button: "Ready to generate?",
      delay: 3000,
    },

    // 16. Action menu
    {
      type: "action",
      config: {
        title: "Ready to generate?",
        subtitle: "Your card concept is ready.",
        generateButtonLabel: "Generate Card",
        adjustHeader: "Or, want to make changes?",
        adjustItems: [
          { num: "1", label: "Change the front artwork" },
          { num: "2", label: "Update inside message" },
          { num: "3", label: "Try different style" },
          { num: "4", label: "Make the tone more sarcastic" },
          { num: "5", label: "Looks great, I am done" },
        ],
      },
      inputPlaceholder: "Something else",
      delay: 3500,
    },

    // 17. Generating banner
    {
      type: "banner",
      config: {
        loadingTitle: "Creating your card\u2026.",
        loadingMessage:
          "Initial generation might take a little longer, around 1-2 minutes. Thanks for your patience!",
        doneTitle: "Tada, Card generation is done!",
        doneMessage:
          "Your birthday card for Keith is ready! It\u2019s going to look wonderful in that Watercolor style.",
        loadingDuration: 10_000,
      },
    },
  ],
};

export default demoChatScript;
