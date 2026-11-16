/* One short prompt per viewing. Open-answer examples; no grading. */
window.B1VideoData = {
  "endGif": "assets/b1-video/the-end.gif",
  "status": "five videos with sequential single-prompt tasks",
  "sources": {
    "OW": {
      "code": "OW",
      "identifier": "OneWeek",
      "title": "One Week (1920)",
      "archive": "https://archive.org/details/OneWeek",
      "length": 1336.8,
      "archive_license_field": "http://creativecommons.org/licenses/publicdomain/"
    },
    "SC": {
      "code": "SC",
      "identifier": "TheScarecrow1920",
      "title": "The Scarecrow (1920)",
      "archive": "https://archive.org/details/TheScarecrow1920",
      "length": 1085.95,
      "archive_license_field": null
    },
    "CO": {
      "code": "CO",
      "identifier": "Cops1922",
      "title": "Cops (1922)",
      "archive": "https://archive.org/details/Cops1922",
      "length": 1091.96,
      "archive_license_field": null
    },
    "IM": {
      "code": "IM",
      "identifier": "CC_1917_06_17_TheImmigrant",
      "title": "The Immigrant (1917)",
      "archive": "https://archive.org/details/CC_1917_06_17_TheImmigrant",
      "length": 1200.06,
      "archive_license_field": "http://creativecommons.org/licenses/publicdomain/"
    },
    "HF": {
      "code": "HF",
      "identifier": "his_girl_friday",
      "title": "His Girl Friday (1940)",
      "archive": "https://archive.org/details/his_girl_friday",
      "length": 5504.52,
      "archive_license_field": "http://creativecommons.org/licenses/publicdomain/"
    }
  },
  "topics": [
    {
      "number": 1,
      "name": "Present Perfect",
      "stages": [
        {
          "title": "What has just changed?",
          "id": "b1_1_1",
          "source": "OW",
          "start": 180,
          "end": 215,
          "video": "assets/b1-video/b1_1_1.mp4",
          "poster": "assets/b1-video/b1_1_1.jpg",
          "tasks": [
            {
              "prompt": "What have they just received? Use just.",
              "answers": [
                "They have just received a house-building kit.",
                "They have just received the parts for their new house."
              ],
              "context": "",
              "id": "b1_1_1_q1"
            },
            {
              "prompt": "What have they already started doing? Use already.",
              "answers": [
                "They have already started building their house.",
                "They have already begun putting the house together."
              ],
              "context": "",
              "id": "b1_1_1_q2"
            },
            {
              "prompt": "What have they just read? Use just.",
              "answers": [
                "They have just read the instructions."
              ],
              "context": "",
              "id": "b1_1_1_q3"
            }
          ]
        },
        {
          "title": "Already or not yet?",
          "id": "b1_1_2",
          "source": "SC",
          "start": 120,
          "end": 155,
          "video": "assets/b1-video/b1_1_2.mp4",
          "poster": "assets/b1-video/b1_1_2.jpg",
          "tasks": [
            {
              "prompt": "What have the men already done? Write one sentence with already.",
              "answers": [
                "They have already started turning the room into a kitchen.",
                "They have already begun getting breakfast ready."
              ],
              "context": "",
              "id": "b1_1_2_q1"
            },
            {
              "prompt": "What have they not done yet? Write one sentence with not … yet.",
              "answers": [
                "They have not finished breakfast yet."
              ],
              "context": "",
              "id": "b1_1_2_q2"
            },
            {
              "prompt": "Ask if they have finished breakfast. Use yet, then give a short answer.",
              "answers": [
                "Have they finished breakfast yet? No, they have not."
              ],
              "context": "",
              "id": "b1_1_2_q3"
            }
          ]
        },
        {
          "title": "Have you ever…?",
          "id": "b1_1_3",
          "source": "CO",
          "start": 165,
          "end": 200,
          "video": "assets/b1-video/b1_1_3.mp4",
          "poster": "assets/b1-video/b1_1_3.jpg",
          "tasks": [
            {
              "prompt": "Ask a partner about buying second-hand furniture. Begin “Have you ever…?”",
              "answers": [
                "Have you ever bought second-hand furniture?"
              ],
              "context": "",
              "id": "b1_1_3_q1"
            },
            {
              "prompt": "Give one answer about your experience. Use have or have never.",
              "answers": [
                "I have bought a second-hand chair.",
                "I have never bought second-hand furniture."
              ],
              "context": "",
              "id": "b1_1_3_q2"
            },
            {
              "prompt": "Tell your partner about one purchase last year. Use Past Simple.",
              "answers": [
                "I bought a desk last year.",
                "I bought a second-hand chair last year."
              ],
              "context": "",
              "id": "b1_1_3_q3"
            }
          ]
        },
        {
          "title": "Been or gone?",
          "id": "b1_1_4",
          "source": "IM",
          "start": 60,
          "end": 95,
          "video": "assets/b1-video/b1_1_4.mp4",
          "poster": "assets/b1-video/b1_1_4.jpg",
          "tasks": [
            {
              "prompt": "Anna is still in the dining room. Where has she gone?",
              "answers": [
                "Anna has gone to the dining room."
              ],
              "context": "Imagine: Anna left the deck to visit the dining room. She has not returned.",
              "id": "b1_1_4_q1"
            },
            {
              "prompt": "Ben is back on deck. Where has he been?",
              "answers": [
                "Ben has been to the dining room."
              ],
              "context": "Imagine: Ben visited the dining room and has returned to the deck.",
              "id": "b1_1_4_q2"
            },
            {
              "prompt": "Ask your partner about travelling on a ship. Begin “Have you ever…?”",
              "answers": [
                "Have you ever travelled on a ship?",
                "Have you ever been on a ship?"
              ],
              "context": "",
              "id": "b1_1_4_q3"
            }
          ]
        },
        {
          "title": "How long?",
          "id": "b1_1_5",
          "source": "HF",
          "start": 245,
          "end": 280,
          "video": "assets/b1-video/b1_1_5.mp4",
          "poster": "assets/b1-video/b1_1_5.jpg",
          "tasks": [
            {
              "prompt": "Say how long they have known each other. Use for.",
              "answers": [
                "They have known each other for five years."
              ],
              "context": "Imagine: they first met five years ago and still know each other.",
              "id": "b1_1_5_q1"
            },
            {
              "prompt": "Say when they started staying in touch. Use since.",
              "answers": [
                "They have stayed in touch since they left school."
              ],
              "context": "Imagine: they started staying in touch when they left school and still do.",
              "id": "b1_1_5_q2"
            },
            {
              "prompt": "Ask about the length of their friendship. Begin “How long…?”",
              "answers": [
                "How long have they known each other?"
              ],
              "context": "",
              "id": "b1_1_5_q3"
            },
            {
              "prompt": "Say when their last meeting happened. Use yesterday.",
              "answers": [
                "They met yesterday.",
                "They last met yesterday."
              ],
              "context": "",
              "id": "b1_1_5_q4"
            }
          ]
        }
      ]
    },
    {
      "number": 2,
      "name": "Present Perfect Continuous",
      "stages": [
        {
          "title": "Work in progress",
          "id": "b1_2_1",
          "source": "OW",
          "start": 240,
          "end": 275,
          "video": "assets/b1-video/b1_2_1.mp4",
          "poster": "assets/b1-video/b1_2_1.jpg",
          "tasks": [
            {
              "prompt": "What has he been doing on the building site? Write one sentence.",
              "answers": [
                "He has been working on the house.",
                "He has been trying to assemble the building."
              ],
              "context": "",
              "id": "b1_2_1_q1"
            },
            {
              "prompt": "Describe his recent activity. Use has been … lately.",
              "answers": [
                "He has been spending a lot of time on the house lately.",
                "He has been working on the house lately."
              ],
              "context": "",
              "id": "b1_2_1_q2"
            }
          ]
        },
        {
          "title": "How long has it been going on?",
          "id": "b1_2_2",
          "source": "SC",
          "start": 225,
          "end": 260,
          "video": "assets/b1-video/b1_2_2.mp4",
          "poster": "assets/b1-video/b1_2_2.jpg",
          "tasks": [
            {
              "prompt": "Ask about his wait for breakfast. Begin “How long…?”",
              "answers": [
                "How long has he been waiting for breakfast?"
              ],
              "context": "Imagine: he started waiting at 9:00. It is now 10:00.",
              "id": "b1_2_2_q1"
            },
            {
              "prompt": "Say how long he has been waiting. Use for.",
              "answers": [
                "He has been waiting for an hour."
              ],
              "context": "He started waiting at 9:00. It is now 10:00.",
              "id": "b1_2_2_q2"
            },
            {
              "prompt": "Say when his wait started. Use since.",
              "answers": [
                "He has been waiting since nine o’clock."
              ],
              "context": "He started waiting at 9:00. It is now 10:00.",
              "id": "b1_2_2_q3"
            },
            {
              "prompt": "Describe the men’s activity. Use all morning.",
              "answers": [
                "They have been getting things ready all morning.",
                "They have been preparing breakfast all morning."
              ],
              "context": "Imagine that they started early this morning and are still getting breakfast ready.",
              "id": "b1_2_2_q4"
            }
          ]
        },
        {
          "title": "Ask and deny",
          "id": "b1_2_3",
          "source": "CO",
          "start": 300,
          "end": 335,
          "video": "assets/b1-video/b1_2_3.mp4",
          "poster": "assets/b1-video/b1_2_3.jpg",
          "tasks": [
            {
              "prompt": "Ask if he has been organising the load.",
              "answers": [
                "Has he been organising the load?",
                "Has he been trying to organise the load?"
              ],
              "context": "",
              "id": "b1_2_3_q1"
            },
            {
              "prompt": "Has he been resting? Give a full negative answer.",
              "answers": [
                "No, he has not been resting.",
                "He has not been resting."
              ],
              "context": "",
              "id": "b1_2_3_q2"
            },
            {
              "prompt": "What has he been dealing with? Use the cart in your answer.",
              "answers": [
                "He has been dealing with the cart."
              ],
              "context": "",
              "id": "b1_2_3_q3"
            }
          ]
        },
        {
          "title": "Why do they look like that?",
          "id": "b1_2_4",
          "source": "IM",
          "start": 165,
          "end": 200,
          "video": "assets/b1-video/b1_2_4.mp4",
          "poster": "assets/b1-video/b1_2_4.jpg",
          "tasks": [
            {
              "prompt": "Why might he look uncomfortable? Use because + has been …",
              "answers": [
                "He might look uncomfortable because he has been trying to eat on a moving ship.",
                "He looks uncomfortable because he has been trying to keep his balance."
              ],
              "context": "",
              "id": "b1_2_4_q1"
            },
            {
              "prompt": "What have the passengers been struggling to do?",
              "answers": [
                "They have been struggling to keep their balance.",
                "They have been struggling to eat on the moving ship."
              ],
              "context": "",
              "id": "b1_2_4_q2"
            }
          ]
        },
        {
          "title": "Process or result?",
          "id": "b1_2_5",
          "source": "HF",
          "start": 600,
          "end": 635,
          "video": "assets/b1-video/b1_2_5.mp4",
          "poster": "assets/b1-video/b1_2_5.jpg",
          "tasks": [
            {
              "prompt": "Describe her ongoing thoughts. Use has been thinking.",
              "answers": [
                "She has been thinking about leaving her job."
              ],
              "context": "Imagine that she started thinking about leaving her job recently and is still considering it.",
              "id": "b1_2_5_q1"
            },
            {
              "prompt": "She has finished deciding. Say this with Present Perfect Simple.",
              "answers": [
                "She has made a decision."
              ],
              "context": "",
              "id": "b1_2_5_q2"
            },
            {
              "prompt": "Say how long they have known each other. Use know, not knowing.",
              "answers": [
                "They have known each other for years."
              ],
              "context": "Imagine that they first met years ago and still know each other.",
              "id": "b1_2_5_q3"
            }
          ]
        }
      ]
    },
    {
      "number": 3,
      "name": "Past Perfect",
      "stages": [
        {
          "title": "Which happened first?",
          "id": "b1_3_1",
          "source": "OW",
          "start": 300,
          "end": 335,
          "video": "assets/b1-video/b1_3_1.mp4",
          "poster": "assets/b1-video/b1_3_1.jpg",
          "tasks": [
            {
              "prompt": "Which happened first: starting the house or seeing it complete? Join them with before.",
              "answers": [
                "They had started building before the house looked complete."
              ],
              "context": "",
              "id": "b1_3_1_q1"
            },
            {
              "prompt": "Say what he did before continuing the work. Use had read.",
              "answers": [
                "He had read the instructions before he continued working."
              ],
              "context": "Imagine that he read the instructions and then continued working.",
              "id": "b1_3_1_q2"
            }
          ]
        },
        {
          "title": "Before and after",
          "id": "b1_3_2",
          "source": "SC",
          "start": 340,
          "end": 375,
          "video": "assets/b1-video/b1_3_2.mp4",
          "poster": "assets/b1-video/b1_3_2.jpg",
          "tasks": [
            {
              "prompt": "Join the events with before: finish breakfast → clear things away.",
              "answers": [
                "They had finished breakfast before they cleared things away."
              ],
              "context": "",
              "id": "b1_3_2_q1"
            },
            {
              "prompt": "Retell the same sequence. Begin “After they had…”.",
              "answers": [
                "After they had finished breakfast, they cleared things away."
              ],
              "context": "",
              "id": "b1_3_2_q2"
            }
          ]
        },
        {
          "title": "By that moment",
          "id": "b1_3_3",
          "source": "CO",
          "start": 225,
          "end": 260,
          "video": "assets/b1-video/b1_3_3.mp4",
          "poster": "assets/b1-video/b1_3_3.jpg",
          "tasks": [
            {
              "prompt": "What had he already gathered by the time he moved on?",
              "answers": [
                "By the time he moved on, he had already gathered some furniture."
              ],
              "context": "",
              "id": "b1_3_3_q1"
            },
            {
              "prompt": "Join the two events using had just … when.",
              "answers": [
                "He had just picked up another item when someone appeared."
              ],
              "context": "Imagine: he picks up another item; a moment later, someone appears.",
              "id": "b1_3_3_q2"
            }
          ]
        },
        {
          "title": "What had not happened?",
          "id": "b1_3_4",
          "source": "IM",
          "start": 300,
          "end": 335,
          "video": "assets/b1-video/b1_3_4.mp4",
          "poster": "assets/b1-video/b1_3_4.jpg",
          "tasks": [
            {
              "prompt": "Say what had not happened before the journey. Use hadn’t met.",
              "answers": [
                "He had not met her before the journey.",
                "He hadn’t met her before the journey."
              ],
              "context": "Imagine that the man and woman were strangers before this journey.",
              "id": "b1_3_4_q1"
            },
            {
              "prompt": "Say what he had never done before. Use travelled with her.",
              "answers": [
                "He had never travelled with her before."
              ],
              "context": "Imagine that this is their first journey together.",
              "id": "b1_3_4_q2"
            }
          ]
        },
        {
          "title": "Find out the backstory",
          "id": "b1_3_5",
          "source": "HF",
          "start": 300,
          "end": 335,
          "video": "assets/b1-video/b1_3_5.mp4",
          "poster": "assets/b1-video/b1_3_5.jpg",
          "tasks": [
            {
              "prompt": "Ask if they had been married before this meeting. Give a short answer.",
              "answers": [
                "Had they been married before this meeting? Yes, they had."
              ],
              "context": "They married, then divorced, and are now meeting again.",
              "id": "b1_3_5_q1"
            },
            {
              "prompt": "Ask if they had divorced before she came to the office. Answer briefly.",
              "answers": [
                "Had they divorced before she came to the office? Yes, they had."
              ],
              "context": "They married, then divorced, and are now meeting again.",
              "id": "b1_3_5_q2"
            },
            {
              "prompt": "Describe the earlier marriage and the later visit in two sentences.",
              "answers": [
                "They had been married, but they divorced. Later, she visited the office."
              ],
              "context": "",
              "id": "b1_3_5_q3"
            }
          ]
        }
      ]
    },
    {
      "number": 4,
      "name": "Conditionals + Wish",
      "stages": [
        {
          "title": "Rules for avoiding mistakes",
          "id": "b1_4_1",
          "source": "OW",
          "start": 375,
          "end": 410,
          "video": "assets/b1-video/b1_4_1.mp4",
          "poster": "assets/b1-video/b1_4_1.jpg",
          "tasks": [
            {
              "prompt": "What do you do when instructions are unclear? Begin “If I don’t…”.",
              "answers": [
                "If I do not understand instructions, I ask for help.",
                "If I don’t understand instructions, I read them again."
              ],
              "context": "",
              "id": "b1_4_1_q1"
            },
            {
              "prompt": "Make a general rule about mistakes. Begin “If you make a mistake…”.",
              "answers": [
                "If you make a mistake, you sometimes have to start again."
              ],
              "context": "",
              "id": "b1_4_1_q2"
            }
          ]
        },
        {
          "title": "What will happen next?",
          "id": "b1_4_2",
          "source": "SC",
          "start": 525,
          "end": 560,
          "video": "assets/b1-video/b1_4_2.mp4",
          "poster": "assets/b1-video/b1_4_2.jpg",
          "tasks": [
            {
              "prompt": "What will he do if the dog comes closer?",
              "answers": [
                "If the dog comes closer, he will run away.",
                "He will try to escape if the dog comes closer."
              ],
              "context": "",
              "id": "b1_4_2_q1"
            },
            {
              "prompt": "What will not happen if he finds a safe place?",
              "answers": [
                "If he finds a safe place, the dog will not catch him."
              ],
              "context": "",
              "id": "b1_4_2_q2"
            },
            {
              "prompt": "Ask about his next action. Begin “What will he do if…?”",
              "answers": [
                "What will he do if the dog follows him?"
              ],
              "context": "",
              "id": "b1_4_2_q3"
            }
          ]
        },
        {
          "title": "Conditions and precautions",
          "id": "b1_4_3",
          "source": "CO",
          "start": 645,
          "end": 680,
          "video": "assets/b1-video/b1_4_3.mp4",
          "poster": "assets/b1-video/b1_4_3.jpg",
          "tasks": [
            {
              "prompt": "Warn him about getting in the way. Begin “Unless he stops…”.",
              "answers": [
                "Unless he stops, he may get in the way."
              ],
              "context": "",
              "id": "b1_4_3_q1"
            },
            {
              "prompt": "Say when he will move. Use when.",
              "answers": [
                "He will move when the road is clear."
              ],
              "context": "",
              "id": "b1_4_3_q2"
            },
            {
              "prompt": "Say what he will do after the parade. Begin “As soon as…”.",
              "answers": [
                "As soon as the parade ends, he will continue."
              ],
              "context": "",
              "id": "b1_4_3_q3"
            },
            {
              "prompt": "Give him permission to wait, with a condition. Use as long as.",
              "answers": [
                "He can wait here as long as he keeps the way clear."
              ],
              "context": "",
              "id": "b1_4_3_q4"
            },
            {
              "prompt": "Give a precaution involving the horse. Use in case.",
              "answers": [
                "He should keep his distance in case the horse stops suddenly."
              ],
              "context": "",
              "id": "b1_4_3_q5"
            }
          ]
        },
        {
          "title": "If you were in his place",
          "id": "b1_4_4",
          "source": "IM",
          "start": 585,
          "end": 620,
          "video": "assets/b1-video/b1_4_4.mp4",
          "poster": "assets/b1-video/b1_4_4.jpg",
          "tasks": [
            {
              "prompt": "Imagine you had more money here. Complete “If I had more money…”.",
              "answers": [
                "If I had more money, I could pay for another meal."
              ],
              "context": "",
              "id": "b1_4_4_q1"
            },
            {
              "prompt": "Give the customer one piece of advice. Begin “If I were you…”.",
              "answers": [
                "If I were you, I would explain the problem.",
                "If I were you, I would ask a friend for help."
              ],
              "context": "",
              "id": "b1_4_4_q2"
            },
            {
              "prompt": "Ask a partner what they would do without enough money to pay.",
              "answers": [
                "What would you do if you could not pay?",
                "What would you do if you did not have enough money to pay?"
              ],
              "context": "",
              "id": "b1_4_4_q3"
            }
          ]
        },
        {
          "title": "A different present",
          "id": "b1_4_5",
          "source": "HF",
          "start": 685,
          "end": 720,
          "video": "assets/b1-video/b1_4_5.mp4",
          "poster": "assets/b1-video/b1_4_5.jpg",
          "tasks": [
            {
              "prompt": "Imagine this conversation is difficult. Make a wish with were.",
              "answers": [
                "I wish this conversation were easier."
              ],
              "context": "",
              "id": "b1_4_5_q1"
            },
            {
              "prompt": "Wish for the ability to explain your feelings. Use could.",
              "answers": [
                "I wish I could explain my feelings clearly.",
                "I wish I could explain everything clearly."
              ],
              "context": "",
              "id": "b1_4_5_q2"
            },
            {
              "prompt": "Ask someone to change their behaviour. Begin “I wish you would…”.",
              "answers": [
                "I wish you would listen to me."
              ],
              "context": "",
              "id": "b1_4_5_q3"
            },
            {
              "prompt": "Wish for more time. Begin “If only…”.",
              "answers": [
                "If only we had more time."
              ],
              "context": "",
              "id": "b1_4_5_q4"
            }
          ]
        }
      ]
    },
    {
      "number": 5,
      "name": "Passive",
      "stages": [
        {
          "title": "Focus on the objects",
          "id": "b1_5_1",
          "source": "OW",
          "start": 555,
          "end": 590,
          "video": "assets/b1-video/b1_5_1.mp4",
          "poster": "assets/b1-video/b1_5_1.jpg",
          "tasks": [
            {
              "prompt": "What are tiles used for? Use Present Simple Passive.",
              "answers": [
                "Tiles are used to cover roofs."
              ],
              "context": "",
              "id": "b1_5_1_q1"
            },
            {
              "prompt": "Say that a roof is not built very quickly. Use Present Simple Passive.",
              "answers": [
                "A roof is not built in a few minutes."
              ],
              "context": "",
              "id": "b1_5_1_q2"
            },
            {
              "prompt": "Ask how the materials are attached. Use a passive question.",
              "answers": [
                "How are the materials attached?"
              ],
              "context": "",
              "id": "b1_5_1_q3"
            }
          ]
        },
        {
          "title": "What was changed?",
          "id": "b1_5_2",
          "source": "SC",
          "start": 375,
          "end": 410,
          "video": "assets/b1-video/b1_5_2.mp4",
          "poster": "assets/b1-video/b1_5_2.jpg",
          "tasks": [
            {
              "prompt": "Say who moved the furniture. Begin “The furniture was…”.",
              "answers": [
                "The furniture was moved by the men."
              ],
              "context": "",
              "id": "b1_5_2_q1"
            },
            {
              "prompt": "Say what did not happen to the furniture. Use wasn’t thrown away.",
              "answers": [
                "The furniture was not thrown away.",
                "The furniture wasn’t thrown away."
              ],
              "context": "",
              "id": "b1_5_2_q2"
            },
            {
              "prompt": "Ask whether the table was moved.",
              "answers": [
                "Was the table moved?"
              ],
              "context": "",
              "id": "b1_5_2_q3"
            }
          ]
        },
        {
          "title": "What is being done now?",
          "id": "b1_5_3",
          "source": "CO",
          "start": 360,
          "end": 395,
          "video": "assets/b1-video/b1_5_3.mp4",
          "poster": "assets/b1-video/b1_5_3.jpg",
          "tasks": [
            {
              "prompt": "What is happening to the furniture now? Use is being.",
              "answers": [
                "The furniture is being transported."
              ],
              "context": "",
              "id": "b1_5_3_q1"
            },
            {
              "prompt": "Say that they are not unloading it here. Begin “The furniture…”.",
              "answers": [
                "The furniture is not being unloaded here."
              ],
              "context": "",
              "id": "b1_5_3_q2"
            },
            {
              "prompt": "Ask where they are taking the furniture. Use a passive question.",
              "answers": [
                "Where is the furniture being taken?"
              ],
              "context": "",
              "id": "b1_5_3_q3"
            }
          ]
        },
        {
          "title": "What has already been done?",
          "id": "b1_5_4",
          "source": "IM",
          "start": 660,
          "end": 695,
          "video": "assets/b1-video/b1_5_4.mp4",
          "poster": "assets/b1-video/b1_5_4.jpg",
          "tasks": [
            {
              "prompt": "What has already been brought to the table? Use Passive.",
              "answers": [
                "Food has already been brought to the table."
              ],
              "context": "",
              "id": "b1_5_4_q1"
            },
            {
              "prompt": "Ask whether the bill has been paid. Use yet.",
              "answers": [
                "Has the bill been paid yet?"
              ],
              "context": "",
              "id": "b1_5_4_q2"
            },
            {
              "prompt": "Say what has not happened to the table yet. Use hasn’t been cleared.",
              "answers": [
                "The table has not been cleared yet.",
                "The table hasn’t been cleared yet."
              ],
              "context": "",
              "id": "b1_5_4_q3"
            }
          ]
        },
        {
          "title": "The next edition",
          "id": "b1_5_5",
          "source": "HF",
          "start": 120,
          "end": 155,
          "video": "assets/b1-video/b1_5_5.mp4",
          "poster": "assets/b1-video/b1_5_5.jpg",
          "tasks": [
            {
              "prompt": "Say when the article will be published. Use Passive.",
              "answers": [
                "The article will be published tomorrow."
              ],
              "context": "Imagine: the newsroom plans to publish the article tomorrow.",
              "id": "b1_5_5_q1"
            },
            {
              "prompt": "State a rule for the facts. Use must be checked.",
              "answers": [
                "The facts must be checked."
              ],
              "context": "",
              "id": "b1_5_5_q2"
            },
            {
              "prompt": "Recommend a change to the headline. Use should be.",
              "answers": [
                "The headline should be changed."
              ],
              "context": "",
              "id": "b1_5_5_q3"
            },
            {
              "prompt": "Explain how they can send the report. Use can be.",
              "answers": [
                "The report can be sent by email."
              ],
              "context": "",
              "id": "b1_5_5_q4"
            }
          ]
        }
      ]
    },
    {
      "number": 6,
      "name": "Reported speech",
      "stages": [
        {
          "title": "Pass on the message",
          "id": "b1_6_1",
          "source": "OW",
          "start": 60,
          "end": 95,
          "video": "assets/b1-video/b1_6_1.mp4",
          "poster": "assets/b1-video/b1_6_1.jpg",
          "tasks": [
            {
              "prompt": "Imagine they say, “We have a new home.” Report it with “They said…”.",
              "answers": [
                "They said that they had a new home.",
                "They said they had a new home."
              ],
              "context": "",
              "id": "b1_6_1_q1"
            },
            {
              "prompt": "Imagine he says to her, “I will help you.” Report it with told.",
              "answers": [
                "He told her that he would help her.",
                "He told her he would help her."
              ],
              "context": "",
              "id": "b1_6_1_q2"
            }
          ]
        },
        {
          "title": "One step back",
          "id": "b1_6_2",
          "source": "SC",
          "start": 55,
          "end": 90,
          "video": "assets/b1-video/b1_6_2.mp4",
          "poster": "assets/b1-video/b1_6_2.jpg",
          "tasks": [
            {
              "prompt": "Imagine he says, “I am hungry.” Report it later.",
              "answers": [
                "He said that he was hungry.",
                "He said he was hungry."
              ],
              "context": "",
              "id": "b1_6_2_q1"
            },
            {
              "prompt": "Imagine he says, “I have finished.” Report it later.",
              "answers": [
                "He said that he had finished.",
                "He said he had finished."
              ],
              "context": "",
              "id": "b1_6_2_q2"
            },
            {
              "prompt": "Imagine he says, “I went outside yesterday.” Report it later.",
              "answers": [
                "He said that he had gone outside the day before.",
                "He said he had gone outside the day before."
              ],
              "context": "",
              "id": "b1_6_2_q3"
            },
            {
              "prompt": "Imagine he says, “I cannot wait.” Report it later.",
              "answers": [
                "He said that he could not wait.",
                "He said he could not wait."
              ],
              "context": "",
              "id": "b1_6_2_q4"
            }
          ]
        },
        {
          "title": "Questions without question order",
          "id": "b1_6_3",
          "source": "CO",
          "start": 20,
          "end": 55,
          "video": "assets/b1-video/b1_6_3.mp4",
          "poster": "assets/b1-video/b1_6_3.jpg",
          "tasks": [
            {
              "prompt": "Imagine she asks him, “Do you have a job?” Report her question.",
              "answers": [
                "She asked him if he had a job.",
                "She asked him whether he had a job."
              ],
              "context": "",
              "id": "b1_6_3_q1"
            },
            {
              "prompt": "Imagine she asks him, “Where do you work?” Report her question.",
              "answers": [
                "She asked him where he worked."
              ],
              "context": "",
              "id": "b1_6_3_q2"
            },
            {
              "prompt": "Imagine she asks him, “Have you earned any money?” Report her question.",
              "answers": [
                "She asked him whether he had earned any money.",
                "She asked him if he had earned any money."
              ],
              "context": "",
              "id": "b1_6_3_q3"
            }
          ]
        },
        {
          "title": "Requests, orders and invitations",
          "id": "b1_6_4",
          "source": "IM",
          "start": 1080,
          "end": 1115,
          "video": "assets/b1-video/b1_6_4.mp4",
          "poster": "assets/b1-video/b1_6_4.jpg",
          "tasks": [
            {
              "prompt": "Imagine the waiter says, “Please wait here.” Report his request.",
              "answers": [
                "The waiter asked them to wait there."
              ],
              "context": "",
              "id": "b1_6_4_q1"
            },
            {
              "prompt": "Imagine the waiter says, “Do not leave.” Report his order.",
              "answers": [
                "The waiter told them not to leave."
              ],
              "context": "",
              "id": "b1_6_4_q2"
            },
            {
              "prompt": "Imagine a customer says to him, “Come to lunch with us.” Report the invitation.",
              "answers": [
                "The customer invited him to have lunch with them.",
                "The customer invited him to lunch."
              ],
              "context": "",
              "id": "b1_6_4_q3"
            }
          ]
        },
        {
          "title": "Retell it tomorrow",
          "id": "b1_6_5",
          "source": "HF",
          "start": 780,
          "end": 815,
          "video": "assets/b1-video/b1_6_5.mp4",
          "poster": "assets/b1-video/b1_6_5.jpg",
          "tasks": [
            {
              "prompt": "Imagine Bruce says, “I am busy now.” Report it the next day.",
              "answers": [
                "Bruce said that he was busy then.",
                "Bruce said he was busy then."
              ],
              "context": "",
              "id": "b1_6_5_q1"
            },
            {
              "prompt": "Imagine Bruce says, “I have an appointment today.” Report it the next day.",
              "answers": [
                "He said that he had an appointment that day.",
                "Bruce said he had an appointment that day."
              ],
              "context": "",
              "id": "b1_6_5_q2"
            },
            {
              "prompt": "Imagine Bruce says to them, “I will meet you here tomorrow.” Report it later from another place.",
              "answers": [
                "He said that he would meet them there the next day."
              ],
              "context": "",
              "id": "b1_6_5_q3"
            },
            {
              "prompt": "Imagine Bruce asks them, “Can you wait?” Report his question.",
              "answers": [
                "He asked if they could wait.",
                "He asked whether they could wait."
              ],
              "context": "",
              "id": "b1_6_5_q4"
            }
          ]
        }
      ]
    },
    {
      "number": 7,
      "name": "Relative clauses",
      "stages": [
        {
          "title": "Which person?",
          "id": "b1_7_1",
          "source": "OW",
          "start": 660,
          "end": 695,
          "video": "assets/b1-video/b1_7_1.mp4",
          "poster": "assets/b1-video/b1_7_1.jpg",
          "tasks": [
            {
              "prompt": "Which man do you mean? Describe him using who.",
              "answers": [
                "He is the man who is standing in the room.",
                "He is the man who is trying to get up."
              ],
              "context": "",
              "id": "b1_7_1_q1"
            },
            {
              "prompt": "Describe the same man using that.",
              "answers": [
                "He is the man that is standing in the room.",
                "He is the man that is trying to get up."
              ],
              "context": "",
              "id": "b1_7_1_q2"
            }
          ]
        },
        {
          "title": "What is it for?",
          "id": "b1_7_2",
          "source": "SC",
          "start": 180,
          "end": 215,
          "video": "assets/b1-video/b1_7_2.mp4",
          "poster": "assets/b1-video/b1_7_2.jpg",
          "tasks": [
            {
              "prompt": "Describe a useful device in the room. Use that.",
              "answers": [
                "This is a device that helps them prepare food."
              ],
              "context": "",
              "id": "b1_7_2_q1"
            },
            {
              "prompt": "Describe a piece of furniture with more than one use. Use which.",
              "answers": [
                "It is a piece of furniture which has more than one use."
              ],
              "context": "",
              "id": "b1_7_2_q2"
            }
          ]
        },
        {
          "title": "Whose belongings?",
          "id": "b1_7_3",
          "source": "CO",
          "start": 255,
          "end": 290,
          "video": "assets/b1-video/b1_7_3.mp4",
          "poster": "assets/b1-video/b1_7_3.jpg",
          "tasks": [
            {
              "prompt": "Join the facts using whose: the woman owns the chair; the chair is on the cart.",
              "answers": [
                "This is the woman whose chair is on the cart."
              ],
              "context": "For this task, imagine that the woman owns the chair.",
              "id": "b1_7_3_q1"
            },
            {
              "prompt": "Describe the family and its furniture. Use whose.",
              "answers": [
                "That is the family whose furniture is outside."
              ],
              "context": "For this task, imagine that the furniture outside belongs to this family.",
              "id": "b1_7_3_q2"
            }
          ]
        },
        {
          "title": "Which place?",
          "id": "b1_7_4",
          "source": "IM",
          "start": 780,
          "end": 815,
          "video": "assets/b1-video/b1_7_4.mp4",
          "poster": "assets/b1-video/b1_7_4.jpg",
          "tasks": [
            {
              "prompt": "Describe the restaurant as their meeting place. Use where.",
              "answers": [
                "This is the restaurant where they meet."
              ],
              "context": "",
              "id": "b1_7_4_q1"
            },
            {
              "prompt": "Describe what is happening in the restaurant. Use where.",
              "answers": [
                "They meet in a restaurant where several people are eating."
              ],
              "context": "",
              "id": "b1_7_4_q2"
            }
          ]
        },
        {
          "title": "Can you leave it out?",
          "id": "b1_7_5",
          "source": "HF",
          "start": 820,
          "end": 855,
          "video": "assets/b1-video/b1_7_5.mp4",
          "poster": "assets/b1-video/b1_7_5.jpg",
          "tasks": [
            {
              "prompt": "Identify Bruce by his umbrella. Use who.",
              "answers": [
                "The man who is holding an umbrella is Bruce."
              ],
              "context": "",
              "id": "b1_7_5_q1"
            },
            {
              "prompt": "Identify Bruce as the person Hildy introduces. Use that.",
              "answers": [
                "The man that Hildy introduces is Bruce."
              ],
              "context": "",
              "id": "b1_7_5_q2"
            },
            {
              "prompt": "Rewrite without that: “The man that Hildy introduces is Bruce.”",
              "answers": [
                "The man Hildy introduces is Bruce."
              ],
              "context": "",
              "id": "b1_7_5_q3"
            }
          ]
        }
      ]
    },
    {
      "number": 8,
      "name": "Question tags",
      "stages": [
        {
          "title": "Check a positive observation",
          "id": "b1_8_1",
          "source": "OW",
          "start": 795,
          "end": 830,
          "video": "assets/b1-video/b1_8_1.mp4",
          "poster": "assets/b1-video/b1_8_1.jpg",
          "tasks": [
            {
              "prompt": "Add a question tag: “He is on the roof, …?”",
              "answers": [
                "He is on the roof, isn’t he?"
              ],
              "context": "",
              "id": "b1_8_1_q1"
            },
            {
              "prompt": "Add a question tag: “He needs to be careful, …?”",
              "answers": [
                "He needs to be careful, doesn’t he?"
              ],
              "context": "",
              "id": "b1_8_1_q2"
            },
            {
              "prompt": "Add a question tag: “He has climbed up there, …?”",
              "answers": [
                "He has climbed up there, hasn’t he?"
              ],
              "context": "",
              "id": "b1_8_1_q3"
            }
          ]
        },
        {
          "title": "Check a negative observation",
          "id": "b1_8_2",
          "source": "SC",
          "start": 570,
          "end": 605,
          "video": "assets/b1-video/b1_8_2.mp4",
          "poster": "assets/b1-video/b1_8_2.jpg",
          "tasks": [
            {
              "prompt": "Add a question tag: “He is not buying furniture, …?”",
              "answers": [
                "He is not buying furniture, is he?"
              ],
              "context": "",
              "id": "b1_8_2_q1"
            },
            {
              "prompt": "Add a question tag: “He does not look relaxed, …?”",
              "answers": [
                "He does not look relaxed, does he?"
              ],
              "context": "",
              "id": "b1_8_2_q2"
            },
            {
              "prompt": "Add a question tag: “He did not stay in the shop forever, …?”",
              "answers": [
                "He did not stay in the shop forever, did he?"
              ],
              "context": "",
              "id": "b1_8_2_q3"
            }
          ]
        },
        {
          "title": "Change the sentence, change the tag",
          "id": "b1_8_3",
          "source": "CO",
          "start": 480,
          "end": 515,
          "video": "assets/b1-video/b1_8_3.mp4",
          "poster": "assets/b1-video/b1_8_3.jpg",
          "tasks": [
            {
              "prompt": "Add a question tag: “He can drive the cart, …?”",
              "answers": [
                "He can drive the cart, can’t he?"
              ],
              "context": "",
              "id": "b1_8_3_q1"
            },
            {
              "prompt": "Add a question tag: “He will need help, …?”",
              "answers": [
                "He will need help, won’t he?"
              ],
              "context": "",
              "id": "b1_8_3_q2"
            },
            {
              "prompt": "Add a question tag: “He has stopped, …?”",
              "answers": [
                "He has stopped, hasn’t he?"
              ],
              "context": "",
              "id": "b1_8_3_q3"
            },
            {
              "prompt": "Add a question tag: “He cannot move it easily, …?”",
              "answers": [
                "He cannot move it easily, can he?"
              ],
              "context": "",
              "id": "b1_8_3_q4"
            }
          ]
        },
        {
          "title": "The special endings",
          "id": "b1_8_4",
          "source": "IM",
          "start": 840,
          "end": 875,
          "video": "assets/b1-video/b1_8_4.mp4",
          "poster": "assets/b1-video/b1_8_4.jpg",
          "tasks": [
            {
              "prompt": "Imagine you are waiting to be served. Add a tag: “I am next, …?”",
              "answers": [
                "I am next, aren’t I?"
              ],
              "context": "",
              "id": "b1_8_4_q1"
            },
            {
              "prompt": "Suggest asking for the bill. Add a tag after “Let’s…”.",
              "answers": [
                "Let’s ask for the bill, shall we?"
              ],
              "context": "",
              "id": "b1_8_4_q2"
            },
            {
              "prompt": "Ask someone to wait. Add a tag: “Wait a moment, …?”",
              "answers": [
                "Wait a moment, will you?"
              ],
              "context": "",
              "id": "b1_8_4_q3"
            },
            {
              "prompt": "Add a question tag: “Do not leave yet, …?”",
              "answers": [
                "Do not leave yet, will you?"
              ],
              "context": "",
              "id": "b1_8_4_q4"
            },
            {
              "prompt": "Add a question tag: “Nobody at our table has paid yet, …?”",
              "answers": [
                "Nobody at our table has paid yet, have they?"
              ],
              "context": "",
              "id": "b1_8_4_q5"
            },
            {
              "prompt": "Add a question tag: “There is a waiter over there, …?”",
              "answers": [
                "There is a waiter over there, isn’t there?"
              ],
              "context": "",
              "id": "b1_8_4_q6"
            }
          ]
        },
        {
          "title": "A real question or confirmation?",
          "id": "b1_8_5",
          "source": "HF",
          "start": 855,
          "end": 890,
          "video": "assets/b1-video/b1_8_5.mp4",
          "poster": "assets/b1-video/b1_8_5.jpg",
          "tasks": [
            {
              "prompt": "Say “We are going to lunch, aren’t we?” as a genuine question.",
              "answers": [
                "We are going to lunch, aren’t we? ↗"
              ],
              "context": "",
              "id": "b1_8_5_q1"
            },
            {
              "prompt": "Say the same line as if you expect agreement.",
              "answers": [
                "We are going to lunch, aren’t we? ↘"
              ],
              "context": "",
              "id": "b1_8_5_q2"
            }
          ]
        }
      ]
    },
    {
      "number": 9,
      "name": "Modals of deduction",
      "stages": [
        {
          "title": "An observation and a strong guess",
          "id": "b1_9_1",
          "source": "OW",
          "start": 840,
          "end": 875,
          "video": "assets/b1-video/b1_9_1.mp4",
          "poster": "assets/b1-video/b1_9_1.jpg",
          "tasks": [
            {
              "prompt": "What can you see the guests doing? State one fact.",
              "answers": [
                "The guests are sitting together in the room.",
                "The guests are looking around the room."
              ],
              "context": "",
              "id": "b1_9_1_q1"
            },
            {
              "prompt": "What do the guests’ reactions suggest? Make one guess with must and give a reason.",
              "answers": [
                "They must be surprised because the room is behaving unusually.",
                "Something must be wrong because the guests look surprised."
              ],
              "context": "",
              "id": "b1_9_1_q2"
            }
          ]
        },
        {
          "title": "More than one explanation",
          "id": "b1_9_2",
          "source": "SC",
          "start": 720,
          "end": 755,
          "video": "assets/b1-video/b1_9_2.mp4",
          "poster": "assets/b1-video/b1_9_2.jpg",
          "tasks": [
            {
              "prompt": "What might the dog be doing? Give one possible explanation with might.",
              "answers": [
                "The dog might be looking for the man."
              ],
              "context": "",
              "id": "b1_9_2_q1"
            },
            {
              "prompt": "Give another explanation with may.",
              "answers": [
                "It may want to follow him."
              ],
              "context": "",
              "id": "b1_9_2_q2"
            },
            {
              "prompt": "Give one possible explanation with could.",
              "answers": [
                "It could be curious about the hiding place."
              ],
              "context": "",
              "id": "b1_9_2_q3"
            }
          ]
        },
        {
          "title": "Impossible or forbidden?",
          "id": "b1_9_3",
          "source": "CO",
          "start": 705,
          "end": 740,
          "video": "assets/b1-video/b1_9_3.mp4",
          "poster": "assets/b1-video/b1_9_3.jpg",
          "tasks": [
            {
              "prompt": "Could this be an ordinary, safe situation? Give a deduction with can’t.",
              "answers": [
                "This can’t be an ordinary, safe situation."
              ],
              "context": "",
              "id": "b1_9_3_q1"
            },
            {
              "prompt": "Warn someone about touching an unknown dangerous object. Use mustn’t.",
              "answers": [
                "You mustn’t touch an unknown dangerous object."
              ],
              "context": "",
              "id": "b1_9_3_q2"
            }
          ]
        },
        {
          "title": "Choose your level of confidence",
          "id": "b1_9_4",
          "source": "IM",
          "start": 960,
          "end": 995,
          "video": "assets/b1-video/b1_9_4.mp4",
          "poster": "assets/b1-video/b1_9_4.jpg",
          "tasks": [
            {
              "prompt": "Why might the customers be worried? Give one possibility.",
              "answers": [
                "They might be worried about the bill."
              ],
              "context": "",
              "id": "b1_9_4_q1"
            },
            {
              "prompt": "What does the waiter want? Use must and give one reason.",
              "answers": [
                "The waiter must want their attention because he stays close to the table."
              ],
              "context": "",
              "id": "b1_9_4_q2"
            },
            {
              "prompt": "Could the waiter be far away? Use can’t and give your evidence.",
              "answers": [
                "The waiter can’t be far away because he is standing beside them."
              ],
              "context": "",
              "id": "b1_9_4_q3"
            }
          ]
        },
        {
          "title": "A new clue changes your mind",
          "id": "b1_9_5",
          "source": "HF",
          "start": 1065,
          "end": 1100,
          "video": "assets/b1-video/b1_9_5.mp4",
          "poster": "assets/b1-video/b1_9_5.jpg",
          "tasks": [
            {
              "prompt": "What might they be planning? Make one guess about the lunch.",
              "answers": [
                "They might be planning a long lunch.",
                "They might be discussing their plans."
              ],
              "context": "",
              "id": "b1_9_5_q1"
            },
            {
              "prompt": "Use the new clue. Why might they need to finish lunch soon?",
              "answers": [
                "They might need to finish lunch soon because they are leaving today.",
                "They must have things to arrange because they are leaving today."
              ],
              "context": "New clue: they are leaving town today and still have arrangements to make.",
              "id": "b1_9_5_q2"
            }
          ]
        }
      ]
    },
    {
      "number": 10,
      "name": "Gerund & infinitive",
      "stages": [
        {
          "title": "What do they want or avoid?",
          "id": "b1_10_1",
          "source": "OW",
          "start": 1140,
          "end": 1175,
          "video": "assets/b1-video/b1_10_1.mp4",
          "poster": "assets/b1-video/b1_10_1.jpg",
          "tasks": [
            {
              "prompt": "What do they want to do with the house? Use want.",
              "answers": [
                "They want to move the house."
              ],
              "context": "",
              "id": "b1_10_1_q1"
            },
            {
              "prompt": "What have they decided to use? Use decide.",
              "answers": [
                "They have decided to use barrels."
              ],
              "context": "",
              "id": "b1_10_1_q2"
            },
            {
              "prompt": "What are they trying to avoid? Use avoid + -ing.",
              "answers": [
                "They are trying to avoid damaging the building."
              ],
              "context": "",
              "id": "b1_10_1_q3"
            },
            {
              "prompt": "What does he keep doing? Use keep + -ing.",
              "answers": [
                "He keeps looking for a way to move the house."
              ],
              "context": "",
              "id": "b1_10_1_q4"
            }
          ]
        },
        {
          "title": "One verb, two meanings",
          "id": "b1_10_2",
          "source": "SC",
          "start": 780,
          "end": 815,
          "video": "assets/b1-video/b1_10_2.mp4",
          "poster": "assets/b1-video/b1_10_2.jpg",
          "tasks": [
            {
              "prompt": "Say that he is no longer running. Use stop.",
              "answers": [
                "He stopped running."
              ],
              "context": "",
              "id": "b1_10_2_q1"
            },
            {
              "prompt": "Say that he paused another activity in order to talk. Use stop.",
              "answers": [
                "He stopped to talk to someone."
              ],
              "context": "",
              "id": "b1_10_2_q2"
            },
            {
              "prompt": "Say that he remembers a past action: changing his clothes.",
              "answers": [
                "He remembers changing his clothes."
              ],
              "context": "",
              "id": "b1_10_2_q3"
            },
            {
              "prompt": "Say that he did not forget the task of changing his clothes.",
              "answers": [
                "He remembered to change his clothes."
              ],
              "context": "",
              "id": "b1_10_2_q4"
            },
            {
              "prompt": "Suggest hiding in the field as a possible solution. Use try + -ing.",
              "answers": [
                "He could try hiding in the field."
              ],
              "context": "",
              "id": "b1_10_2_q5"
            },
            {
              "prompt": "Describe his effort to escape. Use try + to.",
              "answers": [
                "He tried to escape."
              ],
              "context": "",
              "id": "b1_10_2_q6"
            }
          ]
        },
        {
          "title": "After the preposition",
          "id": "b1_10_3",
          "source": "CO",
          "start": 840,
          "end": 875,
          "video": "assets/b1-video/b1_10_3.mp4",
          "poster": "assets/b1-video/b1_10_3.jpg",
          "tasks": [
            {
              "prompt": "How does he run away? Use without + -ing.",
              "answers": [
                "He runs away without stopping."
              ],
              "context": "",
              "id": "b1_10_3_q1"
            },
            {
              "prompt": "What is he afraid of? Use afraid of + -ing.",
              "answers": [
                "He is afraid of getting caught."
              ],
              "context": "",
              "id": "b1_10_3_q2"
            },
            {
              "prompt": "What is he thinking about? Use about + -ing.",
              "answers": [
                "He is thinking about finding a hiding place."
              ],
              "context": "",
              "id": "b1_10_3_q3"
            },
            {
              "prompt": "What is he looking forward to? Use -ing.",
              "answers": [
                "He is looking forward to getting away."
              ],
              "context": "",
              "id": "b1_10_3_q4"
            }
          ]
        },
        {
          "title": "Build a different sentence frame",
          "id": "b1_10_4",
          "source": "IM",
          "start": 1020,
          "end": 1055,
          "video": "assets/b1-video/b1_10_4.mp4",
          "poster": "assets/b1-video/b1_10_4.jpg",
          "tasks": [
            {
              "prompt": "Describe waiting at the table. Begin with Waiting.",
              "answers": [
                "Waiting can be stressful."
              ],
              "context": "",
              "id": "b1_10_4_q1"
            },
            {
              "prompt": "Say that explaining the problem is difficult. Begin “It is…”.",
              "answers": [
                "It is difficult to explain the problem."
              ],
              "context": "",
              "id": "b1_10_4_q2"
            },
            {
              "prompt": "Say how long paying the bill takes. Use It takes.",
              "answers": [
                "It takes a few minutes to pay the bill."
              ],
              "context": "Imagine that paying takes a few minutes.",
              "id": "b1_10_4_q3"
            },
            {
              "prompt": "Say that pretending will not help. Begin “It is no use…”.",
              "answers": [
                "It is no use pretending that nothing is wrong."
              ],
              "context": "",
              "id": "b1_10_4_q4"
            },
            {
              "prompt": "Why can’t he enjoy the meal? Use too … to.",
              "answers": [
                "He is too worried to enjoy the meal."
              ],
              "context": "",
              "id": "b1_10_4_q5"
            },
            {
              "prompt": "Say that he lacks confidence to explain the problem. Use enough.",
              "answers": [
                "He is not confident enough to explain the problem."
              ],
              "context": "",
              "id": "b1_10_4_q6"
            }
          ]
        },
        {
          "title": "Purpose, preferences and wishes",
          "id": "b1_10_5",
          "source": "HF",
          "start": 925,
          "end": 960,
          "video": "assets/b1-video/b1_10_5.mp4",
          "poster": "assets/b1-video/b1_10_5.jpg",
          "tasks": [
            {
              "prompt": "Imagine why they have met. Express the purpose with to.",
              "answers": [
                "They have met to discuss her plans."
              ],
              "context": "",
              "id": "b1_10_5_q1"
            },
            {
              "prompt": "Imagine why he is talking to her. Use in order to.",
              "answers": [
                "He talks to her in order to change her mind."
              ],
              "context": "",
              "id": "b1_10_5_q2"
            },
            {
              "prompt": "Say that she likes working with people. Use either -ing or to.",
              "answers": [
                "She likes working with people.",
                "She likes to work with people."
              ],
              "context": "",
              "id": "b1_10_5_q3"
            },
            {
              "prompt": "Say when her work there began. Use started + -ing or to.",
              "answers": [
                "She started working there last year.",
                "She started to work there last year."
              ],
              "context": "Imagine that she started this job last year.",
              "id": "b1_10_5_q4"
            },
            {
              "prompt": "Say that she prefers talking in person. Use -ing or to.",
              "answers": [
                "She prefers talking in person.",
                "She prefers to talk in person."
              ],
              "context": "",
              "id": "b1_10_5_q5"
            },
            {
              "prompt": "Express her wish for a fresh start. Use would like or would love.",
              "answers": [
                "She would like to make a fresh start.",
                "She would love to make a fresh start."
              ],
              "context": "",
              "id": "b1_10_5_q6"
            }
          ]
        }
      ]
    },
    {
      "number": 11,
      "name": "Word formation",
      "stages": [
        {
          "title": "Turn actions into nouns",
          "id": "b1_11_1",
          "source": "OW",
          "start": 1215,
          "end": 1250,
          "video": "assets/b1-video/b1_11_1.mp4",
          "poster": "assets/b1-video/b1_11_1.jpg",
          "tasks": [
            {
              "prompt": "Write the sentence using a noun from decide: “Their ___ has created a problem.”",
              "answers": [
                "Their decision has created a problem."
              ],
              "context": "",
              "id": "b1_11_1_q1"
            },
            {
              "prompt": "Write the sentence using a noun from move: “The ___ of the house looks difficult.”",
              "answers": [
                "The movement of the house looks difficult."
              ],
              "context": "",
              "id": "b1_11_1_q2"
            },
            {
              "prompt": "Write the sentence using a noun from safe: “___ is important.”",
              "answers": [
                "Safety is important."
              ],
              "context": "",
              "id": "b1_11_1_q3"
            },
            {
              "prompt": "Write the sentence using a noun from happy: “Their new home brings them ___.”",
              "answers": [
                "Their new home brings them happiness."
              ],
              "context": "",
              "id": "b1_11_1_q4"
            },
            {
              "prompt": "Write the sentence using a noun from choose: “They have made a difficult ___.”",
              "answers": [
                "They have made a difficult choice."
              ],
              "context": "",
              "id": "b1_11_1_q5"
            }
          ]
        },
        {
          "title": "Describe the people and the action",
          "id": "b1_11_2",
          "source": "SC",
          "start": 1005,
          "end": 1040,
          "video": "assets/b1-video/b1_11_2.mp4",
          "poster": "assets/b1-video/b1_11_2.jpg",
          "tasks": [
            {
              "prompt": "Write the sentence using an adjective from care: “They need to be ___.”",
              "answers": [
                "They need to be careful."
              ],
              "context": "",
              "id": "b1_11_2_q1"
            },
            {
              "prompt": "Write the sentence using an adjective from danger: “The journey looks ___.”",
              "answers": [
                "The journey looks dangerous."
              ],
              "context": "",
              "id": "b1_11_2_q2"
            },
            {
              "prompt": "Write the sentence using an adjective from luck: “They are ___ to escape.”",
              "answers": [
                "They are lucky to escape."
              ],
              "context": "",
              "id": "b1_11_2_q3"
            },
            {
              "prompt": "Write the sentence using an adjective from use: “A vehicle is ___ here.”",
              "answers": [
                "A vehicle is useful here."
              ],
              "context": "",
              "id": "b1_11_2_q4"
            },
            {
              "prompt": "Write the sentence using an adjective from person: “It is a ___ decision.”",
              "answers": [
                "It is a personal decision."
              ],
              "context": "",
              "id": "b1_11_2_q5"
            }
          ]
        },
        {
          "title": "Change the meaning with a prefix",
          "id": "b1_11_3",
          "source": "CO",
          "start": 960,
          "end": 995,
          "video": "assets/b1-video/b1_11_3.mp4",
          "poster": "assets/b1-video/b1_11_3.jpg",
          "tasks": [
            {
              "prompt": "Describe the ladder with the opposite of safe. Write one sentence.",
              "answers": [
                "The ladder looks unsafe."
              ],
              "context": "",
              "id": "b1_11_3_q1"
            },
            {
              "prompt": "Describe the escape with the opposite of possible. Write one sentence.",
              "answers": [
                "The escape seems impossible.",
                "The escape looks almost impossible."
              ],
              "context": "",
              "id": "b1_11_3_q2"
            },
            {
              "prompt": "Write the sentence using the opposite of correct: “An ___ move could cause an accident.”",
              "answers": [
                "An incorrect move could cause an accident."
              ],
              "context": "",
              "id": "b1_11_3_q3"
            },
            {
              "prompt": "Write the sentence using the opposite of honest: “Stealing would be ___.”",
              "answers": [
                "Stealing would be dishonest."
              ],
              "context": "",
              "id": "b1_11_3_q4"
            },
            {
              "prompt": "Write the sentence using the opposite of legal: “Stealing a car is ___.”",
              "answers": [
                "Stealing a car is illegal."
              ],
              "context": "",
              "id": "b1_11_3_q5"
            }
          ]
        },
        {
          "title": "Name the person",
          "id": "b1_11_4",
          "source": "IM",
          "start": 1140,
          "end": 1175,
          "video": "assets/b1-video/b1_11_4.mp4",
          "poster": "assets/b1-video/b1_11_4.jpg",
          "tasks": [
            {
              "prompt": "Write the sentence using a person noun from visit: “The ___ is sitting at a table.”",
              "answers": [
                "The visitor is sitting at a table."
              ],
              "context": "",
              "id": "b1_11_4_q1"
            },
            {
              "prompt": "Write the sentence using a person noun from act: “The ___ is playing a worried customer.”",
              "answers": [
                "The actor is playing a worried customer."
              ],
              "context": "",
              "id": "b1_11_4_q2"
            },
            {
              "prompt": "Write the sentence using a person noun from art: “An ___ has joined the customers.”",
              "answers": [
                "An artist has joined the customers."
              ],
              "context": "",
              "id": "b1_11_4_q3"
            },
            {
              "prompt": "Write the sentence using a person noun from drive: “The ___ is waiting outside.”",
              "answers": [
                "The driver is waiting outside."
              ],
              "context": "Imagine that someone has driven a customer to the restaurant.",
              "id": "b1_11_4_q4"
            }
          ]
        },
        {
          "title": "One family, different jobs",
          "id": "b1_11_5",
          "source": "HF",
          "start": 1000,
          "end": 1035,
          "video": "assets/b1-video/b1_11_5.mp4",
          "poster": "assets/b1-video/b1_11_5.jpg",
          "tasks": [
            {
              "prompt": "Describe his personality with an adjective from care.",
              "answers": [
                "He is careful."
              ],
              "context": "",
              "id": "b1_11_5_q1"
            },
            {
              "prompt": "Describe the way he listens. Use an adverb from care.",
              "answers": [
                "He listens carefully."
              ],
              "context": "",
              "id": "b1_11_5_q2"
            },
            {
              "prompt": "Describe the way he speaks. Use with + a noun from care.",
              "answers": [
                "He speaks with care."
              ],
              "context": "",
              "id": "b1_11_5_q3"
            },
            {
              "prompt": "Describe a person who does not take enough care. Use an adjective from care.",
              "answers": [
                "He is careless."
              ],
              "context": "",
              "id": "b1_11_5_q4"
            },
            {
              "prompt": "Describe a careless way of speaking. Use an adverb from care.",
              "answers": [
                "He speaks carelessly."
              ],
              "context": "",
              "id": "b1_11_5_q5"
            }
          ]
        }
      ]
    }
  ]
};
