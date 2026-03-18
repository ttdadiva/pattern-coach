# Root Detective - Comprehensive Word Database
# Level 1: Ages 3-5 (Simple roots, basic suffixes)
# Level 2: Ages 6-8 (Latin/Greek roots, prefixes & suffixes)
# Level 3: Ages 8+ (Advanced roots, complex word building)

ROOT_WORDS_DATABASE = {
    # ==================== LEVEL 1: Ages 3-5 (Beginner) ====================
    "level_1": {
        "name": "Little Explorers",
        "age_group": "3-5",
        "description": "Simple everyday words with easy patterns",
        "roots": [
            {
                "id": "play",
                "root": "play",
                "meaning": "to have fun",
                "color": "#10B981",
                "words": [
                    {"word": "play", "parts": [{"text": "play", "type": "root"}], "part_of_speech": "verb", "definition": "to have fun with toys or games", "emoji": "🎮", "sentence": "I like to play with my friends."},
                    {"word": "player", "parts": [{"text": "play", "type": "root"}, {"text": "er", "type": "suffix"}], "part_of_speech": "noun", "definition": "a person who plays", "emoji": "🧑", "sentence": "She is a good player."},
                    {"word": "playful", "parts": [{"text": "play", "type": "root"}, {"text": "ful", "type": "suffix"}], "part_of_speech": "adjective", "definition": "full of fun and energy", "emoji": "🐕", "sentence": "The playful puppy runs around."},
                    {"word": "playing", "parts": [{"text": "play", "type": "root"}, {"text": "ing", "type": "suffix"}], "part_of_speech": "verb", "definition": "doing an activity for fun", "emoji": "⚽", "sentence": "We are playing soccer."},
                    {"word": "played", "parts": [{"text": "play", "type": "root"}, {"text": "ed", "type": "suffix"}], "part_of_speech": "verb", "definition": "had fun in the past", "emoji": "🎯", "sentence": "I played games yesterday."},
                ]
            },
            {
                "id": "help",
                "root": "help",
                "meaning": "to give support",
                "color": "#3B82F6",
                "words": [
                    {"word": "help", "parts": [{"text": "help", "type": "root"}], "part_of_speech": "verb", "definition": "to give support to someone", "emoji": "🤝", "sentence": "Can you help me?"},
                    {"word": "helper", "parts": [{"text": "help", "type": "root"}, {"text": "er", "type": "suffix"}], "part_of_speech": "noun", "definition": "a person who helps", "emoji": "👷", "sentence": "Mom is my helper."},
                    {"word": "helpful", "parts": [{"text": "help", "type": "root"}, {"text": "ful", "type": "suffix"}], "part_of_speech": "adjective", "definition": "giving help, useful", "emoji": "💪", "sentence": "You are so helpful!"},
                    {"word": "helping", "parts": [{"text": "help", "type": "root"}, {"text": "ing", "type": "suffix"}], "part_of_speech": "verb", "definition": "giving support right now", "emoji": "🙋", "sentence": "I am helping my sister."},
                    {"word": "helpless", "parts": [{"text": "help", "type": "root"}, {"text": "less", "type": "suffix"}], "part_of_speech": "adjective", "definition": "not able to help oneself", "emoji": "🐣", "sentence": "The baby bird is helpless."},
                ]
            },
            {
                "id": "kind",
                "root": "kind",
                "meaning": "nice and caring",
                "color": "#EC4899",
                "words": [
                    {"word": "kind", "parts": [{"text": "kind", "type": "root"}], "part_of_speech": "adjective", "definition": "nice and caring to others", "emoji": "💝", "sentence": "Be kind to your friends."},
                    {"word": "kindness", "parts": [{"text": "kind", "type": "root"}, {"text": "ness", "type": "suffix"}], "part_of_speech": "noun", "definition": "the quality of being kind", "emoji": "🌸", "sentence": "Kindness makes people happy."},
                    {"word": "unkind", "parts": [{"text": "un", "type": "prefix"}, {"text": "kind", "type": "root"}], "part_of_speech": "adjective", "definition": "not nice, mean", "emoji": "😢", "sentence": "It is unkind to tease others."},
                    {"word": "kindly", "parts": [{"text": "kind", "type": "root"}, {"text": "ly", "type": "suffix"}], "part_of_speech": "adverb", "definition": "in a kind way", "emoji": "😊", "sentence": "She spoke kindly to me."},
                    {"word": "kinder", "parts": [{"text": "kind", "type": "root"}, {"text": "er", "type": "suffix"}], "part_of_speech": "adjective", "definition": "more kind", "emoji": "🤗", "sentence": "You are kinder than before."},
                ]
            },
            {
                "id": "happy",
                "root": "happy",
                "meaning": "feeling joy",
                "color": "#FBBF24",
                "words": [
                    {"word": "happy", "parts": [{"text": "happy", "type": "root"}], "part_of_speech": "adjective", "definition": "feeling joy and delight", "emoji": "😊", "sentence": "I am happy today!"},
                    {"word": "happiness", "parts": [{"text": "happi", "type": "root"}, {"text": "ness", "type": "suffix"}], "part_of_speech": "noun", "definition": "the feeling of being happy", "emoji": "🌈", "sentence": "Happiness is wonderful."},
                    {"word": "unhappy", "parts": [{"text": "un", "type": "prefix"}, {"text": "happy", "type": "root"}], "part_of_speech": "adjective", "definition": "not happy, sad", "emoji": "😞", "sentence": "The lost dog looked unhappy."},
                    {"word": "happily", "parts": [{"text": "happi", "type": "root"}, {"text": "ly", "type": "suffix"}], "part_of_speech": "adverb", "definition": "in a happy way", "emoji": "🎉", "sentence": "They danced happily."},
                    {"word": "happier", "parts": [{"text": "happi", "type": "root"}, {"text": "er", "type": "suffix"}], "part_of_speech": "adjective", "definition": "more happy", "emoji": "😄", "sentence": "Ice cream makes me happier."},
                ]
            },
            {
                "id": "run",
                "root": "run",
                "meaning": "to move fast",
                "color": "#EF4444",
                "words": [
                    {"word": "run", "parts": [{"text": "run", "type": "root"}], "part_of_speech": "verb", "definition": "to move fast with your legs", "emoji": "🏃", "sentence": "I can run fast!"},
                    {"word": "runner", "parts": [{"text": "run", "type": "root"}, {"text": "er", "type": "suffix"}], "part_of_speech": "noun", "definition": "a person who runs", "emoji": "🏃‍♀️", "sentence": "She is a fast runner."},
                    {"word": "running", "parts": [{"text": "run", "type": "root"}, {"text": "ing", "type": "suffix"}], "part_of_speech": "verb", "definition": "moving fast right now", "emoji": "💨", "sentence": "The dog is running in the park."},
                    {"word": "runny", "parts": [{"text": "run", "type": "root"}, {"text": "ny", "type": "suffix"}], "part_of_speech": "adjective", "definition": "flowing like water", "emoji": "💧", "sentence": "I have a runny nose."},
                    {"word": "outrun", "parts": [{"text": "out", "type": "prefix"}, {"text": "run", "type": "root"}], "part_of_speech": "verb", "definition": "to run faster than someone", "emoji": "🥇", "sentence": "I can outrun my brother."},
                ]
            },
            {
                "id": "jump",
                "root": "jump",
                "meaning": "to leap up",
                "color": "#8B5CF6",
                "words": [
                    {"word": "jump", "parts": [{"text": "jump", "type": "root"}], "part_of_speech": "verb", "definition": "to leap off the ground", "emoji": "🦘", "sentence": "Watch me jump high!"},
                    {"word": "jumper", "parts": [{"text": "jump", "type": "root"}, {"text": "er", "type": "suffix"}], "part_of_speech": "noun", "definition": "someone who jumps", "emoji": "🐸", "sentence": "The frog is a good jumper."},
                    {"word": "jumping", "parts": [{"text": "jump", "type": "root"}, {"text": "ing", "type": "suffix"}], "part_of_speech": "verb", "definition": "leaping right now", "emoji": "🎪", "sentence": "I love jumping on the bed."},
                    {"word": "jumped", "parts": [{"text": "jump", "type": "root"}, {"text": "ed", "type": "suffix"}], "part_of_speech": "verb", "definition": "leaped in the past", "emoji": "✅", "sentence": "She jumped over the puddle."},
                    {"word": "jumpy", "parts": [{"text": "jump", "type": "root"}, {"text": "y", "type": "suffix"}], "part_of_speech": "adjective", "definition": "nervous or easily startled", "emoji": "😬", "sentence": "The cat is jumpy today."},
                ]
            },
            {
                "id": "teach",
                "root": "teach",
                "meaning": "to show how",
                "color": "#06B6D4",
                "words": [
                    {"word": "teach", "parts": [{"text": "teach", "type": "root"}], "part_of_speech": "verb", "definition": "to help someone learn", "emoji": "📚", "sentence": "Can you teach me?"},
                    {"word": "teacher", "parts": [{"text": "teach", "type": "root"}, {"text": "er", "type": "suffix"}], "part_of_speech": "noun", "definition": "a person who teaches", "emoji": "👩‍🏫", "sentence": "My teacher is nice."},
                    {"word": "teaching", "parts": [{"text": "teach", "type": "root"}, {"text": "ing", "type": "suffix"}], "part_of_speech": "verb", "definition": "helping someone learn now", "emoji": "🎓", "sentence": "Mom is teaching me to read."},
                    {"word": "reteach", "parts": [{"text": "re", "type": "prefix"}, {"text": "teach", "type": "root"}], "part_of_speech": "verb", "definition": "to teach again", "emoji": "🔄", "sentence": "Please reteach this to me."},
                    {"word": "unteachable", "parts": [{"text": "un", "type": "prefix"}, {"text": "teach", "type": "root"}, {"text": "able", "type": "suffix"}], "part_of_speech": "adjective", "definition": "cannot be taught", "emoji": "🙅", "sentence": "No one is unteachable."},
                ]
            },
            {
                "id": "love",
                "root": "love",
                "meaning": "to care deeply",
                "color": "#F472B6",
                "words": [
                    {"word": "love", "parts": [{"text": "love", "type": "root"}], "part_of_speech": "noun", "definition": "a feeling of deep caring", "emoji": "❤️", "sentence": "I love my family."},
                    {"word": "lovely", "parts": [{"text": "love", "type": "root"}, {"text": "ly", "type": "suffix"}], "part_of_speech": "adjective", "definition": "very beautiful or pleasant", "emoji": "🌺", "sentence": "What a lovely day!"},
                    {"word": "loving", "parts": [{"text": "love", "type": "root"}, {"text": "ing", "type": "suffix"}], "part_of_speech": "adjective", "definition": "showing love", "emoji": "🤱", "sentence": "She is a loving mother."},
                    {"word": "loved", "parts": [{"text": "love", "type": "root"}, {"text": "ed", "type": "suffix"}], "part_of_speech": "verb", "definition": "felt love in the past", "emoji": "💕", "sentence": "They loved the movie."},
                    {"word": "unloved", "parts": [{"text": "un", "type": "prefix"}, {"text": "love", "type": "root"}, {"text": "ed", "type": "suffix"}], "part_of_speech": "adjective", "definition": "not loved", "emoji": "😔", "sentence": "No pet should feel unloved."},
                ]
            },
        ]
    },
    
    # ==================== LEVEL 2: Ages 6-8 (Intermediate) ====================
    "level_2": {
        "name": "Word Builders",
        "age_group": "6-8",
        "description": "Latin and Greek roots with more complex patterns",
        "roots": [
            {
                "id": "port",
                "root": "port",
                "meaning": "to carry",
                "color": "#8B5CF6",
                "words": [
                    {"word": "transport", "parts": [{"text": "trans", "type": "prefix"}, {"text": "port", "type": "root"}], "part_of_speech": "verb", "definition": "to carry from one place to another", "emoji": "🚚", "sentence": "Trucks transport goods across the country."},
                    {"word": "portable", "parts": [{"text": "port", "type": "root"}, {"text": "able", "type": "suffix"}], "part_of_speech": "adjective", "definition": "able to be carried", "emoji": "💼", "sentence": "I have a portable game console."},
                    {"word": "export", "parts": [{"text": "ex", "type": "prefix"}, {"text": "port", "type": "root"}], "part_of_speech": "verb", "definition": "to carry out of a country", "emoji": "📦", "sentence": "We export apples to other countries."},
                    {"word": "import", "parts": [{"text": "im", "type": "prefix"}, {"text": "port", "type": "root"}], "part_of_speech": "verb", "definition": "to bring into a country", "emoji": "🛬", "sentence": "We import toys from China."},
                    {"word": "report", "parts": [{"text": "re", "type": "prefix"}, {"text": "port", "type": "root"}], "part_of_speech": "noun", "definition": "to carry back information", "emoji": "📋", "sentence": "I wrote a report about whales."},
                    {"word": "support", "parts": [{"text": "sup", "type": "prefix"}, {"text": "port", "type": "root"}], "part_of_speech": "verb", "definition": "to hold up or help", "emoji": "🤲", "sentence": "Friends support each other."},
                ]
            },
            {
                "id": "dict",
                "root": "dict",
                "meaning": "to say or speak",
                "color": "#F97316",
                "words": [
                    {"word": "dictate", "parts": [{"text": "dict", "type": "root"}, {"text": "ate", "type": "suffix"}], "part_of_speech": "verb", "definition": "to say aloud for someone to write", "emoji": "🗣️", "sentence": "The teacher will dictate the spelling words."},
                    {"word": "dictionary", "parts": [{"text": "dict", "type": "root"}, {"text": "ionary", "type": "suffix"}], "part_of_speech": "noun", "definition": "a book that tells word meanings", "emoji": "📖", "sentence": "Look it up in the dictionary."},
                    {"word": "predict", "parts": [{"text": "pre", "type": "prefix"}, {"text": "dict", "type": "root"}], "part_of_speech": "verb", "definition": "to say what will happen before it does", "emoji": "🔮", "sentence": "Can you predict the weather?"},
                    {"word": "contradict", "parts": [{"text": "contra", "type": "prefix"}, {"text": "dict", "type": "root"}], "part_of_speech": "verb", "definition": "to say the opposite", "emoji": "🚫", "sentence": "Don't contradict your teacher."},
                    {"word": "verdict", "parts": [{"text": "ver", "type": "prefix"}, {"text": "dict", "type": "root"}], "part_of_speech": "noun", "definition": "the final decision spoken", "emoji": "⚖️", "sentence": "The jury gave their verdict."},
                ]
            },
            {
                "id": "vis",
                "root": "vis/vid",
                "meaning": "to see",
                "color": "#06B6D4",
                "words": [
                    {"word": "visible", "parts": [{"text": "vis", "type": "root"}, {"text": "ible", "type": "suffix"}], "part_of_speech": "adjective", "definition": "able to be seen", "emoji": "👁️", "sentence": "The moon is visible tonight."},
                    {"word": "invisible", "parts": [{"text": "in", "type": "prefix"}, {"text": "vis", "type": "root"}, {"text": "ible", "type": "suffix"}], "part_of_speech": "adjective", "definition": "not able to be seen", "emoji": "👻", "sentence": "The wind is invisible."},
                    {"word": "vision", "parts": [{"text": "vis", "type": "root"}, {"text": "ion", "type": "suffix"}], "part_of_speech": "noun", "definition": "the ability to see", "emoji": "🔭", "sentence": "Eagles have excellent vision."},
                    {"word": "video", "parts": [{"text": "vid", "type": "root"}, {"text": "eo", "type": "suffix"}], "part_of_speech": "noun", "definition": "something you watch", "emoji": "📹", "sentence": "Let's watch a video."},
                    {"word": "visit", "parts": [{"text": "vis", "type": "root"}, {"text": "it", "type": "suffix"}], "part_of_speech": "verb", "definition": "to go see someone", "emoji": "🏠", "sentence": "I will visit my grandma."},
                    {"word": "supervise", "parts": [{"text": "super", "type": "prefix"}, {"text": "vis", "type": "root"}, {"text": "e", "type": "suffix"}], "part_of_speech": "verb", "definition": "to watch over", "emoji": "👀", "sentence": "Adults supervise the playground."},
                ]
            },
            {
                "id": "scrib",
                "root": "scrib/script",
                "meaning": "to write",
                "color": "#EC4899",
                "words": [
                    {"word": "scribble", "parts": [{"text": "scrib", "type": "root"}, {"text": "ble", "type": "suffix"}], "part_of_speech": "verb", "definition": "to write carelessly", "emoji": "✏️", "sentence": "Don't scribble in your books."},
                    {"word": "describe", "parts": [{"text": "de", "type": "prefix"}, {"text": "scribe", "type": "root"}], "part_of_speech": "verb", "definition": "to write about something in detail", "emoji": "📝", "sentence": "Describe your favorite animal."},
                    {"word": "script", "parts": [{"text": "script", "type": "root"}], "part_of_speech": "noun", "definition": "written text for a play or movie", "emoji": "🎬", "sentence": "The actor read the script."},
                    {"word": "subscribe", "parts": [{"text": "sub", "type": "prefix"}, {"text": "scribe", "type": "root"}], "part_of_speech": "verb", "definition": "to sign up for something", "emoji": "📰", "sentence": "We subscribe to a magazine."},
                    {"word": "prescription", "parts": [{"text": "pre", "type": "prefix"}, {"text": "script", "type": "root"}, {"text": "ion", "type": "suffix"}], "part_of_speech": "noun", "definition": "written instructions from a doctor", "emoji": "💊", "sentence": "The doctor wrote a prescription."},
                ]
            },
            {
                "id": "aud",
                "root": "aud",
                "meaning": "to hear",
                "color": "#10B981",
                "words": [
                    {"word": "audio", "parts": [{"text": "aud", "type": "root"}, {"text": "io", "type": "suffix"}], "part_of_speech": "noun", "definition": "sound that you can hear", "emoji": "🔊", "sentence": "The audio is too loud."},
                    {"word": "audience", "parts": [{"text": "aud", "type": "root"}, {"text": "ience", "type": "suffix"}], "part_of_speech": "noun", "definition": "people who listen or watch", "emoji": "👥", "sentence": "The audience clapped loudly."},
                    {"word": "audition", "parts": [{"text": "aud", "type": "root"}, {"text": "ition", "type": "suffix"}], "part_of_speech": "noun", "definition": "a tryout to be heard", "emoji": "🎤", "sentence": "I have an audition for the play."},
                    {"word": "audible", "parts": [{"text": "aud", "type": "root"}, {"text": "ible", "type": "suffix"}], "part_of_speech": "adjective", "definition": "loud enough to hear", "emoji": "👂", "sentence": "Her voice was barely audible."},
                    {"word": "inaudible", "parts": [{"text": "in", "type": "prefix"}, {"text": "aud", "type": "root"}, {"text": "ible", "type": "suffix"}], "part_of_speech": "adjective", "definition": "too quiet to hear", "emoji": "🤫", "sentence": "The whisper was inaudible."},
                ]
            },
            {
                "id": "graph",
                "root": "graph",
                "meaning": "to write or draw",
                "color": "#3B82F6",
                "words": [
                    {"word": "graph", "parts": [{"text": "graph", "type": "root"}], "part_of_speech": "noun", "definition": "a diagram showing data", "emoji": "📊", "sentence": "Make a graph of your results."},
                    {"word": "photograph", "parts": [{"text": "photo", "type": "prefix"}, {"text": "graph", "type": "root"}], "part_of_speech": "noun", "definition": "a picture made with light", "emoji": "📷", "sentence": "Take a photograph of the sunset."},
                    {"word": "autograph", "parts": [{"text": "auto", "type": "prefix"}, {"text": "graph", "type": "root"}], "part_of_speech": "noun", "definition": "your own written signature", "emoji": "✍️", "sentence": "Can I have your autograph?"},
                    {"word": "paragraph", "parts": [{"text": "para", "type": "prefix"}, {"text": "graph", "type": "root"}], "part_of_speech": "noun", "definition": "a section of writing", "emoji": "📄", "sentence": "Write a paragraph about dogs."},
                    {"word": "biography", "parts": [{"text": "bio", "type": "prefix"}, {"text": "graph", "type": "root"}, {"text": "y", "type": "suffix"}], "part_of_speech": "noun", "definition": "a written life story", "emoji": "📚", "sentence": "I read a biography of Lincoln."},
                ]
            },
            {
                "id": "tele",
                "root": "tele",
                "meaning": "far or distant",
                "color": "#FBBF24",
                "words": [
                    {"word": "telephone", "parts": [{"text": "tele", "type": "root"}, {"text": "phone", "type": "suffix"}], "part_of_speech": "noun", "definition": "a device for speaking far away", "emoji": "📞", "sentence": "Answer the telephone please."},
                    {"word": "television", "parts": [{"text": "tele", "type": "root"}, {"text": "vision", "type": "suffix"}], "part_of_speech": "noun", "definition": "a device for seeing far away", "emoji": "📺", "sentence": "We watch television after dinner."},
                    {"word": "telescope", "parts": [{"text": "tele", "type": "root"}, {"text": "scope", "type": "suffix"}], "part_of_speech": "noun", "definition": "a device to see distant objects", "emoji": "🔭", "sentence": "Look at stars through a telescope."},
                    {"word": "telegram", "parts": [{"text": "tele", "type": "root"}, {"text": "gram", "type": "suffix"}], "part_of_speech": "noun", "definition": "a message sent from far away", "emoji": "📨", "sentence": "They sent a telegram."},
                    {"word": "telepathy", "parts": [{"text": "tele", "type": "root"}, {"text": "pathy", "type": "suffix"}], "part_of_speech": "noun", "definition": "reading minds from far away", "emoji": "🧠", "sentence": "Telepathy would be amazing!"},
                ]
            },
            {
                "id": "struct",
                "root": "struct",
                "meaning": "to build",
                "color": "#EF4444",
                "words": [
                    {"word": "structure", "parts": [{"text": "struct", "type": "root"}, {"text": "ure", "type": "suffix"}], "part_of_speech": "noun", "definition": "something that is built", "emoji": "🏗️", "sentence": "The bridge is a strong structure."},
                    {"word": "construct", "parts": [{"text": "con", "type": "prefix"}, {"text": "struct", "type": "root"}], "part_of_speech": "verb", "definition": "to build something", "emoji": "🔨", "sentence": "They construct houses."},
                    {"word": "destruct", "parts": [{"text": "de", "type": "prefix"}, {"text": "struct", "type": "root"}], "part_of_speech": "verb", "definition": "to tear down or destroy", "emoji": "💥", "sentence": "Don't destruct the tower!"},
                    {"word": "instruct", "parts": [{"text": "in", "type": "prefix"}, {"text": "struct", "type": "root"}], "part_of_speech": "verb", "definition": "to build knowledge, teach", "emoji": "👨‍🏫", "sentence": "Teachers instruct students."},
                    {"word": "obstruct", "parts": [{"text": "ob", "type": "prefix"}, {"text": "struct", "type": "root"}], "part_of_speech": "verb", "definition": "to block or build against", "emoji": "🚧", "sentence": "Don't obstruct the hallway."},
                ]
            },
        ]
    },
    
    # ==================== LEVEL 3: Ages 8+ (Advanced) ====================
    "level_3": {
        "name": "Word Masters",
        "age_group": "8+",
        "description": "Complex roots and advanced vocabulary",
        "roots": [
            {
                "id": "bene",
                "root": "bene",
                "meaning": "good or well",
                "color": "#10B981",
                "words": [
                    {"word": "benefit", "parts": [{"text": "bene", "type": "root"}, {"text": "fit", "type": "suffix"}], "part_of_speech": "noun", "definition": "something good that helps you", "emoji": "✅", "sentence": "Exercise has many benefits."},
                    {"word": "beneficial", "parts": [{"text": "bene", "type": "root"}, {"text": "fic", "type": "suffix"}, {"text": "ial", "type": "suffix"}], "part_of_speech": "adjective", "definition": "helpful and good", "emoji": "👍", "sentence": "Reading is beneficial for your brain."},
                    {"word": "benevolent", "parts": [{"text": "bene", "type": "root"}, {"text": "vol", "type": "suffix"}, {"text": "ent", "type": "suffix"}], "part_of_speech": "adjective", "definition": "kind and generous", "emoji": "😇", "sentence": "The benevolent king helped his people."},
                    {"word": "benediction", "parts": [{"text": "bene", "type": "root"}, {"text": "dict", "type": "suffix"}, {"text": "ion", "type": "suffix"}], "part_of_speech": "noun", "definition": "good words of blessing", "emoji": "🙏", "sentence": "The priest gave a benediction."},
                ]
            },
            {
                "id": "mal",
                "root": "mal",
                "meaning": "bad or evil",
                "color": "#EF4444",
                "words": [
                    {"word": "malfunction", "parts": [{"text": "mal", "type": "root"}, {"text": "function", "type": "suffix"}], "part_of_speech": "noun", "definition": "when something works badly", "emoji": "🔧", "sentence": "The computer had a malfunction."},
                    {"word": "malicious", "parts": [{"text": "mal", "type": "root"}, {"text": "ic", "type": "suffix"}, {"text": "ious", "type": "suffix"}], "part_of_speech": "adjective", "definition": "wanting to hurt others", "emoji": "😈", "sentence": "The villain had malicious plans."},
                    {"word": "malnutrition", "parts": [{"text": "mal", "type": "root"}, {"text": "nutrit", "type": "suffix"}, {"text": "ion", "type": "suffix"}], "part_of_speech": "noun", "definition": "bad or poor nutrition", "emoji": "🥗", "sentence": "Malnutrition is a serious problem."},
                    {"word": "malpractice", "parts": [{"text": "mal", "type": "root"}, {"text": "practice", "type": "suffix"}], "part_of_speech": "noun", "definition": "bad professional behavior", "emoji": "⚠️", "sentence": "The doctor was sued for malpractice."},
                ]
            },
            {
                "id": "chron",
                "root": "chron",
                "meaning": "time",
                "color": "#8B5CF6",
                "words": [
                    {"word": "chronological", "parts": [{"text": "chron", "type": "root"}, {"text": "o", "type": "suffix"}, {"text": "logic", "type": "suffix"}, {"text": "al", "type": "suffix"}], "part_of_speech": "adjective", "definition": "in order of time", "emoji": "📅", "sentence": "List events in chronological order."},
                    {"word": "chronic", "parts": [{"text": "chron", "type": "root"}, {"text": "ic", "type": "suffix"}], "part_of_speech": "adjective", "definition": "lasting a long time", "emoji": "⏰", "sentence": "She has chronic back pain."},
                    {"word": "chronicle", "parts": [{"text": "chron", "type": "root"}, {"text": "icle", "type": "suffix"}], "part_of_speech": "noun", "definition": "a record of events over time", "emoji": "📜", "sentence": "The book is a chronicle of history."},
                    {"word": "synchronize", "parts": [{"text": "syn", "type": "prefix"}, {"text": "chron", "type": "root"}, {"text": "ize", "type": "suffix"}], "part_of_speech": "verb", "definition": "to make happen at the same time", "emoji": "🔄", "sentence": "Let's synchronize our watches."},
                ]
            },
            {
                "id": "geo",
                "root": "geo",
                "meaning": "earth",
                "color": "#06B6D4",
                "words": [
                    {"word": "geography", "parts": [{"text": "geo", "type": "root"}, {"text": "graph", "type": "suffix"}, {"text": "y", "type": "suffix"}], "part_of_speech": "noun", "definition": "study of the earth's surface", "emoji": "🌍", "sentence": "I love learning geography."},
                    {"word": "geology", "parts": [{"text": "geo", "type": "root"}, {"text": "logy", "type": "suffix"}], "part_of_speech": "noun", "definition": "study of earth's rocks", "emoji": "🪨", "sentence": "Geology helps us understand volcanoes."},
                    {"word": "geometry", "parts": [{"text": "geo", "type": "root"}, {"text": "metry", "type": "suffix"}], "part_of_speech": "noun", "definition": "math about shapes and space", "emoji": "📐", "sentence": "We learn geometry in math class."},
                    {"word": "geothermal", "parts": [{"text": "geo", "type": "root"}, {"text": "therm", "type": "suffix"}, {"text": "al", "type": "suffix"}], "part_of_speech": "adjective", "definition": "heat from inside the earth", "emoji": "🌋", "sentence": "Iceland uses geothermal energy."},
                ]
            },
            {
                "id": "bio",
                "root": "bio",
                "meaning": "life",
                "color": "#22C55E",
                "words": [
                    {"word": "biology", "parts": [{"text": "bio", "type": "root"}, {"text": "logy", "type": "suffix"}], "part_of_speech": "noun", "definition": "the study of living things", "emoji": "🧬", "sentence": "Biology teaches us about animals."},
                    {"word": "biography", "parts": [{"text": "bio", "type": "root"}, {"text": "graph", "type": "suffix"}, {"text": "y", "type": "suffix"}], "part_of_speech": "noun", "definition": "a written story of someone's life", "emoji": "📚", "sentence": "I read a biography about Einstein."},
                    {"word": "biodegradable", "parts": [{"text": "bio", "type": "root"}, {"text": "degrad", "type": "suffix"}, {"text": "able", "type": "suffix"}], "part_of_speech": "adjective", "definition": "can break down naturally", "emoji": "♻️", "sentence": "Use biodegradable bags."},
                    {"word": "antibiotic", "parts": [{"text": "anti", "type": "prefix"}, {"text": "bio", "type": "root"}, {"text": "tic", "type": "suffix"}], "part_of_speech": "noun", "definition": "medicine that kills germs", "emoji": "💊", "sentence": "The doctor gave me antibiotics."},
                ]
            },
            {
                "id": "phon",
                "root": "phon",
                "meaning": "sound",
                "color": "#F97316",
                "words": [
                    {"word": "phonics", "parts": [{"text": "phon", "type": "root"}, {"text": "ics", "type": "suffix"}], "part_of_speech": "noun", "definition": "learning sounds in reading", "emoji": "🔤", "sentence": "Phonics helps kids read."},
                    {"word": "symphony", "parts": [{"text": "sym", "type": "prefix"}, {"text": "phon", "type": "root"}, {"text": "y", "type": "suffix"}], "part_of_speech": "noun", "definition": "sounds together in music", "emoji": "🎼", "sentence": "We heard a beautiful symphony."},
                    {"word": "microphone", "parts": [{"text": "micro", "type": "prefix"}, {"text": "phon", "type": "root"}, {"text": "e", "type": "suffix"}], "part_of_speech": "noun", "definition": "device that captures sound", "emoji": "🎤", "sentence": "Speak into the microphone."},
                    {"word": "homophone", "parts": [{"text": "homo", "type": "prefix"}, {"text": "phon", "type": "root"}, {"text": "e", "type": "suffix"}], "part_of_speech": "noun", "definition": "words that sound the same", "emoji": "👯", "sentence": "To, too, two are homophones."},
                ]
            },
        ]
    }
}

# Helper function to get all words for a level
def get_level_words(level):
    if level not in ROOT_WORDS_DATABASE:
        return []
    
    all_words = []
    for root_family in ROOT_WORDS_DATABASE[level]["roots"]:
        for word in root_family["words"]:
            word_data = word.copy()
            word_data["root_id"] = root_family["id"]
            word_data["root_meaning"] = root_family["meaning"]
            word_data["root_color"] = root_family["color"]
            all_words.append(word_data)
    return all_words

# Helper function to get root families for a level
def get_level_roots(level):
    if level not in ROOT_WORDS_DATABASE:
        return []
    return ROOT_WORDS_DATABASE[level]["roots"]

# Total word count per level
def get_level_stats():
    stats = {}
    for level_key, level_data in ROOT_WORDS_DATABASE.items():
        total_words = sum(len(root["words"]) for root in level_data["roots"])
        total_roots = len(level_data["roots"])
        stats[level_key] = {
            "name": level_data["name"],
            "age_group": level_data["age_group"],
            "total_roots": total_roots,
            "total_words": total_words
        }
    return stats

# SUMMARY:
# Level 1 (Ages 3-5): 8 root families, 40 words
# Level 2 (Ages 6-8): 8 root families, 46 words  
# Level 3 (Ages 8+): 6 root families, 24 words
# TOTAL: 22 root families, 110 words
