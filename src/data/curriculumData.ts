import { Unit, DictionaryItem, Badge, LeaderboardUser } from '../types';

export const UNITS_DATA: Unit[] = [
  {
    id: 'unit-0',
    unitNumber: 0,
    titleEn: 'Back to School',
    titleAr: 'العودة إلى المدرسة (التحيات والأرقام)',
    themeColor: '#3B82F6', // Blue
    bgGradient: 'from-blue-500 to-indigo-600',
    badgeIcon: '🎒',
    grammarFocus: 'Greetings & Introductions (What is your name? Nice to meet you)',
    phonicsFocus: 'Numbers pronunciation (1 to 30)',
    algerianCultureTouch: 'الترحيب والتعارف بين تلاميذ المدارس الجزائرية (نجيب وكارين ومسيل)',
    textbookPages: 'صفحات 6 - 7',
    lessons: [
      {
        id: 'lesson-0-1',
        unitId: 'unit-0',
        titleEn: 'Greetings & Introductions',
        titleAr: 'التحيات والتعارف اليومي',
        description: 'تعلّم كيف تحيي أصدقاءك في مختلف أوقات اليوم',
        icon: '👋',
        xpReward: 15,
        gemReward: 5,
        exercises: [
          {
            id: 'ex-0-1-1',
            type: 'multiple_choice',
            skill: 'reading',
            promptAr: 'ما هي التحية المناسبة في الصباح الباكر؟',
            promptEn: 'Choose the right greeting for the morning:',
            audioPrompt: 'Good morning',
            targetWordOrSentence: 'Good morning',
            options: [
              { id: 'opt1', text: 'Good morning', arabicTranslation: 'صباح الخير', emoji: '🌅' },
              { id: 'opt2', text: 'Good night', arabicTranslation: 'تصبح على خير', emoji: '🌙' },
              { id: 'opt3', text: 'Good evening', arabicTranslation: 'مساء الخير', emoji: '🌆' },
            ],
            correctAnswer: 'opt1',
            explanation: 'نقول "Good morning" في الصباح، ونقول "Good afternoon" بعد الظهر، و"Good evening" في المساء.',
            mascotTip: 'رحاب تقول لك: تذكر أن الصباح المشرق يبدأ بـ Good morning!',
          },
          {
            id: 'ex-0-1-2',
            type: 'listen_and_choose',
            skill: 'listening',
            promptAr: 'استمع إلى الصوت واختر العبارة الصحيحة:',
            promptEn: 'Listen and choose what you hear:',
            audioPrompt: 'Nice to meet you',
            targetWordOrSentence: 'Nice to meet you',
            options: [
              { id: 'opt1', text: 'Nice to meet you', arabicTranslation: 'سعيد بلقائك', emoji: '🤝' },
              { id: 'opt2', text: 'Goodbye', arabicTranslation: 'مع السلامة', emoji: '👋' },
              { id: 'opt3', text: 'What is your name?', arabicTranslation: 'ما اسمك؟', emoji: '❓' },
            ],
            correctAnswer: 'opt1',
            explanation: '"Nice to meet you" تعني سعيد أو مسرور بلقائك، ويُرد عليها بـ "Nice to meet you, too!".',
          },
          {
            id: 'ex-0-1-3',
            type: 'word_reorder',
            skill: 'writing',
            promptAr: 'رتّب الكلمات لتكوين جملة التعارف الصحيحة (صفحة 6 من الكتاب):',
            promptEn: 'Reorder the words to introduce yourself:',
            audioPrompt: 'My name is Nadjib',
            targetWordOrSentence: 'My name is Nadjib',
            scrambledWords: ['is', 'name', 'Nadjib', 'My'],
            correctAnswer: ['My', 'name', 'is', 'Nadjib'],
            explanation: 'الترتيب الإنجليزي الصحيح: My name is Nadjib (اسمي نجيب).',
          },
          {
            id: 'ex-0-1-4',
            type: 'pronounce_mic',
            skill: 'speaking',
            promptAr: 'تدرّب على النطق! اضغط على الميكروفون وقل بصوت واضح:',
            promptEn: 'Click the mic and say aloud:',
            audioPrompt: 'Good afternoon',
            targetWordOrSentence: 'Good afternoon',
            correctAnswer: 'Good afternoon',
            explanation: 'ممتاز! نطق واضح وسليم لتحية بعد الظهر.',
            mascotTip: 'اضغط على رمز السلحفاة 🐢 للاستماع البطيء قبل التحدث!',
          }
        ]
      },
      {
        id: 'lesson-0-2',
        unitId: 'unit-0',
        titleEn: 'Numbers 11 to 30',
        titleAr: 'الأرقام من 11 إلى 30',
        description: 'تعلّم كتابة ونطق الأعداد بالإنجليزية بدقة',
        icon: '🔢',
        xpReward: 20,
        gemReward: 5,
        exercises: [
          {
            id: 'ex-0-2-1',
            type: 'multiple_choice',
            skill: 'reading',
            promptAr: 'ما هو الرقم المقابل لكلمة "Thirteen"؟',
            promptEn: 'Which number is "Thirteen"?',
            audioPrompt: 'Thirteen',
            targetWordOrSentence: '13',
            options: [
              { id: 'opt1', text: '13', arabicTranslation: 'ثلاثة عشر' },
              { id: 'opt2', text: '30', arabicTranslation: 'ثلاثون' },
              { id: 'opt3', text: '12', arabicTranslation: 'اثنا عشر' },
            ],
            correctAnswer: 'opt1',
            explanation: 'Thirteen هو 13، بينما Thirty هو 30، وTwelve هو 12.',
          },
          {
            id: 'ex-0-2-2',
            type: 'fill_blank',
            skill: 'writing',
            promptAr: 'أكمل كتابة العدد 20 (صفحة 7 في كتابك):',
            promptEn: 'Spell the number 20 in English:',
            audioPrompt: 'Twenty',
            targetWordOrSentence: 'twenty',
            options: [
              { id: 'opt1', text: 'twenty' },
              { id: 'opt2', text: 'twelve' },
              { id: 'opt3', text: 'twinty' },
            ],
            correctAnswer: 'opt1',
            explanation: 'يُكتب الرقم 20: twenty.',
          },
          {
            id: 'ex-0-2-3',
            type: 'sound_match',
            skill: 'phonics',
            promptAr: 'اختر العدد الصحيح: 25 بالإنجليزية هو:',
            promptEn: 'Choose the correct English word for 25:',
            audioPrompt: 'Twenty-five',
            targetWordOrSentence: 'twenty-five',
            options: [
              { id: 'opt1', text: 'twenty-five', arabicTranslation: 'خمسة وعشرون' },
              { id: 'opt2', text: 'fifteen', arabicTranslation: 'خمسة عشر' },
              { id: 'opt3', text: 'twenty-four', arabicTranslation: 'أربعة وعشرون' },
            ],
            correctAnswer: 'opt1',
            explanation: '25 = twenty-five.',
          }
        ]
      }
    ]
  },
  {
    id: 'unit-1',
    unitNumber: 1,
    titleEn: 'Family and Friends',
    titleAr: 'الوحدة الأولى: العائلة والأصدقاء',
    themeColor: '#10B981', // Emerald
    bgGradient: 'from-emerald-500 to-teal-600',
    badgeIcon: '👨‍👩‍👧‍👦',
    songTitle: 'Finger Family Song',
    songLyrics: [
      'Daddy finger, daddy finger, where are you?',
      'Here I am, here I am. How do you do?',
      'Mommy finger, mommy finger, where are you?',
      'Here I am, here I am. How do you do?'
    ],
    grammarFocus: 'Demonstrative pronouns (This is / These are), Possessive adjectives',
    phonicsFocus: 'Sounds /θ/ (three, thirty, think) vs /ð/ (this, father, mother, brother)',
    algerianCultureTouch: 'شجرة عائلة نجيب الجزائرية وأصدقاؤه من مختلف البلدان (مصر، بريطانيا، أمريكا، الصين)',
    textbookPages: 'صفحات 8 - 20',
    lessons: [
      {
        id: 'lesson-1-1',
        unitId: 'unit-1',
        titleEn: 'Family Members',
        titleAr: 'أفراد العائلة وشجرة النسب',
        description: 'التعرف على أفراد عائلة نجيب (Grandfather, Grandmother, Aunt, Uncle, Cousin)',
        icon: '🏡',
        xpReward: 20,
        gemReward: 8,
        exercises: [
          {
            id: 'ex-1-1-1',
            type: 'listen_and_choose',
            skill: 'listening',
            promptAr: 'استمع واختر فرد العائلة المناسب:',
            promptEn: 'Listen and choose the family member:',
            audioPrompt: 'My grandfather',
            targetWordOrSentence: 'grandfather',
            options: [
              { id: 'opt1', text: 'Grandfather', arabicTranslation: 'الجد', emoji: '👴' },
              { id: 'opt2', text: 'Uncle', arabicTranslation: 'العم / الخال', emoji: '👨' },
              { id: 'opt3', text: 'Brother', arabicTranslation: 'الأخ', emoji: '👦' },
            ],
            correctAnswer: 'opt1',
            explanation: 'Grandfather = الجد. وفي كتابك: Abdelmadjid is Nadjib’s grandfather.',
          },
          {
            id: 'ex-1-1-2',
            type: 'multiple_choice',
            skill: 'reading',
            promptAr: 'ماذا نسمي أخت الأم أو أخت الأب بالإنجليزية؟ (صفحة 10 في الكتاب)',
            promptEn: 'Mother’s sister or father’s sister is:',
            audioPrompt: 'Aunt',
            targetWordOrSentence: 'Aunt',
            options: [
              { id: 'opt1', text: 'Aunt', arabicTranslation: 'العمة أو الخالة', emoji: '👩' },
              { id: 'opt2', text: 'Niece', arabicTranslation: 'ابنة الأخ أو الأخت', emoji: '👧' },
              { id: 'opt3', text: 'Nephew', arabicTranslation: 'ابن الأخ أو الأخت', emoji: '👦' },
            ],
            correctAnswer: 'opt1',
            explanation: 'Mother’s sister is Aunt (خالة / عمة). في الدرس: Affef is Nadjib’s aunt.',
          },
          {
            id: 'ex-1-1-3',
            type: 'word_reorder',
            skill: 'writing',
            promptAr: 'رتّب الجملة لتقديم العائلة (صفحة 11 في الكتاب):',
            promptEn: 'Reorder the sentence:',
            audioPrompt: 'This is my grandfather',
            targetWordOrSentence: 'This is my grandfather',
            scrambledWords: ['grandfather', 'my', 'is', 'This'],
            correctAnswer: ['This', 'is', 'my', 'grandfather'],
            explanation: 'نستعمل This is للمفرد القريب: This is my grandfather.',
          },
          {
            id: 'ex-1-1-4',
            type: 'sound_match',
            skill: 'phonics',
            promptAr: 'صوتيات الكتاب: أي من الكلمات التالية تحتوي على صوت الذال /ð/ مثل "father"؟',
            promptEn: 'Which word contains the /ð/ sound as in "father"?',
            audioPrompt: 'Mother',
            targetWordOrSentence: 'Mother',
            options: [
              { id: 'opt1', text: 'Mother', phoneticNote: '/ð/ sound' },
              { id: 'opt2', text: 'Three', phoneticNote: '/θ/ sound' },
              { id: 'opt3', text: 'Thirty', phoneticNote: '/θ/ sound' },
            ],
            correctAnswer: 'opt1',
            explanation: 'كلمات صوت /ð/: father, mother, brother, this. كلمات صوت /θ/: three, thirty, think, tooth.',
          }
        ]
      },
      {
        id: 'lesson-1-2',
        unitId: 'unit-1',
        titleEn: 'Countries & Nationalities',
        titleAr: 'البلدان والجنسيات حول العالم',
        description: 'أصدقاء نجيب عبر الإنترنت: الجزائر، مصر، بريطانيا، أمريكا، الصين',
        icon: '🌍',
        xpReward: 25,
        gemReward: 10,
        exercises: [
          {
            id: 'ex-1-2-1',
            type: 'multiple_choice',
            skill: 'reading',
            promptAr: 'وفق نص الكتاب (صفحة 17): "I am from Algeria. I am..."؟',
            promptEn: 'Complete the sentence: "I am from Algeria. I am..."',
            audioPrompt: 'I am Algerian',
            targetWordOrSentence: 'Algerian',
            options: [
              { id: 'opt1', text: 'Algerian', arabicTranslation: 'جزائري 🇩🇿' },
              { id: 'opt2', text: 'Egyptian', arabicTranslation: 'مصري 🇪🇬' },
              { id: 'opt3', text: 'British', arabicTranslation: 'بريطاني 🇬🇧' },
            ],
            correctAnswer: 'opt1',
            explanation: 'البلد: Algeria، والجنسية: Algerian (جزائري).',
          },
          {
            id: 'ex-1-2-2',
            type: 'listen_and_choose',
            skill: 'listening',
            promptAr: 'استمع لجيمس من الكتاب (صفحة 17): من أي بلد يتحدث؟',
            promptEn: 'Listen to James: Where is he from?',
            audioPrompt: 'I am from Britain. I am British.',
            targetWordOrSentence: 'Britain',
            options: [
              { id: 'opt1', text: 'Britain (British)', emoji: '🇬🇧' },
              { id: 'opt2', text: 'China (Chinese)', emoji: '🇨🇳' },
              { id: 'opt3', text: 'The USA (American)', emoji: '🇺🇸' },
            ],
            correctAnswer: 'opt1',
            explanation: 'جيمس من بريطانيا (Britain) وهو British.',
          },
          {
            id: 'ex-1-2-3',
            type: 'pronounce_mic',
            skill: 'speaking',
            promptAr: 'تحدث بفخر! قل بالإنجليزية: "I am Algerian"',
            promptEn: 'Pronounce the sentence aloud:',
            audioPrompt: 'I am Algerian',
            targetWordOrSentence: 'I am Algerian',
            correctAnswer: 'I am Algerian',
            explanation: 'أحسنت صنعاً! تحيا الجزائر وكل أطفالها الأذكياء!',
          }
        ]
      }
    ]
  },
  {
    id: 'unit-2',
    unitNumber: 2,
    titleEn: 'Occupations and Jobs',
    titleAr: 'الوحدة الثانية: المهن والوظائف',
    themeColor: '#F59E0B', // Amber
    bgGradient: 'from-amber-500 to-orange-600',
    badgeIcon: '👷',
    songTitle: 'What is Your Job?',
    songLyrics: [
      'What’s your job? I’m a nurse.',
      'I’m a vet. What’s your job?',
      'I’m a farmer. I’m a teacher.',
      'What’s your job? I’m a doctor.'
    ],
    grammarFocus: 'Asking about jobs: "What’s your job? / What’s your father’s job? He is a..."',
    phonicsFocus: 'Sound /ə/ in job endings: teacher, farmer, carpenter, painter, driver',
    algerianCultureTouch: 'مهن عائلة نجيب وأدواتها: الطبيبة، النجار، الفلاح، المعلم في البيئة الجزائرية',
    textbookPages: 'صفحات 21 - 33',
    lessons: [
      {
        id: 'lesson-2-1',
        unitId: 'unit-2',
        titleEn: 'Jobs & Professions',
        titleAr: 'أسماء المهن وأماكن العمل',
        description: 'تعلّم مهن Teacher, Doctor, Policeman, Nurse, Carpenter, Cook',
        icon: '🩺',
        xpReward: 20,
        gemReward: 8,
        exercises: [
          {
            id: 'ex-2-1-1',
            type: 'multiple_choice',
            skill: 'reading',
            promptAr: 'الشخص الذي يعمل في العيادة ويقدم الحقن ومساعدة المرضى هو: (صفحة 32)',
            promptEn: 'She works in a clinic and gives injections. She is a:',
            audioPrompt: 'Nurse',
            targetWordOrSentence: 'nurse',
            options: [
              { id: 'opt1', text: 'Nurse', arabicTranslation: 'ممرضة', emoji: '👩‍⚕️' },
              { id: 'opt2', text: 'Teacher', arabicTranslation: 'معلم', emoji: '👨‍🏫' },
              { id: 'opt3', text: 'Policeman', arabicTranslation: 'شرطي', emoji: '👮‍♂️' },
            ],
            correctAnswer: 'opt1',
            explanation: 'Nacima is Mustapha’s mother. She is a nurse (ممرضة) and works in a clinic.',
          },
          {
            id: 'ex-2-1-2',
            type: 'listen_and_choose',
            skill: 'listening',
            promptAr: 'استمع واختر الأداة المناسبة لمهنة الطبيب (صفحة 28 في كتابك):',
            promptEn: 'Listen and choose the doctor’s tool:',
            audioPrompt: 'Stethoscope',
            targetWordOrSentence: 'stethoscope',
            options: [
              { id: 'opt1', text: 'Stethoscope', arabicTranslation: 'سماعة الطبيب', emoji: '🩺' },
              { id: 'opt2', text: 'Saw', arabicTranslation: 'منشار النجار', emoji: '🪚' },
              { id: 'opt3', text: 'Brush', arabicTranslation: 'فرشاة الصباغ', emoji: '🖌️' },
            ],
            correctAnswer: 'opt1',
            explanation: 'Stethoscope = سماعة الطبيب. والمنشار Saw هو أداة النجار Carpenter.',
          },
          {
            id: 'ex-2-1-3',
            type: 'word_reorder',
            skill: 'writing',
            promptAr: 'رتّب السؤال للسؤال عن المهنة (صفحة 27 في كتابك):',
            promptEn: 'Reorder to form the question:',
            audioPrompt: 'What is your father’s job?',
            targetWordOrSentence: 'What is your father’s job?',
            scrambledWords: ['job', 'is', 'What', 'your', 'father’s'],
            correctAnswer: ['What', 'is', 'your', 'father’s', 'job'],
            explanation: 'السؤال عن المهنة: What is your father’s job? (ما هي مهنة والدك؟).',
          },
          {
            id: 'ex-2-1-4',
            type: 'pronounce_mic',
            skill: 'speaking',
            promptAr: 'تحدّث بالميكروفون وقل: "My father is a teacher"',
            promptEn: 'Say aloud:',
            audioPrompt: 'My father is a teacher',
            targetWordOrSentence: 'My father is a teacher',
            correctAnswer: 'My father is a teacher',
            explanation: 'أداء رائع في النطق! كلمة teacher تنتهي بصوت /ə/ الهادئ.',
          }
        ]
      }
    ]
  },
  {
    id: 'unit-3',
    unitNumber: 3,
    titleEn: 'School',
    titleAr: 'الوحدة الثالثة: المدرسة',
    themeColor: '#8B5CF6', // Violet
    bgGradient: 'from-purple-500 to-indigo-600',
    badgeIcon: '🏫',
    songTitle: 'I Love My School',
    songLyrics: [
      'I love my school. It’s a big knowledge pool.',
      'Pool, pool, pool. I love my school.',
      'Here I meet my friends. So cool. Cool, cool, cool.',
      'We play and follow every rule.'
    ],
    grammarFocus: 'Prepositions of place (in front of, behind, on the right of, on the left of)',
    phonicsFocus: 'Sounds /uː/ in room, school vs /ʊ/ in book, look, good, put',
    algerianCultureTouch: 'مدرسة الأمير عبد القادر (Al Amir Abdelkader) والمواد المدرسية الجزائرية',
    textbookPages: 'صفحات 34 - 47',
    lessons: [
      {
        id: 'lesson-3-1',
        unitId: 'unit-3',
        titleEn: 'School Facilities & Directions',
        titleAr: 'مرافق المدرسة والاتجاهات',
        description: 'Canteen, Library, Headmaster’s office, Courtyard, Computer room',
        icon: '📚',
        xpReward: 20,
        gemReward: 8,
        exercises: [
          {
            id: 'ex-3-1-1',
            type: 'multiple_choice',
            skill: 'reading',
            promptAr: 'أين نجد الكتب للمطالعة في المدرسة؟ (صفحة 37)',
            promptEn: 'Where do we read and borrow books at school?',
            audioPrompt: 'Library',
            targetWordOrSentence: 'library',
            options: [
              { id: 'opt1', text: 'Library', arabicTranslation: 'المكتبة 📖', emoji: '📖' },
              { id: 'opt2', text: 'Canteen', arabicTranslation: 'المطعم المدرسي 🍽️', emoji: '🍽️' },
              { id: 'opt3', text: 'Courtyard', arabicTranslation: 'ساحة المدرسة 🏃', emoji: '🏃' },
            ],
            correctAnswer: 'opt1',
            explanation: 'المكتبة المدرسية هي Library، والمطعم هو Canteen، والساحة Courtyard.',
          },
          {
            id: 'ex-3-1-2',
            type: 'sound_match',
            skill: 'phonics',
            promptAr: 'صوتيات الكتاب (صفحة 43): أي كلمة تحتوي على نفس صوت /ʊ/ مثل كلمة "book"؟',
            promptEn: 'Which word has the same short sound as "book"?',
            audioPrompt: 'Look',
            targetWordOrSentence: 'look',
            options: [
              { id: 'opt1', text: 'look', phoneticNote: 'Short /ʊ/ like book' },
              { id: 'opt2', text: 'room', phoneticNote: 'Long /uː/' },
              { id: 'opt3', text: 'school', phoneticNote: 'Long /uː/' },
            ],
            correctAnswer: 'opt1',
            explanation: 'الكلمات التي تملك صوت book القصير: look, good, put, bull, sugar.',
          },
          {
            id: 'ex-3-1-3',
            type: 'word_reorder',
            skill: 'writing',
            promptAr: 'رتّب الجملة من الكتاب (صفحة 39):',
            promptEn: 'Reorder the sentence:',
            audioPrompt: 'There are many classrooms',
            targetWordOrSentence: 'There are many classrooms',
            scrambledWords: ['classrooms', 'There', 'many', 'are'],
            correctAnswer: ['There', 'are', 'many', 'classrooms'],
            explanation: 'There are many classrooms (يوجد العديد من حجرات الدراسة).',
          }
        ]
      }
    ]
  },
  {
    id: 'unit-4',
    unitNumber: 4,
    titleEn: 'Health',
    titleAr: 'الوحدة الرابعة: الصحة والعافية',
    themeColor: '#EF4444', // Red
    bgGradient: 'from-rose-500 to-red-600',
    badgeIcon: '🍎',
    songTitle: 'Sick Baby Song',
    songLyrics: [
      'My little baby, not feeling well?',
      'You have a fever, mommy can tell.',
      'Rest little baby, I’ll care for you.',
      'You’ll get well soon, I’ll make sure you do.'
    ],
    grammarFocus: 'Expressing illness: "I have a headache / stomachache / fever"',
    phonicsFocus: 'Sound /iː/ in sneeze, treatment, wheelchair, feel, eat',
    algerianCultureTouch: 'النصائح الصحية والزيارة الطبية لنجيب عند المرض',
    textbookPages: 'صفحات 48 - 54',
    lessons: [
      {
        id: 'lesson-4-1',
        unitId: 'unit-4',
        titleEn: 'Illnesses and Symptoms',
        titleAr: 'الأمراض والأعراض والوقاية',
        description: 'Headache, Toothache, Stomachache, Fever, Cough, Runny nose',
        icon: '🤒',
        xpReward: 20,
        gemReward: 8,
        exercises: [
          {
            id: 'ex-4-1-1',
            type: 'listen_and_choose',
            skill: 'listening',
            promptAr: 'استمع للأعراض التي يشعر بها نجيب واختر العبارة المناسبة (صفحة 51):',
            promptEn: 'Listen to the health problem:',
            audioPrompt: 'I have a headache and a fever',
            targetWordOrSentence: 'headache and a fever',
            options: [
              { id: 'opt1', text: 'I have a headache and a fever', arabicTranslation: 'عندي صداع وحمى', emoji: '🤕' },
              { id: 'opt2', text: 'I have a toothache', arabicTranslation: 'عندي ألم في الأسنان', emoji: '🦷' },
              { id: 'opt3', text: 'I have an earache', arabicTranslation: 'عندي ألم في الأذن', emoji: '👂' },
            ],
            correctAnswer: 'opt1',
            explanation: 'headache = صداع بالرأس، fever = حمى وارتفاع حرارة.',
          },
          {
            id: 'ex-4-1-2',
            type: 'multiple_choice',
            skill: 'reading',
            promptAr: 'عندما يؤلمك بطنك، تقول بالإنجليزية: (صفحة 49)',
            promptEn: 'When your stomach hurts, you say:',
            audioPrompt: 'I have a stomachache',
            targetWordOrSentence: 'stomachache',
            options: [
              { id: 'opt1', text: 'I have a stomachache', arabicTranslation: 'عندي وجع بطن' },
              { id: 'opt2', text: 'I have a backache', arabicTranslation: 'عندي وجع ظهر' },
              { id: 'opt3', text: 'I have a sore throat', arabicTranslation: 'عندي التهاب حلق' },
            ],
            correctAnswer: 'opt1',
            explanation: 'stomach (معدة) + ache (ألم) = stomachache.',
          },
          {
            id: 'ex-4-1-3',
            type: 'pronounce_mic',
            skill: 'speaking',
            promptAr: 'قل نصيحة الطبيبة لنجيب (صفحة 51): "Drink a lot of water"',
            promptEn: 'Say the doctor’s advice aloud:',
            audioPrompt: 'Drink a lot of water',
            targetWordOrSentence: 'Drink a lot of water',
            correctAnswer: 'Drink a lot of water',
            explanation: 'نصيحة ذهبية! شرب الماء والراحة يساعدان على الشفاء السريع.',
          }
        ]
      }
    ]
  },
  {
    id: 'unit-5',
    unitNumber: 5,
    titleEn: 'Food',
    titleAr: 'الوحدة الخامسة: الأغذية والأطعمة',
    themeColor: '#10B981', // Green
    bgGradient: 'from-green-500 to-emerald-600',
    badgeIcon: '🥗',
    songTitle: 'Healthy Food Song',
    songLyrics: [
      'Healthy, healthy, healthy food. Helps my body and my mood.',
      'Fruits are good. Yummy, yummy, yummy.',
      'Veggies are good. Yummy, yummy, yummy.',
      'Junk food is not good!'
    ],
    grammarFocus: 'Classifying Food: Healthy vs Unhealthy, Countable & Uncountable basics',
    phonicsFocus: 'Sounds /tʃ/ (chocolate, cheese, chicken, chips) vs /ʃ/ (fish, sheep, dish, shark)',
    algerianCultureTouch: 'الأكلات التقليدية الجزائرية في الكتاب: الكسكسي (Couscous) والمحاجب (M’hajeb) والتمور (Dates)',
    textbookPages: 'صفحات 55 - 62',
    lessons: [
      {
        id: 'lesson-5-1',
        unitId: 'unit-5',
        titleEn: 'Healthy & Algerian Food',
        titleAr: 'الغذاء الصحي والأطباق الجزائرية',
        description: 'Couscous, M’hajeb, Fruits, Vegetables, Pizza, Chips, Healthy vs Unhealthy',
        icon: '🍲',
        xpReward: 20,
        gemReward: 8,
        exercises: [
          {
            id: 'ex-5-1-1',
            type: 'multiple_choice',
            skill: 'reading',
            promptAr: 'وفق نص الكتاب (صفحة 61): ماذا تحضر الأم يوم الجمعة؟',
            promptEn: 'What does mother prepare on Friday?',
            audioPrompt: 'My mother prepares couscous with vegetables and meat',
            targetWordOrSentence: 'couscous',
            options: [
              { id: 'opt1', text: 'Couscous with vegetables and meat', arabicTranslation: 'كسكسي بالخضر واللحم', emoji: '🍲' },
              { id: 'opt2', text: 'Pizza and chips', arabicTranslation: 'بيتزا وشيبس', emoji: '🍕' },
              { id: 'opt3', text: 'Ice cream and candy', arabicTranslation: 'مثلجات وحلوى', emoji: '🍦' },
            ],
            correctAnswer: 'opt1',
            explanation: 'في صفحة 61: "Today is Friday. My mother prepares couscous with vegetables and meat. It is healthy."',
          },
          {
            id: 'ex-5-1-2',
            type: 'sound_match',
            skill: 'phonics',
            promptAr: 'صوتيات الكتاب (صفحة 60): أي كلمة تنطق بصوت الشين /ʃ/ مثل "fish"؟',
            promptEn: 'Which word contains the /ʃ/ sound as in "fish"?',
            audioPrompt: 'Dish',
            targetWordOrSentence: 'dish',
            options: [
              { id: 'opt1', text: 'dish', phoneticNote: '/ʃ/ sound like fish' },
              { id: 'opt2', text: 'chips', phoneticNote: '/tʃ/ sound' },
              { id: 'opt3', text: 'chocolate', phoneticNote: '/tʃ/ sound' },
            ],
            correctAnswer: 'opt1',
            explanation: 'صوت /ʃ/: fish, dish, sheep, shark. صوت /tʃ/: chips, cheese, chicken, chocolate.',
          },
          {
            id: 'ex-5-1-3',
            type: 'word_reorder',
            skill: 'writing',
            promptAr: 'رتّب الجملة الصحية المفيدة (صفحة 61 في الكتاب):',
            promptEn: 'Reorder to form the healthy sentence:',
            audioPrompt: 'I eat healthy food',
            targetWordOrSentence: 'I eat healthy food',
            scrambledWords: ['food', 'healthy', 'I', 'eat'],
            correctAnswer: ['I', 'eat', 'healthy', 'food'],
            explanation: 'I eat healthy food = أنا أتناول طعاماً صحياً ومغذياً.',
          }
        ]
      }
    ]
  },
  {
    id: 'unit-6',
    unitNumber: 6,
    titleEn: 'Games',
    titleAr: 'الوحدة السادسة: الألعاب والرياضة',
    themeColor: '#EC4899', // Pink
    bgGradient: 'from-pink-500 to-rose-600',
    badgeIcon: '⚽',
    songTitle: 'Hide and Seek Song',
    songLyrics: [
      'Hide and seek, hide and seek.',
      'When you’re counting, don’t you peek.',
      'Find a spot, don’t make a sound.',
      'Find a spot, don’t let you found.'
    ],
    grammarFocus: 'Present Continuous (is / are + verb-ing: "We are playing football")',
    phonicsFocus: 'Sound /ʊ/ in football, sudoku, sugar, bull, book, hook',
    algerianCultureTouch: 'ألعاب ساحة المدرسة الجزائرية: الحجلة (Hopscotch) ولعبة الغميضة (Hide and seek) وكرة القدم',
    textbookPages: 'صفحات 63 - 69',
    lessons: [
      {
        id: 'lesson-6-1',
        unitId: 'unit-6',
        titleEn: 'Sports & Playground Games',
        titleAr: 'الرياضات وألعاب الساحة الترفيهية',
        description: 'Football, Hopscotch, Seesaw, Swing, Video games, Chess, Running',
        icon: '🏃‍♂️',
        xpReward: 20,
        gemReward: 8,
        exercises: [
          {
            id: 'ex-6-1-1',
            type: 'listen_and_choose',
            skill: 'listening',
            promptAr: 'استمع واختر اللعبة التي يلعبها نجيب ومسيل (صفحة 65):',
            promptEn: 'Listen and identify the game:',
            audioPrompt: 'Nadjib is jumping on a hopscotch',
            targetWordOrSentence: 'hopscotch',
            options: [
              { id: 'opt1', text: 'Hopscotch (الحجلة)', emoji: '🔢' },
              { id: 'opt2', text: 'Seesaw (الأرجوحة المتوازنة)', emoji: '⚖️' },
              { id: 'opt3', text: 'Video game (ألعاب الفيديو)', emoji: '🎮' },
            ],
            correctAnswer: 'opt1',
            explanation: 'Hopscotch هي لعبة الحجلة الشهيرة في المدارس الجزائرية.',
          },
          {
            id: 'ex-6-1-2',
            type: 'word_reorder',
            skill: 'writing',
            promptAr: 'رتّب الجملة في زمن الحاضر المستمر (صفحة 68 في كتابك):',
            promptEn: 'Reorder the sentence:',
            audioPrompt: 'Nadjib is playing football',
            targetWordOrSentence: 'Nadjib is playing football',
            scrambledWords: ['playing', 'is', 'football', 'Nadjib'],
            correctAnswer: ['Nadjib', 'is', 'playing', 'football'],
            explanation: 'في المضارع المستمر: Subject + is/are + verb-ing: Nadjib is playing football.',
          },
          {
            id: 'ex-6-1-3',
            type: 'pronounce_mic',
            skill: 'speaking',
            promptAr: 'تحدث بصوت حماسي: "We are playing football"',
            promptEn: 'Say aloud:',
            audioPrompt: 'We are playing football',
            targetWordOrSentence: 'We are playing football',
            correctAnswer: 'We are playing football',
            explanation: 'هدف رائع! نطق إنجليزي ممتاز.',
          }
        ]
      }
    ]
  },
  {
    id: 'unit-7',
    unitNumber: 7,
    titleEn: 'Celebrations',
    titleAr: 'الوحدة السابعة: الاحتفالات والمناسبات',
    themeColor: '#6366F1', // Indigo
    bgGradient: 'from-indigo-500 to-purple-600',
    badgeIcon: '🎉',
    songTitle: 'Happy Birthday Song',
    songLyrics: [
      'Happy birthday to you! Happy birthday to you!',
      'Happy birthday dear one. Happy birthday to you!',
      'From good friends and true, from old friends and new.',
      'May good luck go with you, and happiness too!'
    ],
    grammarFocus: 'National Days vs Religious Feasts, Dates and Celebrations',
    phonicsFocus: 'Sound /iː/ in see, sweets, greeting, seesaw, meal, sea',
    algerianCultureTouch: 'الأعياد الدينية والوطنية الجزائرية: عيد الفطر، عيد الأضحى، المولد النبوي، عيد الاستقلال، عيد الثورة، يوم الشهيد (18 فيفري)، ورأس السنة الأمازيغية (Yennayer)',
    textbookPages: 'صفحات 70 - 77',
    lessons: [
      {
        id: 'lesson-7-1',
        unitId: 'unit-7',
        titleEn: 'Algerian & National Celebrations',
        titleAr: 'المناسبات والأعياد الوطنية والدينية',
        description: 'Independence Day, Revolution Day, Eid El Fitr, Martyr’s Day, Yennayer',
        icon: '🇩🇿',
        xpReward: 25,
        gemReward: 10,
        exercises: [
          {
            id: 'ex-7-1-1',
            type: 'multiple_choice',
            skill: 'reading',
            promptAr: 'وفق جدول الكتاب (صفحة 72): ما هو التصنيف الصحيح لـ "Independence Day"؟',
            promptEn: 'How is "Independence Day" classified?',
            audioPrompt: 'National Day',
            targetWordOrSentence: 'National Day',
            options: [
              { id: 'opt1', text: 'National Day (عيد وطني)', emoji: '🇩🇿' },
              { id: 'opt2', text: 'Religious Feast (عيد ديني)', emoji: '🕌' },
              { id: 'opt3', text: 'Sport Game (لعبة رياضية)', emoji: '🏅' },
            ],
            correctAnswer: 'opt1',
            explanation: 'الأعياد الوطنية (National Days): Independence Day, Revolution Day. الأعياد الدينية (Religious Feasts): Eid El Fitr, Eid Al Adha, Al Mawlid.',
          },
          {
            id: 'ex-7-1-2',
            type: 'listen_and_choose',
            skill: 'listening',
            promptAr: 'استمع لنص نجيب في المدرسة (صفحة 73 في الكتاب):',
            promptEn: 'Listen to Nadjib’s speech on February 18th:',
            audioPrompt: 'We are celebrating Martyr’s Day at school. I love Algeria!',
            targetWordOrSentence: 'Martyr’s Day',
            options: [
              { id: 'opt1', text: 'Martyr’s Day (يوم الشهيد - 18 فيفري)', emoji: '🕊️' },
              { id: 'opt2', text: 'Children’s Day (عيد الطفولة)', emoji: '🎈' },
              { id: 'opt3', text: 'Mother’s Day (عيد الأم)', emoji: '💐' },
            ],
            correctAnswer: 'opt1',
            explanation: 'يوم 18 فيفري هو يوم الشهيد (Martyr’s Day)، وفيه ينشد التلاميذ النشيد الوطني الجزائري.',
          },
          {
            id: 'ex-7-1-3',
            type: 'word_reorder',
            skill: 'writing',
            promptAr: 'رتّب الكلمات لنطق جملة نجيب الوطنية (صفحة 73):',
            promptEn: 'Reorder the sentence:',
            audioPrompt: 'We are honouring the national anthem',
            targetWordOrSentence: 'We are honouring the national anthem',
            scrambledWords: ['honouring', 'We', 'anthem', 'the', 'national', 'are'],
            correctAnswer: ['We', 'are', 'honouring', 'the', 'national', 'anthem'],
            explanation: 'We are honouring the national anthem = نحن نؤدي ونكرّم النشيد الوطني (قسماً).',
          }
        ]
      }
    ]
  },
  {
    id: 'unit-8',
    unitNumber: 8,
    titleEn: 'Animals',
    titleAr: 'الوحدة الثامنة: الحيوانات',
    themeColor: '#059669', // Dark Emerald
    bgGradient: 'from-emerald-600 to-green-700',
    badgeIcon: '🦁',
    songTitle: 'Baa Baa Black Sheep',
    songLyrics: [
      'Baa, baa, black sheep, have you any wool?',
      'Yes, sir, yes, sir, three bags full.',
      'One for the master, and one for the dame,',
      'And one for the little boy who lives down the lane.'
    ],
    grammarFocus: 'Demonstratives: This / That / These / Those & Animal species and babies',
    phonicsFocus: 'Sounds /ɜː/ in bird, girl, circus, turkey, world, hurt, journey',
    algerianCultureTouch: 'مزرعة الجد محمد في الريف الجزائري، وحيوانات حديقة التجارب بالحامة (Algiers Zoo)',
    textbookPages: 'صفحات 78 - 94',
    lessons: [
      {
        id: 'lesson-8-1',
        unitId: 'unit-8',
        titleEn: 'Farm Animals and Their Babies',
        titleAr: 'حيوانات المزرعة وصغارها',
        description: 'Cow & calf, Horse & foal, Sheep & lamb, Hen & chick, Duck & duckling',
        icon: '🐮',
        xpReward: 25,
        gemReward: 10,
        exercises: [
          {
            id: 'ex-8-1-1',
            type: 'multiple_choice',
            skill: 'reading',
            promptAr: 'ما اسم صغير الحصان بالإنجليزية؟ (صفحة 82 في الكتاب)',
            promptEn: 'What is a baby horse called?',
            audioPrompt: 'Foal',
            targetWordOrSentence: 'foal',
            options: [
              { id: 'opt1', text: 'Foal (مهر)', emoji: '🐴' },
              { id: 'opt2', text: 'Calf (عجل)', emoji: '🐮' },
              { id: 'opt3', text: 'Lamb (حمل)', emoji: '🐑' },
            ],
            correctAnswer: 'opt1',
            explanation: 'Horse baby = Foal، Cow baby = Calf، Sheep baby = Lamb، Hen baby = Chick.',
          },
          {
            id: 'ex-8-1-2',
            type: 'sound_match',
            skill: 'phonics',
            promptAr: 'صوتيات الكتاب (صفحة 91): أي كلمة تحتوي على نفس صوت /ɜː/ مثل "bird"؟',
            promptEn: 'Which word has the same sound as "bird"?',
            audioPrompt: 'Girl',
            targetWordOrSentence: 'girl',
            options: [
              { id: 'opt1', text: 'girl', phoneticNote: '/ɜː/ sound like bird' },
              { id: 'opt2', text: 'fox', phoneticNote: '/ɒ/ sound' },
              { id: 'opt3', text: 'kangaroo', phoneticNote: '/uː/ sound' },
            ],
            correctAnswer: 'opt1',
            explanation: 'كلمات صوت /ɜː/: bird, girl, burn, circus, turkey, world, hurt.',
          },
          {
            id: 'ex-8-1-3',
            type: 'fill_blank',
            skill: 'writing',
            promptAr: 'اختر اسم الجمع القريب (صفحة 83 في كتابك): "... are four chicks around the hen"',
            promptEn: 'Choose "This" or "These":',
            audioPrompt: 'These are four chicks',
            targetWordOrSentence: 'These',
            options: [
              { id: 'opt1', text: 'These' },
              { id: 'opt2', text: 'This' },
              { id: 'opt3', text: 'That' },
            ],
            correctAnswer: 'opt1',
            explanation: 'نستعمل These لجمع القريب (هؤلاء الكتاكيت)، وThis للمفرد القريب.',
          },
          {
            id: 'ex-8-1-4',
            type: 'pronounce_mic',
            skill: 'speaking',
            promptAr: 'قل جملة ختام الكتاب (صفحة 95): "I love Algeria and I like English"',
            promptEn: 'Say aloud:',
            audioPrompt: 'I love Algeria and I like English',
            targetWordOrSentence: 'I love Algeria and I like English',
            correctAnswer: 'I love Algeria and I like English',
            explanation: 'أنت بطل حقيقي! أكملت رحلة كتاب السنة الرابعة ابتدائي بنجاح باهر!',
          }
        ]
      }
    ]
  }
];

// Bilingual Dictionary from Page 96 of "My Book of English 4PS"
export const BILINGUAL_DICTIONARY: DictionaryItem[] = [
  { id: 'dict-1', unitNumber: 1, english: 'City', arabic: 'مَدِينَة', category: 'General', emoji: '🏙️' },
  { id: 'dict-2', unitNumber: 1, english: 'Cousin', arabic: 'ابْنُ العَمّ / ابْنُ الخَال', category: 'Family', emoji: '👦' },
  { id: 'dict-3', unitNumber: 1, english: 'Flag', arabic: 'عَلَم', category: 'Country', emoji: '🇩🇿' },
  { id: 'dict-4', unitNumber: 1, english: 'Nationality', arabic: 'جِنْسِيَّة', category: 'Country', emoji: '🌍' },
  { id: 'dict-5', unitNumber: 1, english: 'Nephew', arabic: 'ابْنُ الأَخ / ابْنُ الأُخْت', category: 'Family', emoji: '🧒' },
  { id: 'dict-6', unitNumber: 1, english: 'Niece', arabic: 'بِنْتُ الأَخ / بِنْتُ الأُخْت', category: 'Family', emoji: '👧' },
  
  { id: 'dict-7', unitNumber: 2, english: 'Clinic', arabic: 'عِيَادَة', category: 'Jobs', emoji: '🏥' },
  { id: 'dict-8', unitNumber: 2, english: 'Delicious', arabic: 'لَذِيذ', category: 'Food', emoji: '😋' },
  { id: 'dict-9', unitNumber: 2, english: 'Farm', arabic: 'مَزْرَعَة', category: 'Places', emoji: '🚜' },
  { id: 'dict-10', unitNumber: 2, english: 'Fireman', arabic: 'رَجُلُ إِطْفَاء', category: 'Jobs', emoji: '🧑‍🚒' },
  { id: 'dict-11', unitNumber: 2, english: 'Housewife', arabic: 'رَبَّةُ بَيْت', category: 'Jobs', emoji: '👩' },
  { id: 'dict-12', unitNumber: 2, english: 'Job / Occupation', arabic: 'مِهْنَة / وَظِيفَة', category: 'Jobs', emoji: '💼' },
  { id: 'dict-13', unitNumber: 2, english: 'Raise animals', arabic: 'يُرَبِّي الحَيَوَانَات', category: 'Actions', emoji: '🐑' },
  { id: 'dict-14', unitNumber: 2, english: 'Restaurant', arabic: 'مَطْعَم', category: 'Places', emoji: '🍽️' },
  { id: 'dict-15', unitNumber: 2, english: 'Stethoscope', arabic: 'سَمَّاعَةُ الطَّبِيب', category: 'Tools', emoji: '🩺' },
  { id: 'dict-16', unitNumber: 2, english: 'Syringe', arabic: 'حُقْنَة', category: 'Tools', emoji: '💉' },
  { id: 'dict-17', unitNumber: 2, english: 'Tailor', arabic: 'خَيَّاط', category: 'Jobs', emoji: '🧵' },
  { id: 'dict-18', unitNumber: 2, english: 'Tool', arabic: 'أَدَاة', category: 'Tools', emoji: '🔧' },
  { id: 'dict-19', unitNumber: 2, english: 'Workshop', arabic: 'وَرْشَةُ عَمَل', category: 'Places', emoji: '🔨' },

  { id: 'dict-20', unitNumber: 3, english: 'Canteen', arabic: 'مَطْعَمٌ مَدْرَسِيّ', category: 'School', emoji: '🍲' },
  { id: 'dict-21', unitNumber: 3, english: 'Computer room', arabic: 'غُرْفَةُ الحَاسُوب', category: 'School', emoji: '💻' },
  { id: 'dict-22', unitNumber: 3, english: 'Courtyard', arabic: 'فِنَاء / سَاحَة', category: 'School', emoji: '🏃' },
  { id: 'dict-23', unitNumber: 3, english: 'Library', arabic: 'مَكْتَبَة', category: 'School', emoji: '📚' },

  { id: 'dict-24', unitNumber: 4, english: 'Cough', arabic: 'سُعَال', category: 'Health', emoji: '😷' },
  { id: 'dict-25', unitNumber: 4, english: 'Feel', arabic: 'يَشْعُر', category: 'Health', emoji: '💓' },
  { id: 'dict-26', unitNumber: 4, english: 'Fever', arabic: 'حُمَّى', category: 'Health', emoji: '🌡️' },
  { id: 'dict-27', unitNumber: 4, english: 'Health', arabic: 'صِحَّة', category: 'Health', emoji: '💪' },
  { id: 'dict-28', unitNumber: 4, english: 'Illness', arabic: 'مَرَض / عِلَّة', category: 'Health', emoji: '🤒' },
  { id: 'dict-29', unitNumber: 4, english: 'Toothache', arabic: 'أَلَمُ الأَسْنَان', category: 'Health', emoji: '🦷' },

  { id: 'dict-30', unitNumber: 5, english: 'Dairy', arabic: 'أَلْبَان', category: 'Food', emoji: '🥛' },
  { id: 'dict-31', unitNumber: 5, english: 'Fruits', arabic: 'فَوَاكِه', category: 'Food', emoji: '🍇' },
  { id: 'dict-32', unitNumber: 5, english: 'Healthy', arabic: 'صِحِّيّ', category: 'Food', emoji: '🥗' },
  { id: 'dict-33', unitNumber: 5, english: 'Unhealthy', arabic: 'غَيْرُ صِحِّيّ', category: 'Food', emoji: '🍟' },
  { id: 'dict-34', unitNumber: 5, english: 'Vegetables', arabic: 'خُضَر', category: 'Food', emoji: '🥕' },

  { id: 'dict-35', unitNumber: 6, english: 'Games', arabic: 'أَلْعَاب', category: 'Sports', emoji: '🎮' },
  { id: 'dict-36', unitNumber: 6, english: 'Gym', arabic: 'نَادٍ رِيَاضِيّ', category: 'Sports', emoji: '🏋️' },
  { id: 'dict-37', unitNumber: 6, english: 'Hide and seek', arabic: 'الغُمَّيْضَة', category: 'Sports', emoji: '🙈' },
  { id: 'dict-38', unitNumber: 6, english: 'Play', arabic: 'يَلْعَب', category: 'Actions', emoji: '⚽' },

  { id: 'dict-39', unitNumber: 7, english: 'Celebrations', arabic: 'احْتِفَالَات', category: 'Culture', emoji: '🎉' },
  { id: 'dict-40', unitNumber: 7, english: 'Eat', arabic: 'يَأْكُل', category: 'Actions', emoji: '🍽️' },
  { id: 'dict-41', unitNumber: 7, english: 'Independence Day', arabic: 'عِيدُ الاسْتِقْلَال (5 جويلية)', category: 'Culture', emoji: '🇩🇿' },
  { id: 'dict-42', unitNumber: 7, english: 'Revolution Day', arabic: 'عِيدُ الثَّوْرَة (1 نوفمبر)', category: 'Culture', emoji: '🕯️' },

  { id: 'dict-43', unitNumber: 8, english: 'Barn', arabic: 'إِسْطَبْل', category: 'Animals', emoji: '🏚️' },
  { id: 'dict-44', unitNumber: 8, english: 'Foal', arabic: 'مُهْر (صغير الحصان)', category: 'Animals', emoji: '🐎' },
  { id: 'dict-45', unitNumber: 8, english: 'Grass', arabic: 'عُشْب', category: 'Nature', emoji: '🌿' },

  // Algerian Cities from Textbook
  { id: 'dict-city-1', unitNumber: 0, english: 'Algiers', arabic: 'الجَزَائِر العَاصِمَة (مقام الشهيد)', category: 'Cities', emoji: '🏛️' },
  { id: 'dict-city-2', unitNumber: 1, english: 'Oran', arabic: 'وَهْرَان (الباهية وسانتا كروز)', category: 'Cities', emoji: '🏰' },
  { id: 'dict-city-3', unitNumber: 1, english: 'Constantine', arabic: 'قَسَنْطِينَة (مدينة الجسور المعلقة)', category: 'Cities', emoji: '🌉' },
  { id: 'dict-city-4', unitNumber: 2, english: 'Ghardaia', arabic: 'غَرْدَايَة (قصور وادي ميزاب)', category: 'Cities', emoji: '🕌' },
  { id: 'dict-city-5', unitNumber: 5, english: 'Biskra', arabic: 'بِسْكِرَة (عروس الزيبان وتمور دقلة نور)', category: 'Cities', emoji: '🌴' },
  { id: 'dict-city-6', unitNumber: 2, english: 'Batna', arabic: 'بَاتْنَة (الأوراس وتيمقاد الأثرية)', category: 'Cities', emoji: '🏛️' },
  { id: 'dict-city-7', unitNumber: 7, english: 'Tlemcen', arabic: 'تِلِمْسَان (صومعة المنصورة)', category: 'Cities', emoji: '👑' },
  { id: 'dict-city-8', unitNumber: 3, english: 'Annaba', arabic: 'عَنَّابَة (بونة وسرايدي)', category: 'Cities', emoji: '⛵' },
  { id: 'dict-city-9', unitNumber: 8, english: 'Tamanrasset', arabic: 'تَمَنْرَاسَت (الهقار والطاسيلي)', category: 'Cities', emoji: '🏜️' },
  { id: 'dict-city-10', unitNumber: 4, english: 'Setif', arabic: 'سَطِيف (عين الفوارة وجميلة)', category: 'Cities', emoji: '⛲' },
  { id: 'dict-city-11', unitNumber: 5, english: 'Blida', arabic: 'البُلَيْدَة (مدينة الورود وبرتقال المتيجة)', category: 'Cities', emoji: '🍊' },
  { id: 'dict-city-12', unitNumber: 8, english: 'Bejaia', arabic: 'بِجَايَة (يما قورايا والمكاك البربري)', category: 'Cities', emoji: '🐵' },

  // Textbook Characters
  { id: 'dict-char-1', unitNumber: 0, english: 'Nadjib', arabic: 'نَجِيب (تلميذ الصف الرابع)', category: 'Characters', emoji: '👦🏻' },
  { id: 'dict-char-2', unitNumber: 0, english: 'Rehab', arabic: 'رِحَاب (تلميذة الصف الرابع المتفوقة)', category: 'Characters', emoji: '👧🏻' },
  { id: 'dict-char-3', unitNumber: 6, english: 'Massil', arabic: 'مَاسِيل (التلميذ الرياضي)', category: 'Characters', emoji: '🏃‍♂️' },
  { id: 'dict-char-4', unitNumber: 1, english: 'Meriem', arabic: 'مَرْيَم (التلميذة الرسامة)', category: 'Characters', emoji: '🎨' },
  { id: 'dict-char-5', unitNumber: 3, english: 'Yacine', arabic: 'يَاسِين (عضو نادي الإعلام الآلي)', category: 'Characters', emoji: '💻' },
  { id: 'dict-char-6', unitNumber: 0, english: 'Teacher', arabic: 'أُسْتَاذ / مُعَلِّمَة', category: 'Characters', emoji: '👩‍🏫' },
  { id: 'dict-char-7', unitNumber: 8, english: 'Fennec', arabic: 'الفَنَك الصَّحْرَاوِي (تميمة الكتاب)', category: 'Characters', emoji: '🦊' },

  // Objects & Scenes from Textbook Drawings
  { id: 'dict-obj-1', unitNumber: 0, english: 'Slate', arabic: 'لَوْحَةُ الكِتَابَة (اللوحة المدرسية)', category: 'Classroom', emoji: '⬛' },
  { id: 'dict-obj-2', unitNumber: 0, english: 'Schoolbag', arabic: 'مِحْفَظَةٌ مَدْرَسِيَّة', category: 'Classroom', emoji: '🎒' },
  { id: 'dict-obj-3', unitNumber: 0, english: 'Pencil case', arabic: 'مِقْلَمَة', category: 'Classroom', emoji: '👝' },
  { id: 'dict-obj-4', unitNumber: 1, english: 'Traditional Teapot', arabic: 'بَرَّادُ الشَّاي الجَزَائِرِي', category: 'Family', emoji: '🫖' },
  { id: 'dict-obj-5', unitNumber: 2, english: 'Stethoscope', arabic: 'سَمَّاعَةُ الطَّبِيب', category: 'Tools', emoji: '🩺' },
  { id: 'dict-obj-6', unitNumber: 4, english: 'Toothbrush', arabic: 'فُرْشَاةُ الأَسْنَان', category: 'Health', emoji: '🪥' },
  { id: 'dict-obj-7', unitNumber: 5, english: 'Couscous', arabic: 'كُسْكُسِي جَزَائِرِي تَقْلِيدِي', category: 'Food', emoji: '🍲' },
  { id: 'dict-obj-8', unitNumber: 5, english: 'Deglet Nour Dates', arabic: 'تَمْرُ دَقْلَة نُور الذَّهَبِي', category: 'Food', emoji: '🌴' },
  { id: 'dict-obj-9', unitNumber: 6, english: 'Skipping rope', arabic: 'حَبْلُ القَفْز (ألعاب الساحة)', category: 'Sports', emoji: '🪢' },
  { id: 'dict-obj-10', unitNumber: 6, english: 'Hopscotch', arabic: 'لُعْبَةُ الحَجْلَة / المَارِيل', category: 'Sports', emoji: '🔢' },
  { id: 'dict-obj-11', unitNumber: 7, english: 'Algerian Flag', arabic: 'العَلَمُ الجَزَائِرِي الوَطَنِي', category: 'Culture', emoji: '🇩🇿' },
  { id: 'dict-obj-12', unitNumber: 8, english: 'Fennec fox', arabic: 'ثَعْلَبُ الفَنَك', category: 'Animals', emoji: '🦊' },
  { id: 'dict-obj-13', unitNumber: 8, english: 'Sahara Camel', arabic: 'جَمَلُ الصَّحْرَاء', category: 'Animals', emoji: '🐪' },
  { id: 'dict-obj-14', unitNumber: 8, english: 'Calf', arabic: 'عِجْل (صغير البقرة)', category: 'Animals', emoji: '🐮' }
];

export const BADGES_DATA: Badge[] = [
  {
    id: 'first_lesson',
    titleAr: 'الخطوة الأولى',
    titleEn: 'First Step',
    description: 'أكملت أول درس بنجاح في رحلتك الممتعة!',
    icon: '🌟',
    category: 'xp',
    requirement: 'إكمال درس واحد'
  },
  {
    id: 'streak_3',
    titleAr: 'شعلة الحماس',
    titleEn: '3-Day Streak',
    description: 'واظبت على التعلم لـ 3 أيام متتالية!',
    icon: '🔥',
    category: 'streak',
    requirement: 'سلسلة 3 أيام'
  },
  {
    id: 'algeria_champion',
    titleAr: 'بطل الجزائر الصغير',
    titleEn: 'Algerian Champion',
    description: 'أتقنت درس البلدان والاحتفالات الوطنية!',
    icon: '🇩🇿',
    category: 'unit',
    requirement: 'إكمال الوحدة 1 أو 7'
  },
  {
    id: 'phonics_master',
    titleAr: 'سيد الصوتيات',
    titleEn: 'Phonics Master',
    description: 'فرّقت بنجاح بين أصوات /θ/ و /ð/ و /tʃ/ و /ʃ/!',
    icon: '🎙️',
    category: 'skill',
    requirement: 'حل 3 تمارين صوتيات صحيحة'
  },
  {
    id: 'gem_collector',
    titleAr: 'جامع الجواهر',
    titleEn: 'Gem Collector',
    description: 'جمعت أكثر من 50 جوهرة من إنجازاتك!',
    icon: '💎',
    category: 'xp',
    requirement: 'جمع 50 جوهرة'
  },
  {
    id: 'honor_pupil',
    titleAr: 'تلميذ الشرف 4PS',
    titleEn: 'Honor Pupil 4PS',
    description: 'حققت نسبة تفوق تفوق 85% في جميع مهارات المنهاج!',
    icon: '🏆',
    category: 'skill',
    requirement: 'إتقان 85% في المهارات'
  },
  {
    id: 'orator_master',
    titleAr: 'خطيب الصف وكاريزمة الإلقاء',
    titleEn: 'Orator & Charisma Master',
    description: 'أتقنت نطق نصوص القراءة وكاريزمة الإلقاء والخطابة أمام الفصل!',
    icon: '🎙️',
    category: 'skill',
    requirement: 'إكمال تدريب الإلقاء في نصوص الوحدات'
  }
];

export const LEADERBOARD_INITIAL: LeaderboardUser[] = [
  { id: 'npc-1', name: 'Nadjib (نجيب)', avatar: '👦', xp: 240, streak: 7, city: 'الشلف (Chlef)', isNpc: true },
  { id: 'npc-2', name: 'Fatima (فاطمة)', avatar: '👧', xp: 215, streak: 6, city: 'الجزائر العاصمة', isNpc: true },
  { id: 'user-player', name: 'أنت (البطل المتعلم)', avatar: '🌟', xp: 180, streak: 4, city: 'وهران', isNpc: false },
  { id: 'npc-3', name: 'Massil (مسيل)', avatar: '🧑', xp: 165, streak: 5, city: 'بجاية (Bejaia)', isNpc: true },
  { id: 'npc-4', name: 'Selma (سلمى)', avatar: '👧', xp: 140, streak: 3, city: 'قسنطينة', isNpc: true },
  { id: 'npc-5', name: 'Mustapha (مصطفى)', avatar: '👦', xp: 120, streak: 4, city: 'غرداية (Ghardaia)', isNpc: true },
  { id: 'npc-6', name: 'Meriem (مريم)', avatar: '👧', xp: 95, streak: 2, city: 'تلمسان', isNpc: true }
];
