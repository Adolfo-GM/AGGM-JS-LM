let CORPUS = `
The quick brown fox jumps over the lazy dog.
The rain in Spain stays mainly in the plain.
The sun shines bright in the sky.
A journey of a thousand miles begins with a single step.
To be or not to be, that is the question.
Hello there. How are you doing today? I hope everything is going well. The weather is nice and the sun is shining.
`;

class SimpleLLM {
    constructor(corpus) {
        this.text_corpus = corpus;
    }

    predict_the_next_word(text) {
        let words = this.text_corpus.split(/\s+/);
        let input_words = text.trim().split(/\s+/);
        let last_word = input_words[input_words.length - 1];

        for (let i = 0; i < words.length - 1; i++) {
            if (words[i].toLowerCase() === last_word.toLowerCase()) {
                return words[i + 1];
            }
        }

        return ".";
    }

    fix_grammar(text) {
        let fixed = text.trim();
        fixed = fixed.charAt(0).toUpperCase() + fixed.slice(1);
        if (!fixed.endsWith(".")) {
            fixed += ".";
        }
        return fixed;
    }

    ask(text) {
        let generated = text.trim();
        for (let i = 0; i < 10; i++) {
            let next_word = this.predict_the_next_word(generated);
            if (next_word === "." || next_word === undefined) break;
            generated += " " + next_word;
        }
        return this.fix_grammar(generated);
    }
}

class KeyValueLM {
    constructor() {
        this.responses = {
                    "hi": [
                        "Hey, what's good?",
                        "Yo, how you holding up?",
                        "Hey there, what's going on?",
                        "Hi, you doing alright?",
                        "What's up, how's it going?",
                        "Hey, nice to see you around!"
                    ],
                    "greetings!": [
                        "Hey, what's the deal today?",
                        "Yo, how's your day been so far?",
                        "Hey, what's up with you?",
                        "Hi, good to see you—what's happening?",
                        "What's going on in your world?",
                        "Hey there, how's everything?"
                    ],
                    "how are you?": [
                        "I'm good, man. You?",
                        "Doing alright, thanks. How you feeling?",
                        "I'm solid—how you holding up?",
                        "Pretty good, yeah. What about you?",
                        "Can't complain really. How about yourself?",
                        "I'm hanging in there. You good?"
                    ],
                    "what's up?": [
                        "Not much, just here. You?",
                        "Same old, you know. What's with you?",
                        "Just kicking it—what's going on over there?",
                        "Nothing crazy. What's up on your end?",
                        "Just the usual stuff. What about you?",
                        "Nothing special, just getting by. You?"
                    ],
                    "hey there": [
                        "Hey, how's it going today?",
                        "What's up? How you been?",
                        "Hey yourself! What's happening?",
                        "Hi there! What's new with you?",
                        "Hey! How's your day shaping up?",
                        "Well hello! What's going on?"
                    ],
                    "good morning": [
                        "Morning! Sleep alright?",
                        "Hey, good morning! Ready for the day?",
                        "Morning! How's your day starting off?",
                        "Morning to you too! Got any plans today?",
                        "Hey, rise and shine! How you feeling?",
                        "Good morning! Coffee kicked in yet?"
                    ],
                    "good afternoon": [
                        "Afternoon! How's your day going so far?",
                        "Hey, having a good day?",
                        "Afternoon! What have you been up to?",
                        "Hey there, how's the day treating you?",
                        "Afternoon! Anything interesting happening?",
                        "Hey, halfway through the day! How's it going?"
                    ],
                    "good evening": [
                        "Evening! How was your day?",
                        "Hey, winding down?",
                        "Evening to you! How'd your day go?",
                        "Hey there, had a good day?",
                        "Evening! Got any plans tonight?",
                        "Hey, how'd the day treat you?"
                    ],
                    "good night": [
                        "Night! Sleep well, yeah?",
                        "Take it easy, catch you tomorrow!",
                        "Night, don't let the bed bugs bite!",
                        "Sleep tight! Talk to you later!",
                        "Rest up well, catch you on the flip side!",
                        "Night night! Have a good one!"
                    ],
                    "how's it going?": [
                        "It's going alright. What about you?",
                        "Not bad, not bad. You?",
                        "Pretty decent. How about yourself?",
                        "Can't complain too much. You?",
                        "Going with the flow, you know? How about you?",
                        "I'm hanging in there. How about you?"
                    ],
                    "what have you been up to?": [
                        "Not much really, just the usual. You?",
                        "Same old stuff, nothing exciting. What about you?",
                        "Just working and living, you know how it is. You?",
                        "The regular day-to-day. Anything new with you?",
                        "Nothing special, just getting by. What about you?",
                        "Just taking it one day at a time. You up to anything good?"
                    ],
                    "how's your day?": [
                        "It's been alright. How about yours?",
                        "Pretty standard so far. Yours?",
                        "Can't complain, really. How's yours going?",
                        "It's going OK. What about your day?",
                        "Not too bad. How's your day been?",
                        "So far so good. How about you?"
                    ],
                    "long time no see": [
                        "Yeah, it's been a minute! What's new?",
                        "For real! What have you been up to?",
                        "I know, right? How have you been?",
                        "Yeah, too long! What's been happening?",
                        "Seriously! How's life been treating you?",
                        "No doubt! What's good with you these days?"
                    ],
                    "what's new?": [
                        "Not a whole lot. You got anything new?",
                        "Same stuff different day, you know? What about you?",
                        "Nothing too exciting. What's new with you?",
                        "Just the usual. Anything new on your end?",
                        "Not much has changed. What about with you?",
                        "Nothing worth mentioning. What's new with you?"
                    ],
                    "how's your week?": [
                        "It's been alright. How's yours?",
                        "Pretty average, to be honest. How about your week?",
                        "Can't complain too much. How's your week going?",
                        "It's going OK. What about your week?",
                        "Just taking it day by day. How's yours been?",
                        "Same old, same old. How's your week looking?"
                    ],
                    "how's life?": [
                        "Life's alright, can't complain too much. You?",
                        "It's going, you know? How about with you?",
                        "Just taking it as it comes. How's life treating you?",
                        "It has its ups and downs. How about you?",
                        "I'm hanging in there. How's life on your end?",
                        "Living it the best I can. How about yourself?"
                    ],
                    "what's going on?": [
                        "Not a whole lot. What's up with you?",
                        "Just the usual stuff. What about you?",
                        "Nothing special. What's happening with you?",
                        "Just chilling. What's going on with you?",
                        "Same old, same old. What's good with you?",
                        "Not much really. What's new with you?"
                    ],
                    "how's everything?": [
                        "Everything's pretty good. How about with you?",
                        "Can't complain too much. How's everything on your end?",
                        "It's all alright. How's everything with you?",
                        "Going with the flow. How about you?",
                        "All things considered, not bad. How about yourself?",
                        "It's all good. How's everything with you?"
                    ],
                    "what's happening?": [
                        "Not much happening here. You?",
                        "Just the usual. What's happening with you?",
                        "Nothing special. What about you?",
                        "Just taking it easy. What's up with you?",
                        "Nothing worth mentioning. What's happening on your end?",
                        "Same old stuff. What's good with you?"
                    ],
                    "how's your family?": [
                        "They're all good, thanks. How's yours?",
                        "Everyone's doing alright. How about your family?",
                        "They're hanging in there. How's your family doing?",
                        "All good on that front. How's your family?",
                        "They're doing fine. How about your folks?",
                        "Can't complain. How's your family doing?"
                    ],
                    "nice weather today": [
                        "Yeah, it's not bad out there. Enjoying it?",
                        "For real, it's pretty decent today. You getting out in it?",
                        "It's pretty nice, right? Got any plans to enjoy it?",
                        "Yeah, it's a good day for sure. You taking advantage?",
                        "Definitely better than usual. You getting outside at all?",
                        "It's a nice change, right? You doing anything outdoors?"
                    ],
                    "bad weather today": [
                        "Yeah, it's pretty rough out there. Staying in?",
                        "For real, not the best day. You keeping dry?",
                        "It's nasty out, right? You managing OK?",
                        "Yeah, weather's not doing us any favors. You staying warm?",
                        "It's pretty miserable out there. You staying safe?",
                        "Definitely not ideal today. You hanging in there?"
                    ],
                    "happy friday": [
                        "Finally Friday, right? Got any plans?",
                        "TGIF! Anything fun lined up?",
                        "Friday vibes! What are you getting into this weekend?",
                        "Happy Friday to you too! Weekend plans?",
                        "Yes! Made it to Friday! Doing anything good?",
                        "Friday at last! What's on for the weekend?"
                    ],
                    "happy monday": [
                        "Monday again, huh? How's it treating you?",
                        "Beginning of another week. You holding up OK?",
                        "Monday vibes. You got this! How's it going?",
                        "Monday it is. How's your week starting off?",
                        "Back to the grind, right? How you feeling about it?",
                        "New week, new start! How's it going so far?"
                    ],
                    "what are you up to?": [
                        "Not much really. What about you?",
                        "Just chilling. What are you getting into?",
                        "Nothing special. What about yourself?",
                        "Just taking it easy. You?",
                        "Not a whole lot. How about you?",
                        "Just the usual. What are you up to?"
                    ],
                    "how's work?": [
                        "It's alright, same old stuff. How's work for you?",
                        "Can't complain too much. How about your work?",
                        "It's keeping me busy. How's your work going?",
                        "It has its moments. How's work on your end?",
                        "It's going OK. How's work treating you?",
                        "It pays the bills, you know? How's your work situation?"
                    ],
                    "how's school?": [
                        "It's going alright. How about your school?",
                        "Pretty busy with it. How's school for you?",
                        "It's challenging but good. How about your studies?",
                        "Can't complain too much. How's school on your end?",
                        "It's keeping me on my toes. How's your school situation?",
                        "It's going OK. How about your classes?"
                    ],
                    "any plans today?": [
                        "Nothing special, just the usual. You got plans?",
                        "Not really, taking it easy. How about you?",
                        "Just going with the flow today. What about you?",
                        "Nothing set in stone. What are you up to today?",
                        "Just handling the regular stuff. You have anything planned?",
                        "Keeping it simple today. What about yourself?"
                    ],
                    "any plans this weekend?": [
                        "Nothing major planned. How about you?",
                        "Just taking it easy probably. What about you?",
                        "Might hang out with some friends. You got plans?",
                        "Nothing special lined up. What are you doing?",
                        "Just relaxing most likely. What about yourself?",
                        "Keeping it low-key. What about your weekend?"
                    ],
                    "how was your weekend?": [
                        "It was pretty chill. How was yours?",
                        "Nothing special, just relaxed. How about yours?",
                        "It was alright, too short though. How was your weekend?",
                        "Pretty standard, nothing crazy. How'd your weekend go?",
                        "It was decent. How about your weekend?",
                        "Can't complain. How was your weekend?"
                    ],
                    "seen any good movies lately?": [
                        "Not really, been pretty busy. You seen anything good?",
                        "Nothing that stands out. Any recommendations?",
                        "Been watching more shows than movies. You?",
                        "Nothing special recently. What about you?",
                        "Haven't had much time for movies. You seen anything worth watching?",
                        "Not lately. What have you been watching?"
                    ],
                    "watching anything good?": [
                        "Not much lately. You got any recommendations?",
                        "Just the usual stuff. What about you?",
                        "Been too busy to watch much. What are you into right now?",
                        "Nothing that special. What have you been watching?",
                        "Not really. Anything you'd recommend?",
                        "Just whatever's on. You watching anything good?"
                    ],
                    "how's the food here?": [
                        "It's pretty decent. Have you tried it before?",
                        "Not bad, actually. What do you usually get?",
                        "I like it well enough. What about you?",
                        "It's alright. You been here before?",
                        "It hits the spot. What do you think of it?",
                        "Can't complain. Have you eaten here much?"
                    ],
                    "you like music?": [
                        "Yeah, I listen to a bit of everything. What about you?",
                        "For sure. What kind of music are you into?",
                        "Definitely. What's your favorite type?",
                        "Who doesn't, right? What do you listen to?",
                        "Yeah, music's essential. What kind do you like?",
                        "Absolutely. What's in your playlist these days?"
                    ],
                    "what music do you like?": [
                        "I'm into a bit of everything. What about you?",
                        "Depends on my mood, you know? What do you listen to?",
                        "Got pretty varied taste. What's your style?",
                        "I bounce around genres a lot. What kind of music do you like?",
                        "All sorts really. What are you into?",
                        "I'm pretty open to most stuff. What's your jam?"
                    ],
                    "got any hobbies?": [
                        "Just the usual stuff, nothing special. What about you?",
                        "A few things here and there. What do you get into?",
                        "Nothing too exciting. What kind of hobbies do you have?",
                        "I keep busy with a few things. What about yourself?",
                        "The standard stuff, you know? What are you into?",
                        "Nothing out of the ordinary. What hobbies do you have?"
                    ],
                    "what do you do for fun?": [
                        "Just hang out, watch stuff, nothing crazy. You?",
                        "Pretty basic stuff, you know? What about you?",
                        "The usual—music, hanging with friends. What do you do?",
                        "Nothing too exciting. What about yourself?",
                        "Just chill mostly. What do you get up to?",
                        "Keep it pretty low-key. What about you?"
                    ],
                    "where are you from?": [
                        "I'm from around here. What about you?",
                        "Not far from here. How about yourself?",
                        "Just local, really. Where are you from?",
                        "Grew up in the area. What about you?",
                        "I'm a local. How about you, where are you from?",
                        "Just from nearby. What about yourself?"
                    ],
                    "been here before?": [
                        "Yeah, a few times. What about you?",
                        "Once or twice. You come here often?",
                        "I've been here before. What about you?",
                        "Now and then. How about yourself?",
                        "A couple times. You familiar with the place?",
                        "I've stopped by before. What about you?"
                    ],
                    "what do you do?": [
                        "Just the usual work stuff. What about you?",
                        "Nothing too exciting, just getting by. What do you do?",
                        "Just working, you know how it is. What about yourself?",
                        "The regular 9-to-5 kind of thing. How about you?",
                        "Just trying to make a living. What about you?",
                        "Nothing special, just working. What do you do?"
                    ],
                    "you from around here?": [
                        "Yeah, pretty much. What about you?",
                        "More or less. How about yourself?",
                        "I live nearby. What about you?",
                        "Not too far. You local as well?",
                        "Yeah, I'm from the area. What about you?",
                        "Pretty much, yeah. How about you?"
                    ],
                    "nice to meet you": [
                        "Yeah, you too. What brings you here?",
                        "Likewise! How's your day going?",
                        "Nice meeting you too. How you doing today?",
                        "Same here. What's going on with you?",
                        "Good to meet you too. What's up?",
                        "Definitely, you too. How's everything?"
                    ],
                    "you look familiar": [
                        "Yeah? I get that sometimes. Where might you know me from?",
                        "Do I? I'm not sure we've met before. Where from?",
                        "Really? Small world. Where do you think from?",
                        "I get that a lot. Can't place where from?",
                        "You think? I'm trying to place you too. Where from?",
                        "Funny how that happens. Any idea where from?"
                    ],
                    "you come here often?": [
                        "Now and then. What about you?",
                        "Not super often. How about yourself?",
                        "Sometimes. You a regular here?",
                        "Occasionally. What about you?",
                        "Once in a while. You?",
                        "Not really. How about you?"
                    ],
                    "having a good day?": [
                        "It's been alright. How about yours?",
                        "Can't complain. How's your day?",
                        "Pretty decent so far. What about you?",
                        "It's going OK. How about your day?",
                        "Not too bad. How's your day been?",
                        "So far so good. How about yourself?"
                    ],
                    "what's your name?": [
                        "I'm just hanging around. What about you?",
                        "Just a regular person. What about yourself?",
                        "Does it matter? What's up with you?",
                        "I'm nobody special. What's your story?",
                        "Just someone passing through. What about you?",
                        "You can call me whatever. What's good with you?"
                    ],
                    "what brings you here?": [
                        "Just checking things out. What about you?",
                        "Nothing special, just around. What brings you?",
                        "Just passing through. How about yourself?",
                        "The usual reasons. What about you?",
                        "Just hanging out. What's your story?",
                        "No particular reason. What about you?"
                    ],
                    "where you headed?": [
                        "Nowhere special. What about you?",
                        "Just around, you know? Where are you off to?",
                        "Just going with the flow. How about you?",
                        "No particular place. What about yourself?",
                        "Just wandering. Where are you headed?",
                        "Wherever the day takes me. You?"
                    ],
                    "what time is it?": [
                        "Time to get a watch, right? But for real, what's up?",
                        "Time for something new. What's going on?",
                        "Does it really matter? How's your day?",
                        "Time flies when you're having fun. What's up with you?",
                        "Later than we think. What's going on?",
                        "Time to catch up. What's happening with you?"
                    ],
                    "do you live nearby?": [
                        "Not too far. What about you?",
                        "Relatively close. How about yourself?",
                        "In the general area. What about you?",
                        "Close enough. Where are you from?",
                        "Within range. How about you?",
                        "Near enough. What about yourself?"
                    ],
                    "do you work around here?": [
                        "Not too far from here. What about you?",
                        "In the area, yeah. How about yourself?",
                        "Nearby enough. What about you?",
                        "Close enough to be convenient. You?",
                        "In the general vicinity. What about you?",
                        "Not right here, but close. How about you?"
                    ],
                    "what do you think about this place?": [
                        "It's alright. What do you think of it?",
                        "Not bad, honestly. What's your take?",
                        "It has its moments. How do you feel about it?",
                        "Could be worse. What's your opinion?",
                        "It's decent enough. What do you think?",
                        "I don't mind it. How do you find it?"
                    ],
                    "you been waiting long?": [
                        "Not too long. How about you?",
                        "Just got here, actually. You?",
                        "A little while. What about yourself?",
                        "Long enough. How about you?",
                        "Not really. You been waiting a while?",
                        "Just a bit. How about you?"
                    ],
                    "crazy weather we're having": [
                        "Yeah, it's been unpredictable. How you dealing with it?",
                        "For real, it's all over the place. You hanging in there?",
                        "No kidding. You managing OK with it?",
                        "Tell me about it. How's it affecting you?",
                        "It's been wild. You staying comfortable?",
                        "Seriously, it's been strange. How are you coping?"
                    ],
                    "busy day?": [
                        "Not too bad. How about you?",
                        "Manageable so far. What about yours?",
                        "Pretty standard. How's your day going?",
                        "The usual amount. How about you?",
                        "Nothing I can't handle. You having a busy one?",
                        "Just the regular stuff. How about yourself?"
                    ],
                    "got the time?": [
                        "Not on me, sorry. What's up though?",
                        "I should be asking you that. What's going on?",
                        "Time for something new, right? What's happening?",
                        "Time flies when you're having fun. What's up with you?",
                        "Time's always moving. What's good with you?",
                        "Time to catch up. What's happening with you?"
                    ],
                    "you look tired": [
                        "A little, yeah. How about you, you good?",
                        "Just the usual amount. How are you doing?",
                        "Life'll do that. How about yourself?",
                        "Maybe a bit. What about you, how you feeling?",
                        "Could use some rest. How are you holding up?",
                        "Don't we all sometimes? How are you doing?"
                    ],
                    "you look good": [
                        "Thanks, not too bad yourself. What's up?",
                        "Appreciate that. How's it going with you?",
                        "Thanks, doing alright. What's good with you?",
                        "Thanks. How's everything with you?",
                        "That's nice of you. What's happening?",
                        "Right back at you. What's going on?"
                    ],
                    "need any help?": [
                        "I'm good, thanks. What about you, you all set?",
                        "Think I'm alright. How about yourself?",
                        "All good here. You need anything?",
                        "I'm sorted, thanks. How about you?",
                        "Got it covered. How about you, all good?",
                        "I'm all set. What about yourself?"
                    ],
                    "excuse me": [
                        "Yeah, what's up?",
                        "What can I do for you?",
                        "What's going on?",
                        "What's happening?",
                        "How can I help?",
                        "What's good?"
                    ],
                    "sorry about that": [
                        "No worries. What's going on?",
                        "It's all good. What's up?",
                        "Don't worry about it. What's happening?",
                        "No problem at all. What's good?",
                        "We're cool. What's up with you?",
                        "It's nothing. What's going on with you?"
                    ],
                    "thank you": [
                        "No problem. What's up?",
                        "Sure thing. What's going on?",
                        "Anytime. What's happening?",
                        "You got it. What's good with you?",
                        "No worries. What's up with you?",
                        "It's nothing. What are you up to?"
                    ],
                    "you busy?": [
                        "Not particularly. What's up?",
                        "Not really. What's going on?",
                        "Got a minute. What's happening?",
                        "I'm free enough. What's up?",
                        "Could be worse. What's going on?",
                        "Not too busy. What's up with you?"
                    ],
                    "can I ask you something?": [
                        "Yeah, what's on your mind?",
                        "Sure, what's up?",
                        "Go for it. What's happening?",
                        "Of course. What's going on?",
                        "Shoot. What's up?",
                        "Ask away. What's on your mind?"
                    ],
                    "having fun?": [
                        "Well enough. What about you?",
                        "Could be worse. How about yourself?",
                        "It's alright. You having a good time?",
                        "Not bad. What about you?",
                        "Decent enough. How about you?",
                        "It's OK. How about yourself?"
                    ],
                    "what do you want?": [
                        "Nothing particular. What about you?",
                        "Just chilling. What's up with you?",
                        "Not looking for anything. What's happening?",
                        "Nothing special. What's going on?",
                        "Just here. What about you?",
                        "No agenda. What about yourself?"
                    ],
                    "where have you been?": [
                        "Nowhere special. What about you?",
                        "Just around, you know? What about yourself?",
                        "The usual places. What about you?",
                        "Here and there. What have you been up to?",
                        "Just doing my thing. What about you?",
                        "Around. What about yourself?"
                    ],
                    "miss me?": [
                        "Sure, what's been going on?",
                        "Always. What's up with you?",
                        "You know it. What's happening?",
                        "Of course. What's good?",
                        "Who wouldn't? What have you been up to?",
                        "Naturally. What's been going on with you?"
                    ],
                    "remember me?": [
                        "Yeah, what's been going on?",
                        "Of course. What's up with you?",
                        "Sure do. What's happening?",
                        "How could I forget? What's good?",
                        "Definitely. What have you been up to?",
                        "Absolutely. What's new with you?"
                    ],
                    "hows it hanging": [
                        "Low and to the left, you know how it is. What's up with you?",
                        "Can't complain too much. How's it hanging with you?",
                        "All good in the hood. How about yourself?",
                        "Surviving. What's good with you?",
                        "Living the dream. How about you?",
                        "Getting by. What about yourself?"
                    ],
                    "what's crackin?": [
                        "Not much. What's good with you?",
                        "Same old, same old. What about you?",
                        "Nothing major. What's up on your end?",
                        "Just the usual. What's crackin' with you?",
                        "Not a whole lot. What about yourself?",
                        "Nothing special. What's new with you?"
                    ],
                    "what's popping?": [
                        "Not much really. What about you?",
                        "Nothing crazy. What's good with you?",
                        "Just chilling. What's up with you?",
                        "Same old stuff. What's popping with you?",
                        "Nothing worth mentioning. How about you?",
                        "Just the regular. What's happening with you?"
                    ],
                    "what's the move?": [
                        "No plans yet. What are you thinking?",
                        "I'm open to suggestions. What do you have in mind?",
                        "Nothing set in stone. What are you up for?",
                        "I'm flexible. What are you trying to do?",
                        "No specific plans. What are you feeling?",
                        "I'm down for whatever. What are you thinking?"
                    ],
                    "yoooo": [
                        "Yoooo what's good?",
                        "What up, what up?",
                        "Ayyyy what's happening?",
                        "Yooo what's going on?",
                        "What's good with you?",
                        "Hey, what's poppin'?"
                    ],
                    "wassup": [
                        "Not much. What's good with you?",
                        "Same old. What's up on your end?",
                        "Chillin'. What about you?",
                        "Just the usual. What's happening?",
                        "Nothing special. What's good?",
                        "Just here. What about yourself?"
                    ],
                    "how's business?": [
                        "It's steady enough. How about yours?",
                        "Can't complain too much. How's yours going?",
                        "It pays the bills. What about your situation?",
                        "It has its ups and downs. How about you?",
                        "Making it work. How's business for you?",
                        "Getting by. How about on your end?"
                    ],
                    "what's happening?": [
                        "Not much happening here. You?",
                        "Just the usual. What's happening with you?",
                        "Nothing special. What about you?",
                        "Just taking it easy. What's up with you?",
                        "Nothing worth mentioning. What's happening on your end?",
                        "Same old stuff. What's good with you?"
                    ],
                    "you alright?": [
                        "Yeah, I'm good. How about you?",
                        "Doing fine, thanks. How are you?",
                        "All good here. What about yourself?",
                        "I'm alright. How about you?",
                        "Yeah, no worries. How are you doing?",
                        "I'm OK. How about yourself?"
                    ],
                    "sup": [
                        "Not much. What's up with you?",
                        "Chillin'. What about you?",
                        "Just the usual. What's happening?",
                        "Nothing special. What's good?",
                        "Just here. What's up with you?",
                        "Nothing much. What about yourself?"
                    ],
                    "heya": [
                        "Hey there. What's up?",
                        "Hi! How's it going?",
                        "Hey! What's happening?",
                        "Hello! What's good?",
                        "Hey you. What's up?",
                        "Hi there. How are you?"
                    ],
                    "howdy": [
                        "Howdy! How's it going?",
                        "Hey there! What's up?",
                        "Well hello! What's happening?",
                        "Howdy partner! What's good?",
                        "Hey! How's everything?",
                        "Hi there! How are you today?"
                    ],
                    "hello there": [
                        "Hey! How's it going?",
                        "Hi there! What's up?",
                        "Hello! What's happening?",
                        "Hey there! What's good?",
                        "Hi! How's everything?",
                        "Hello! How are you today?"
                    ],
                    "hola": [
                        "Hey there! How's it going?",
                        "Hi! What's up?",
                        "Hello! What's happening?",
                        "Hey! What's good?",
                        "Hi there! How's everything?",
                        "Hello! How are you today?"
                    ],
                    "yo": [
                        "Yo! What's good?",
                        "What's up?",
                        "Hey! What's happening?",
                        "Yo, what's going on?",
                        "What's good with you?",
                        "Hey, how's it going?"
                    ],
                    "hiya": [
                        "Hey there! How's it going?",
                        "Hi! What's up?",
                        "Hello! What's happening?",
                        "Hey! What's good?",
                        "Hi there! How's everything?",
                        "Hello! How are you today?"
                    ],
                    "good to see you": [
                        "Yeah, you too! What's been going on?",
                        "Likewise! How have you been?",
                        "Good to see you too! What's up?",
                        "You too! What's been happening?",
                        "Definitely! How's everything?",
                        "Same here! What's new with you?"
                    ],
                    "how have you been?": [
                        "Been alright. What about you?",
                        "Can't complain too much. How about yourself?",
                        "Pretty good overall. How have you been?",
                        "The usual ups and downs. What about you?",
                        "Getting by, you know? How about you?",
                        "Been doing OK. How about yourself?"
                    ],
        };
    }
    get_response(input) {
        let normalized = input.trim().toLowerCase();
        let responses = this.responses[normalized];
        if (responses) {
            return responses[Math.floor(Math.random() * responses.length)];
        } else {
            return "Sorry, I don't understand that.";
        }
    }
}

function askAI(input) {
    let keyValueLM = new KeyValueLM();
    let simpleLLM = new SimpleLLM(CORPUS);

    let input_words = input.trim().split(/\s+/);

    if (input_words.length < 3) {
        let response = keyValueLM.get_response(input);
        if (response !== "Sorry, I don't understand that.") {
            return response;
        } else {
            return simpleLLM.ask(input);
        }
    } else {
        return simpleLLM.ask(input);
    }
}

console.log(askAI("hi"));
console.log(askAI("What's up?"));
console.log(askAI("Tell me about the weather"));
