
import { Question, Sector } from './types';

export const TKCP_CONFIG = {
    companyName: "Thy Kingdom Come Productions",
    website: "https://assessment.thykingdomcomeproductions.com/",
    phone: "817-952-9202",
    phoneLink: "tel:+18179529202",
    email: "hello@ThyKingdomComeProductions.com",
    emailLink: "mailto:hello@ThyKingdomComeProductions.com",
    colors: {
        churchPrimary: "#2B4C7E",
        churchAccent: "#D4AF37",
        hospitalityPrimary: "#1B365D",
        hospitalityAccent: "#FF6B35"
    },
    logoBase64: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMjAwIDYwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjEwIiB5PSI0NSIgZm9udC1mYW1pbHk9IidQbGF5ZmFpciBEaXNwbGF5Jywgc2VyaWYiIGZvbnQtd2VpZ2h0PSJib2xkIiBmb250LXNpemU9IjI0IiBmaWxsPSIjMkI0QzdFIj5US0NQPC90ZXh0Pjwvc3ZnPg=="
};

export const LINK_CLASS = "text-church-primary dark:text-church-accent underline hover:text-opacity-80";

export const HUBSPOT_CONFIG = {
    portalId: '22563653', // TKCP's actual Portal ID
    meetingLinks: {
        priority: 'https://meetings.hubspot.com/led-solution-consultation/led-video-consult',
        discovery: 'https://meetings.hubspot.com/led-solution-consultation/led-video-consult',
        planning: 'https://meetings.hubspot.com/led-solution-consultation/led-video-consult'
    }
};

export const LOCAL_STORAGE_KEYS = {
    theme: 'theme',
    quizState: 'tkcp_quiz_state',
    sessionUserId: 'tkcp_session_user_id',
    contactInfo: 'tkcp_contact_info',
    cookieConsent: 'tkcp_cookie_consent',
    sector: 'tkcp_sector',
};

export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
  'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
  'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
  'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
  'American Samoa', 'District of Columbia', 'Guam', 'Northern Mariana Islands', 'Puerto Rico', 'Virgin Islands'
];

export const calculateLeadTemperature = (totalScore: number) => {
    if (totalScore >= 25) return 'hot';
    if (totalScore >= 15) return 'warm';
    return 'cold';
};

export const ASSESSMENT_QUESTIONS: Question[] = [
  // Question 1: Pain Scale (Psychological)
  {
    text: (sector: Sector) => sector === 'church' 
        ? "On a scale of 1-10, how frustrated are you with projector maintenance and Sunday failures?"
        : "On a scale of 1-10, how frustrated are you with high AV rental costs and booking limitations?",
    category: "Current Frustration",
    options: [
      { value: '9-10', text: { church: '9-10: Extremely frustrated - It\'s a major pain point.', hospitality: '9-10: Extremely frustrated - It\'s costing us significantly.' }, points: 4 },
      { value: '7-8', text: { church: '7-8: Very frustrated - It\'s a regular problem.', hospitality: '7-8: Very frustrated - We have frequent issues.' }, points: 3 },
      { value: '5-6', text: { church: '5-6: Moderately frustrated - We have occasional issues.', hospitality: '5-6: Moderately frustrated - There are some problems.' }, points: 2 },
      { value: '1-4', text: { church: '1-4: Minor frustration - Not a major issue for us.', hospitality: '1-4: Minor frustration - It\'s currently manageable.' }, points: 1 },
    ],
  },
  // Question 2: Organization Size (Demographic)
  {
    text: () => "What is your approximate auditorium or venue capacity?",
    category: "Project Scoping",
    options: [
      { value: '<200', text: { church: 'Under 200 seats', hospitality: 'Under 200 capacity' }, points: 1 },
      { value: '200-500', text: { church: '200-500 seats', hospitality: '200-500 capacity' }, points: 2 },
      { value: '500-1000', text: { church: '500-1,000 seats', hospitality: '500-1,000 capacity' }, points: 3 },
      { value: '1000+', text: { church: 'Over 1,000 seats', hospitality: 'Over 1,000 capacity' }, points: 4 },
    ],
  },
  // Question 3: Environment (Technical)
  {
    text: () => "Where will this LED wall primarily be installed?",
    category: "Technical Specs",
    options: [
      { value: 'indoor_stage', text: { church: 'Indoor Main Stage / Sanctuary', hospitality: 'Indoor Conference / Ballroom' }, points: 3 },
      { value: 'indoor_lobby', text: { church: 'Indoor Lobby / Welcome Center', hospitality: 'Indoor Lobby / Digital Signage' }, points: 2 },
      { value: 'outdoor', text: { church: 'Outdoor Venue / Signage', hospitality: 'Outdoor Event Space / Billboard' }, points: 2 },
      { value: 'mobile', text: { church: 'Mobile / Portable Church Setup', hospitality: 'Mobile Rental / Production Rig' }, points: 1 },
    ],
  },
  // Question 4: Viewing Distance (Technical)
  {
    text: () => "Roughly how far is the first row of seats from the screen location?",
    category: "Technical Specs",
    options: [
      { value: 'under_15', text: { church: 'Less than 15 feet (Need high resolution)', hospitality: 'Less than 15 feet (Need high resolution)' }, points: 2 },
      { value: '15_30', text: { church: '15 - 30 feet', hospitality: '15 - 30 feet' }, points: 3 },
      { value: '30_60', text: { church: '30 - 60 feet', hospitality: '30 - 60 feet' }, points: 3 },
      { value: '60_plus', text: { church: 'Over 60 feet', hospitality: 'Over 60 feet' }, points: 2 },
    ],
  },
  // Question 5: Current Technology (Technical)
  {
    text: () => "What are you currently using for your main display?",
    category: "Current Setup",
    options: [
      { value: 'projector', text: { church: 'Projector & Screen', hospitality: 'Projector & Screen' }, points: 3 },
      { value: 'tvs', text: { church: 'Large TV / LCD Monitors', hospitality: 'Video Wall / LCD Monitors' }, points: 2 },
      { value: 'nothing', text: { church: 'Nothing currently', hospitality: 'Nothing / Printed Signage' }, points: 1 },
      { value: 'old_led', text: { church: 'Older LED Wall (Upgrading)', hospitality: 'Older LED Wall (Upgrading)' }, points: 4 },
    ],
  },
  // Question 6: Primary Content (Usage)
  {
    text: () => "What will be the primary content displayed?",
    category: "Usage Needs",
    options: [
      { value: 'lyrics_text', text: { church: 'Lyrics, Scripture & Sermon Notes', hospitality: 'Presentations & Text Info' }, points: 2 },
      { value: 'imag', text: { church: 'IMAG (Live Camera Feed)', hospitality: 'Live Camera Feed / Speaker Close-ups' }, points: 4 },
      { value: 'video_playback', text: { church: 'High-Res Video Playback', hospitality: 'Branding & High-Res Video' }, points: 3 },
      { value: 'mixed', text: { church: 'Mix of all the above', hospitality: 'Mix of all the above' }, points: 3 },
    ],
  },
  // Question 7: Timeline (BANT)
  {
    text: () => `When are you planning to upgrade to <a href="https://thykingdomcomeproductions.com" target="_blank" class="${LINK_CLASS}">LED video walls</a>?`,
    category: "Timeline",
    options: [
      { value: 'urgent', text: { church: 'Urgent - Need by next major holiday (Christmas/Easter)', hospitality: 'Immediate - Losing bookings to competitors' }, points: 4 },
      { value: '3_6_months', text: { church: 'Active planning - Within 3-6 months', hospitality: 'Active project - Within 3-6 months' }, points: 3 },
      { value: '6_12_months', text: { church: 'Budgeting - Next fiscal year / 6-12 months', hospitality: 'Budgeting - Next fiscal year / 6-12 months' }, points: 2 },
      { value: 'researching', text: { church: 'Just Researching - No firm timeline', hospitality: 'Exploratory - No specific deadline' }, points: 0 },
    ],
  },
  // Question 8: Budget Range (BANT)
  {
    text: () => "What is your anticipated budget range for this project?",
    category: "Budget",
    options: [
      { value: 'under_20k', text: { church: 'Under $20,000', hospitality: 'Under $20,000' }, points: 1 },
      { value: '20k_50k', text: { church: '$20,000 - $50,000', hospitality: '$20,000 - $50,000' }, points: 3 },
      { value: '50k_100k', text: { church: '$50,000 - $100,000', hospitality: '$50,000 - $100,000' }, points: 4 },
      { value: '100k_plus', text: { church: '$100,000+', hospitality: '$100,000+' }, points: 5 },
    ],
  },
  // Question 9: Compelling Event (BANT)
  {
    text: () => `What's the primary driver behind your interest in <a href="https://thykingdomcomeproductions.com/led-panels/" target="_blank" class="${LINK_CLASS}">LED displays</a>?`,
    category: "Primary Driver",
    options: [
        { value: 'emergency_crisis', text: { church: 'Equipment Failure - Our current system died', hospitality: 'Equipment Failure / Urgent Replacement' }, points: 4 },
        { value: 'capital_campaign', text: { church: 'New Construction / Renovation Project', hospitality: 'Venue Renovation / Expansion' }, points: 3 },
        { value: 'strategic_enhancement', text: { church: 'Visual Upgrade - Enhancing the experience', hospitality: 'Competitive Upgrade - Staying relevant' }, points: 2 },
        { value: 'curiosity', text: { church: 'Curiosity - Just seeing what is possible', hospitality: 'Curiosity - Comparing options' }, points: 0 },
    ],
  },
  // Question 10: Decision Authority (BANT)
  {
    text: () => "What is your role in the decision-making process?",
    category: "Authority",
    options: [
      { value: 'final_decision', text: { church: 'I make the final financial decision', hospitality: 'I make the final financial decision' }, points: 4 },
      { value: 'recommender', text: { church: 'I research and recommend to the board/pastor', hospitality: 'I research and recommend to ownership' }, points: 3 },
      { value: 'committee', text: { church: 'I am part of a committee', hospitality: 'I am part of a planning committee' }, points: 2 },
      { value: 'influencer', text: { church: 'I am gathering info to pass along', hospitality: 'I am gathering info to pass along' }, points: 1 },
    ],
  },
  // Question 11: Commitment Level (Closing)
  {
    text: () => "Which path best describes your future?",
    category: "Commitment",
    visual: 'two-paths',
    paths: {
        title: {
            church: "Current Projector Reality",
            hospitality: "The Old AV Approach"
        },
        points: {
            church: [
                "Constant bulb replacements",
                "Emergency repair calls",
                "Sunday morning stress",
                "Poor back-row visibility",
            ],
            hospitality: [
                "High AV rental costs",
                "Lost bookings to better-equipped venues",
                "Limited creative options",
                "Complex, unreliable setups"
            ]
        },
        footer: {
            church: `Maybe next year we'll upgrade...`,
            hospitality: `It's just the cost of doing business...`
        }
    },
    options: [
        { value: 'committed', text: { church: '🎯 Fully committed - let\'s make this happen', hospitality: '🎯 Fully committed - let\'s make this happen' }, points: 5 },
        { value: 'leaning', text: { church: '🧭 Leaning toward it - want to understand the process', hospitality: '🧭 Leaning toward it - want to understand the process' }, points: 3 },
        { value: 'exploring', text: { church: '📚 Just exploring - not ready to decide yet', hospitality: '📚 Just exploring - not ready to decide yet' }, points: 1 },
    ],
  },
];
