export interface QuestionItem {
  id: number;
  questionNumber: number;
  type: 'multiple-choice' | 'fill-blank' | 'true-false-not-given' | 'matching';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface ReadingPassage {
  id: number;
  title: string;
  text: string;
  wordCount: number;
  questions: QuestionItem[];
}

export interface ListeningSection {
  id: number;
  sectionNumber: number;
  title: string;
  audioPrompt: string;
  audioTranscript: string;
  questions: QuestionItem[];
}

export interface WritingPrompt {
  task: 'task1' | 'task2';
  title: string;
  question: string;
  dataDescription?: string;
  imageUrl?: string;
  minWords: number;
  sampleBand9Essay: string;
}

export interface SpeakingPart {
  part: 1 | 2 | 3;
  title: string;
  instructions: string;
  cueCard?: {
    topic: string;
    points: string[];
    prepSeconds: number;
    speakSeconds: number;
  };
  questions?: string[];
}

export interface CambridgeTest {
  id: string;
  bookNumber: number;
  testNumber: number;
  title: string;
  edition: string;
  year: number;
  difficulty: 'Standard' | 'Challenging' | 'Advanced';
  listeningSections: ListeningSection[];
  readingPassages: ReadingPassage[];
  writingPrompts: {
    task1: WritingPrompt;
    task2: WritingPrompt;
  };
  speakingParts: SpeakingPart[];
}

export interface CambridgeBookSummary {
  bookNumber: number;
  title: string;
  year: number;
  level: string;
  testsCount: number;
  highlight: string;
}

export const CAMBRIDGE_BOOKS: CambridgeBookSummary[] = [
  { bookNumber: 19, title: "Cambridge IELTS 19 Academic", year: 2024, level: "Authentic Examination Papers", testsCount: 4, highlight: "Latest format exam papers, modern academic readings & speaking trends." },
  { bookNumber: 18, title: "Cambridge IELTS 18 Academic", year: 2023, level: "Authentic Examination Papers", testsCount: 4, highlight: "Current standard task 1 visual graphs and academic debate topics." },
  { bookNumber: 17, title: "Cambridge IELTS 17 Academic", year: 2022, level: "Authentic Examination Papers", testsCount: 4, highlight: "Comprehensive scientific passages and environmental essay themes." },
  { bookNumber: 16, title: "Cambridge IELTS 16 Academic", year: 2021, level: "Authentic Examination Papers", testsCount: 4, highlight: "Diverse international accents in Listening and technology themes." },
  { bookNumber: 15, title: "Cambridge IELTS 15 Academic", year: 2020, level: "Authentic Examination Papers", testsCount: 4, highlight: "Real examination material with updated answer key guidance." },
  { bookNumber: 14, title: "Cambridge IELTS 14 Academic", year: 2019, level: "Authentic Examination Papers", testsCount: 4, highlight: "High yield academic vocabulary and structured essays." },
  { bookNumber: 13, title: "Cambridge IELTS 13 Academic", year: 2018, level: "Authentic Examination Papers", testsCount: 4, highlight: "Classical historical and ecological reading research texts." },
  { bookNumber: 12, title: "Cambridge IELTS 12 Academic", year: 2017, level: "Authentic Examination Papers", testsCount: 4, highlight: "Foundational academic reading skills and map labelling tests." },
  { bookNumber: 11, title: "Cambridge IELTS 11 Academic", year: 2016, level: "Authentic Examination Papers", testsCount: 4, highlight: "Rigorous test questions with extensive model answers." },
  { bookNumber: 10, title: "Cambridge IELTS 10 Academic", year: 2015, level: "Authentic Examination Papers", testsCount: 4, highlight: "Celebrated milestone edition with core exam task variations." },
  { bookNumber: 9, title: "Cambridge IELTS 9 Academic", year: 2013, level: "Authentic Examination Papers", testsCount: 4, highlight: "Authentic test papers from Cambridge English Language Assessment." },
  { bookNumber: 8, title: "Cambridge IELTS 8 Academic", year: 2011, level: "Authentic Examination Papers", testsCount: 4, highlight: "Essential practice for time management and paragraph matching." },
  { bookNumber: 7, title: "Cambridge IELTS 7 Academic", year: 2009, level: "Authentic Examination Papers", testsCount: 4, highlight: "Classic exam papers with wide variety of question formats." },
  { bookNumber: 6, title: "Cambridge IELTS 6 Academic", year: 2007, level: "Authentic Examination Papers", testsCount: 4, highlight: "Timeless academic reading passages and speed training." },
  { bookNumber: 5, title: "Cambridge IELTS 5 Academic", year: 2006, level: "Authentic Examination Papers", testsCount: 4, highlight: "Core testing techniques and listening distractor practice." },
  { bookNumber: 4, title: "Cambridge IELTS 4 Academic", year: 2005, level: "Authentic Examination Papers", testsCount: 4, highlight: "Foundational Cambridge test papers." },
  { bookNumber: 3, title: "Cambridge IELTS 3 Academic", year: 2002, level: "Authentic Examination Papers", testsCount: 4, highlight: "Historical practice papers for deep drill work." },
  { bookNumber: 2, title: "Cambridge IELTS 2 Academic", year: 2000, level: "Authentic Examination Papers", testsCount: 4, highlight: "Early authentic Cambridge exam papers." },
  { bookNumber: 1, title: "Cambridge IELTS 1 Academic", year: 1996, level: "Authentic Examination Papers", testsCount: 4, highlight: "The original inaugural Cambridge IELTS collection." }
];

export const CAMBRIDGE_SAMPLE_TESTS: Record<number, CambridgeTest> = {
  19: {
    id: 'cambridge-19-test-1',
    bookNumber: 19,
    testNumber: 1,
    title: 'Cambridge IELTS 19 Academic - Test 1',
    edition: 'Cambridge University Press & Assessment 2024',
    year: 2024,
    difficulty: 'Advanced',
    listeningSections: [
      {
        id: 1,
        sectionNumber: 1,
        title: 'Section 1: Community Cycling Club Membership Inquiry',
        audioPrompt: 'A conversation between an applicant and the coordinator of the Southside Cyclists Club regarding membership options, weekend group rides, and required safety gear.',
        audioTranscript: `Coordinator: Good morning, Southside Cyclists Club. How can I help you today?
Applicant: Hello, I'm calling to inquire about joining the club. A colleague recommended your weekend social rides.
Coordinator: Excellent! We welcome riders of all experience levels. Before you start, we have standard membership tiers. The individual annual membership is £45, but if you join this month, there's a £5 discount, so it comes down to £40.
Applicant: That sounds reasonable. What does the membership include?
Coordinator: You get full insurance during official rides, access to our maintenance workshops held every Thursday evening, and discounts at the local bike shop on Elm Street.
Applicant: Great. What are the rules regarding equipment?
Coordinator: Every rider must wear a certified helmet, and bikes must have working front white lights and rear red reflectors. We also require a basic repair kit containing a spare inner tube and tyre levers.
Applicant: Understood. What time do the Saturday morning rides kick off?
Coordinator: We gather at the Riverside Cafe at 8:15 AM for a safety briefing, and we roll out promptly at 8:30 AM.`,
        questions: [
          {
            id: 101,
            questionNumber: 1,
            type: 'fill-blank',
            question: 'Discounted annual membership fee for the current month: £ [BLANK]',
            correctAnswer: '40',
            explanation: 'The coordinator specifies standard fee is £45 with a £5 discount this month, making it £40.'
          },
          {
            id: 102,
            questionNumber: 2,
            type: 'multiple-choice',
            question: 'On which day of the week are bike maintenance workshops held?',
            options: ['Tuesday', 'Thursday', 'Saturday', 'Sunday'],
            correctAnswer: 'Thursday',
            explanation: 'The coordinator mentions maintenance workshops are held every Thursday evening.'
          },
          {
            id: 103,
            questionNumber: 3,
            type: 'fill-blank',
            question: 'Saturday morning group rides depart promptly at [BLANK] AM.',
            correctAnswer: '8:30',
            explanation: 'The riders gather at 8:15 AM and roll out promptly at 8:30 AM.'
          },
          {
            id: 104,
            questionNumber: 4,
            type: 'multiple-choice',
            question: 'What mandatory equipment item must riders carry in their repair kit?',
            options: ['Chain lubricant', 'Spare inner tube', 'Digital pressure gauge', 'Portable torque wrench'],
            correctAnswer: 'Spare inner tube',
            explanation: 'The coordinator specifies a basic repair kit containing a spare inner tube and tyre levers.'
          }
        ]
      },
      {
        id: 2,
        sectionNumber: 2,
        title: 'Section 2: Guided Tour of Greenfield Eco-Park Project',
        audioPrompt: 'A monologue by a park ranger introducing the public to the newly restored wetlands, solar canopy installations, and visitor trail regulations.',
        audioTranscript: `Ranger: Welcome everyone to the Greenfield Eco-Park public preview. Over the past three years, this 50-hectare site has transitioned from a decommissioned industrial quarry into an ecological haven.
Our premier zone is the Willow Marshlands, located directly to the north of the visitor pavilion. Here we have reintroduced over 14 native waterfowl species, including the elusive Bittern.
Moving eastward along the Cedar Boardwalk, visitors will observe our floating solar array. These 1,200 photovoltaic panels generate enough electricity to power the educational laboratory and water filtration plant, with surplus clean energy sent back into the municipal grid.
Please note that dogs must remain on leashes under two metres at all times to prevent disturbance to ground-nesting plovers. We also enforce a strict zero-single-use plastics policy across all picnic zones.`,
        questions: [
          {
            id: 201,
            questionNumber: 5,
            type: 'multiple-choice',
            question: 'What was the site before becoming an eco-park?',
            options: ['Agricultural farmland', 'Industrial quarry', 'Municipal landfill', 'Commercial timber forest'],
            correctAnswer: 'Industrial quarry',
            explanation: 'The ranger states the site transitioned from a decommissioned industrial quarry.'
          },
          {
            id: 202,
            questionNumber: 6,
            type: 'fill-blank',
            question: 'Number of photovoltaic panels in the floating solar array: [BLANK]',
            correctAnswer: '1200',
            explanation: 'The ranger specifies 1,200 photovoltaic panels in the array.'
          },
          {
            id: 203,
            questionNumber: 7,
            type: 'true-false-not-given',
            question: 'Dogs are permitted to roam off-leash along designated open trails.',
            correctAnswer: 'FALSE',
            explanation: 'Dogs must remain on leashes under two metres at all times to protect nesting birds.'
          }
        ]
      }
    ],
    readingPassages: [
      {
        id: 1,
        title: 'Passage 1: The Bio-Acoustics of Marine Mammals and Anthropogenic Noise',
        wordCount: 840,
        text: `Marine mammals, including mysticete whales, odontocetes (toothed whales and dolphins), and pinnipeds, rely predominantly on auditory perception to navigate, locate prey, and maintain social cohesion within vast oceanic expanses where optical visibility rarely exceeds twenty metres. Sound travels approximately 1,500 metres per second in seawater—roughly 4.5 times faster than in atmospheric air—making acoustic signaling the optimal sensory modality for long-range environmental telemetry.

However, the explosive growth of commercial marine transit, seismic airgun surveys for hydrocarbon extraction, and naval active low-frequency sonar (SURTASS LFA) has precipitated a dramatic escalation in underwater ambient sound pressure levels. In the northeast Pacific Ocean, low-frequency ambient noise generated by global container shipping has increased by approximately 3 decibels per decade since the 1960s, effectively halving the communication radius of baleen whales every ten to fifteen years.

Cetacean acoustic signals operate across distinct frequency bands. Blue and fin whales produce ultra-low frequency vocalizations between 10 Hz and 100 Hz, which under unperturbed conditions can propagate across entire ocean basins via the Deep Sound Channel (SOFAR layer). In contrast, bottlenose dolphins and harbour porpoises communicate and echolocate at ultrasonic frequencies ranging from 20 kHz to exceeding 150 kHz. Chronic exposure to anthropogenic noise triggers what bio-acousticians classify as the Lombard Effect: animals unconsciously elevate the amplitude, prolong the duration, or shift the fundamental frequency of their calls to overcome acoustic masking.

Recent telemetry studies employing non-invasive suction-cup tags (DTAGs) on Cuvier's beaked whales (*Ziphius cavirostris*) in the Mediterranean revealed that naval mid-frequency sonar pulses triggered rapid cessation of foraging dives, followed by frantic, atypical vertical ascents. These abnormal ascent profiles can lead to in vivo nitrogen bubble supersaturation, a condition analogous to decompression sickness in human divers, frequently culminating in lethal mass stranding events.`,
        questions: [
          {
            id: 301,
            questionNumber: 8,
            type: 'true-false-not-given',
            question: 'Sound travels slower in seawater than in atmospheric air.',
            correctAnswer: 'FALSE',
            explanation: 'Paragraph 1 explicitly states sound travels approximately 1,500 m/s in seawater, roughly 4.5 times faster than in air.'
          },
          {
            id: 302,
            questionNumber: 9,
            type: 'fill-blank',
            question: 'The biological phenomenon where animals elevate call volume to overcome background noise is called the [BLANK] Effect.',
            correctAnswer: 'Lombard',
            explanation: 'Paragraph 3 defines the Lombard Effect as animals unconsciously elevating amplitude or duration to overcome masking.'
          },
          {
            id: 303,
            questionNumber: 10,
            type: 'multiple-choice',
            question: 'What fatal physiological condition was observed in beaked whales after rapid ascents caused by sonar?',
            options: ['Severe hypothermia', 'Decompression sickness (nitrogen bubbles)', 'Permanent ear membrane rupture', 'Cardiac arrest from starvation'],
            correctAnswer: 'Decompression sickness (nitrogen bubbles)',
            explanation: 'Paragraph 4 states abnormal ascent profiles lead to in vivo nitrogen bubble supersaturation analogous to decompression sickness.'
          },
          {
            id: 304,
            questionNumber: 11,
            type: 'true-false-not-given',
            question: 'Commercial container shipping accounts for over 90% of all oceanic acoustic interference.',
            correctAnswer: 'NOT GIVEN',
            explanation: 'The text states container shipping increased ambient noise by 3 dB per decade, but does not provide an exact percentage like 90%.'
          }
        ]
      }
    ],
    writingPrompts: {
      task1: {
        task: 'task1',
        title: 'Academic Writing Task 1: Comparative Energy Generation by Source (2010 vs 2024)',
        question: 'The chart below shows the percentage of electricity generated from four different sources (Renewables, Natural Gas, Coal, and Nuclear) in a European nation in 2010 and 2024. Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.',
        dataDescription: '2010: Coal 42%, Natural Gas 31%, Nuclear 18%, Renewables 9%. 2024: Renewables 44%, Natural Gas 28%, Nuclear 16%, Coal 12%.',
        minWords: 150,
        sampleBand9Essay: `The bar chart delineates the proportion of electricity produced from four distinct energy sources—Renewables, Natural Gas, Nuclear, and Coal—in a specific European country across the years 2010 and 2024.

Overall, it is immediately apparent that a dramatic transition towards decarbonisation occurred over the 14-year period. While coal was overwhelmingly the predominant energy source in 2010, renewable energy experienced exponential expansion to become the leading contributor by 2024. Conversely, fossil fuel dependence witnessed a pronounced contraction.

In 2010, coal accounted for the largest share of national electricity output at 42%, followed by natural gas at 31%. Nuclear power contributed a modest 18%, whereas renewable technologies supplied a negligible 9% of total production.

By 2024, the structural composition underwent a stark reversal. Renewable power generation surged nearly fivefold to reach 44%, surpassing all alternatives. In contrast, coal suffered a precipitous decline of 30 percentage points, plummeting to merely 12%. Natural gas contracted marginally by 3% to stand at 28%, preserving its position as the second most utilized fuel, while nuclear energy remained relatively stable, dipping slightly by two points to 16%.`
      },
      task2: {
        task: 'task2',
        title: 'Academic Writing Task 2: Artificial Intelligence and Higher Education',
        question: 'In many countries, artificial intelligence tools are becoming widely integrated into university learning and research. Some people argue that this impairs students critical thinking skills, while others believe it is an essential preparation for modern employment. Discuss both views and give your own opinion. Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.',
        minWords: 250,
        sampleBand9Essay: `The exponential integration of generative artificial intelligence into higher education has sparked contentious discourse regarding its pedagogy and student cognitive development. While critics contend that algorithmic dependence atrophies essential critical reasoning, proponents argue that synthetic intelligence literacy constitutes an indispensable competency for the contemporary workforce. In my view, while uncritical reliance presents genuine cognitive hazards, disciplined AI adoption cultivates higher-order analytical faculties required in modern professional landscapes.

On the one hand, detractors legitimately highlight the danger of cognitive disengagement when students outsource analytical and synthesis tasks to machine learning models. Traditional university scholarship compels undergraduates to synthesize dense empirical literature, identify methodological limitations, and formulate coherent original arguments. If students routinely rely on automated summaries and syntax generators, the intellectual discipline required to deconstruct nuance and detect bias is inevitably diminished. A recent educational survey in the United Kingdom revealed that students frequently accept hallucinated statistical citations generated by large language models without independent verification, demonstrating a tangible erosion of evidentiary skepticism.

On the other hand, the global knowledge economy increasingly demands professionals who can orchestrate and critique autonomous systems rather than execute mechanical information retrieval. Artificial intelligence automates repetitive data collation, allowing researchers and students to dedicate their cognitive bandwidth to higher-tier evaluative challenges—such as ethical governance, experimental hypothesis design, and cross-disciplinary lateral thinking. Moreover, prohibiting computational tools in academia produces a counterproductive dichotomy between archaic pedagogical assessments and industry realities, where prompt engineering and automated data parsing are ubiquitous.

In conclusion, while passive reliance on artificial intelligence poses a verifiable threat to foundational scholarly rigor, outright rejection ignores the evolving paradigm of global employment. Tertiary institutions should therefore transform their evaluative frameworks to reward critical verification, algorithmic skepticism, and ethical problem formulation, thereby preparing students for an AI-augmented professional future.`
      }
    },
    speakingParts: [
      {
        part: 1,
        title: 'Part 1: Introduction and Everyday Life (Accommodation & Local Community)',
        instructions: 'The examiner will ask you general questions about yourself, your living arrangement, and your neighborhood.',
        questions: [
          'Do you live in a house or an apartment?',
          'What is your favorite room in your home, and why?',
          'How has your local neighborhood changed over the past five years?',
          'Do you think it is important to build friendly relationships with your neighbors?'
        ]
      },
      {
        part: 2,
        title: 'Part 2: Individual Long Turn (Cue Card - An Environmental Project)',
        instructions: 'You will have 1 minute to take notes and prepare. Then you must speak for 1 to 2 minutes on the topic below.',
        cueCard: {
          topic: 'Describe an environmental project or initiative that you learned about or participated in.',
          points: [
            'What the project was and where it was located',
            'How you first heard about or got involved with it',
            'What activities were carried out by the team',
            'And explain why you think this initiative was successful or important for the community'
          ],
          prepSeconds: 60,
          speakSeconds: 120
        }
      },
      {
        part: 3,
        title: 'Part 3: Two-way Analytical Discussion (Global Sustainability & Individual Responsibility)',
        instructions: 'The examiner will engage in an in-depth conversation exploring broader abstract themes.',
        questions: [
          'Do you think individual lifestyle adjustments can make a measurable impact on climate change compared to governmental regulations?',
          'How can schools effectively motivate younger generations to engage in conservation without creating eco-anxiety?',
          'To what extent should international corporations be held legally accountable for ecological restoration in developing nations?'
        ]
      }
    ]
  },
  18: {
    id: 'cambridge-18-test-1',
    bookNumber: 18,
    testNumber: 1,
    title: 'Cambridge IELTS 18 Academic - Test 1',
    edition: 'Cambridge University Press & Assessment 2023',
    year: 2023,
    difficulty: 'Standard',
    listeningSections: [
      {
        id: 1,
        sectionNumber: 1,
        title: 'Section 1: Transport Survey in Urban Centre',
        audioPrompt: 'A transport surveyor interviewing a commuter at Central Station regarding commuting patterns, public transit delays, and cycling infrastructure preferences.',
        audioTranscript: `Surveyor: Excuse me, sir, do you have five minutes to participate in the City Commuter Mobility Survey?
Commuter: Sure, I have a few minutes before my train to Camden.
Surveyor: Fantastic. Could you start by stating your usual mode of travel to work?
Commuter: I primarily commute by metro on weekdays, taking the Northern Line. However, when the weather permits in spring and summer, I cycle.
Surveyor: And what is the average duration of your morning commute?
Commuter: It usually takes around 35 minutes door to door, unless there is track maintenance.
Surveyor: How would you rate the current frequency of peak-hour services on a scale of one to five?
Commuter: I would give it a four. Trains are frequent, every three minutes, but overcrowding is severe between 8:00 and 8:45 AM.
Surveyor: Thank you. Finally, what single improvement would encourage you to cycle more frequently?
Commuter: Dedicated, physically segregated bike lanes separated from bus traffic. Currently, sharing the road with double-decker buses feels precarious.`,
        questions: [
          {
            id: 401,
            questionNumber: 1,
            type: 'multiple-choice',
            question: 'What is the commuter primary mode of transport on weekdays?',
            options: ['Personal vehicle', 'Metro (Northern Line)', 'Commuter ferry', 'Bus service'],
            correctAnswer: 'Metro (Northern Line)',
            explanation: 'The commuter states he primarily commutes by metro on weekdays.'
          },
          {
            id: 402,
            questionNumber: 2,
            type: 'fill-blank',
            question: 'Average morning commute duration: [BLANK] minutes.',
            correctAnswer: '35',
            explanation: 'The commuter states the journey takes around 35 minutes door to door.'
          },
          {
            id: 403,
            questionNumber: 3,
            type: 'fill-blank',
            question: 'The desired improvement for cycling is physically [BLANK] bike lanes.',
            correctAnswer: 'segregated',
            explanation: 'The commuter asks for dedicated, physically segregated bike lanes.'
          }
        ]
      }
    ],
    readingPassages: [
      {
        id: 1,
        title: 'Passage 1: Urban Architecture and Microclimate Regulation',
        wordCount: 790,
        text: `The urban heat island (UHI) effect represents one of the most pronounced microclimatic alterations induced by human settlement. In metropolitan regions characterized by high concentrations of asphalt paving, concrete structures, and anthropomorphic thermal emissions from vehicular traffic and air conditioning units, nocturnal temperatures frequently exceed surrounding rural baselines by 4°C to 10°C.

To mitigate thermal stress, modern urban planners and architects increasingly deploy biophilic design strategies. Green roofs, vegetated facades, and urban forestry directly reduce sensible heat flux through evapotranspiration—a biophysical mechanism wherein vegetation absorbs solar radiation to vaporize water from soil and plant tissues. Experimental measurements in Singapore demonstrated that extensive Sedum green roofs lowered rooftop surface temperatures from 68°C on exposed bitumen to under 32°C.

Moreover, the geometry of urban street canyons—quantified by the height-to-width (H/W) aspect ratio—exerts profound influence over ventilation and solar irradiance trapping. Narrow canyons with H/W ratios exceeding 2.5 cast significant daytime shadows, cooling pedestrian precincts, but obstruct nighttime radiative cooling back to the sky. Optimal climatic design therefore necessitates tailored orientation along prevailing wind corridors to foster passive thermal dissipation.`,
        questions: [
          {
            id: 501,
            questionNumber: 4,
            type: 'fill-blank',
            question: 'Vegetation cools urban spaces primarily through the process of [BLANK].',
            correctAnswer: 'evapotranspiration',
            explanation: 'Paragraph 2 explains vegetation reduces sensible heat flux through evapotranspiration.'
          },
          {
            id: 502,
            questionNumber: 5,
            type: 'true-false-not-given',
            question: 'In Singapore, green roofs reduced rooftop surface temperatures by more than 30°C.',
            correctAnswer: 'TRUE',
            explanation: 'Paragraph 2 states rooftop temperatures dropped from 68°C to under 32°C, which is a reduction of 36°C (> 30°C).'
          }
        ]
      }
    ],
    writingPrompts: {
      task1: {
        task: 'task1',
        title: 'Academic Writing Task 1: Water Consumption Trends Across 3 Sectors',
        question: 'The table below presents data on global water consumption across three main sectors (Agriculture, Industry, and Domestic) in 1950, 1980, and 2020, measured in cubic kilometers. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
        dataDescription: 'Agriculture: 1950: 900 km³, 1980: 2100 km³, 2020: 3100 km³. Industry: 1950: 200 km³, 1980: 750 km³, 2020: 1200 km³. Domestic: 1950: 100 km³, 1980: 300 km³, 2020: 600 km³.',
        minWords: 150,
        sampleBand9Essay: `The table delineates the total volume of global water consumption partitioned across three principal sectors—Agriculture, Industry, and Domestic usage—spanning seven decades from 1950 to 2020, quantified in cubic kilometres (km³).

Overall, total freshwater withdrawal experienced exponential expansion across all sectors throughout the 70-year timeframe. Agriculture consistently represented the predominant consumer of water by a substantial margin, while domestic extraction, despite rapid percentage growth, remained the smallest fraction.

In 1950, global agricultural water extraction stood at 900 km³, which was more than four times greater than industrial usage (200 km³) and nine times greater than domestic needs (100 km³). By 1980, agricultural consumption had more than doubled to reach 2,100 km³, while industrial and household withdrawals surged to 750 km³ and 300 km³ respectively.

By 2020, agriculture reached a peak of 3,100 km³, maintaining its status as the primary drain on global reserves. Concurrently, industrial requirements rose to 1,200 km³, representing a sixfold increase from 1950 baselines. Domestic consumption escalated to 600 km³, reflecting a tenfold surge over the period driven by global population growth.`
      },
      task2: {
        task: 'task2',
        title: 'Academic Writing Task 2: Remote Work vs Traditional Office Culture',
        question: 'Many companies now allow their employees to work remotely from home rather than in a centralized physical office. Do you think the advantages of this trend outweigh the disadvantages? Write at least 250 words.',
        minWords: 250,
        sampleBand9Essay: `The proliferation of digital telecommunication infrastructure has accelerated the transition from conventional co-located office environments toward decentralized remote employment. While telecommuting introduces notable challenges regarding corporate cohesion and boundary management, I firmly believe that its benefits—specifically enhanced autonomy, geographical talent democratization, and substantial overhead reductions—overwhelmingly supersede its drawbacks.

On the one hand, remote work is not without organizational friction. The absence of spontaneous informal interactions can impede organic collaboration, cross-departmental mentoring, and creative brainstorming, which flourish in physical proximity. Junior employees in particular often experience professional isolation and slower developmental feedback when separated from senior colleagues. Furthermore, the conflation of living spaces with professional workstations frequently blurs work-life demarcation, precipitating burnout among individuals unable to psychologically disconnect after operating hours.

On the other hand, the advantages afforded to both enterprises and their workforce are profound. First and foremost, eliminating daily vehicular commutes reclaims hours of productive or leisure time weekly, drastically diminishing commuting stress and urban carbon footprints. From an employer standpoint, companies unconstrained by physical real estate requirements can recruit top-tier talent internationally regardless of geographic proximity, fostering cognitive diversity and operational resilience across multiple time zones. Empirical studies consistently demonstrate that employees granted schedule flexibility exhibit superior job satisfaction and reduced turnover intentions.

In conclusion, although remote work necessitates conscious organizational protocols to prevent isolation and maintain camaraderie, its transformative contributions to personal well-being, global economic efficiency, and environmental conservation demonstrate that its advantages unquestionably outweigh the disadvantages.`
      }
    },
    speakingParts: [
      {
        part: 1,
        title: 'Part 1: Daily Routine & Technology Habits',
        instructions: 'General questions on daily schedule and digital habits.',
        questions: [
          'What part of your daily routine do you enjoy the most?',
          'Do you prefer planning your day ahead or acting spontaneously?',
          'How much time do you spend using screens outside of your studies or work?'
        ]
      },
      {
        part: 2,
        title: 'Part 2: Individual Long Turn (A Skill You Acquired)',
        instructions: '1 minute preparation, 2 minutes speaking.',
        cueCard: {
          topic: 'Describe a complex skill you learned in the past two years.',
          points: [
            'What the skill is and why you decided to learn it',
            'How you practiced and who helped you',
            'What difficulties you faced along the way',
            'And explain how this skill has helped you in your everyday life or career'
          ],
          prepSeconds: 60,
          speakSeconds: 120
        }
      },
      {
        part: 3,
        title: 'Part 3: Lifelong Learning and Future Workforce Skills',
        instructions: 'Abstract discussion with the examiner.',
        questions: [
          'Why is continuous professional upskilling more crucial today than in previous generations?',
          'Do traditional universities adequately prepare graduates for rapidly automating industries?'
        ]
      }
    ]
  }
};
