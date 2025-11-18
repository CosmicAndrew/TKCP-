import { Question, Sector } from './types';

export const TKCP_CONFIG = {
    companyName: "Thy Kingdom Come Productions",
    website: "https://thykingdomcomeproductions.com/",
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
    if (totalScore >= 12) return 'hot';
    if (totalScore >= 6) return 'warm';
    return 'cold';
};

export const ASSESSMENT_QUESTIONS: Question[] = [
  // Question 1: Pain Scale
  {
    text: (sector: Sector) => sector === 'church' 
        ? "On a scale of 1-10, how frustrated are you with projector maintenance and Sunday failures?"
        : "On a scale of 1-10, how frustrated are you with high AV rental costs and booking limitations?",
    category: "Pain Scale",
    options: [
      { value: '9-10', text: { church: '9-10: Extremely frustrated - It\'s a major pain point.', hospitality: '9-10: Extremely frustrated - It\'s costing us significantly.' }, points: 4 },
      { value: '7-8', text: { church: '7-8: Very frustrated - It\'s a regular problem.', hospitality: '7-8: Very frustrated - We have frequent issues.' }, points: 3 },
      { value: '5-6', text: { church: '5-6: Moderately frustrated - We have occasional issues.', hospitality: '5-6: Moderately frustrated - There are some problems.' }, points: 2 },
      { value: '1-4', text: { church: '1-4: Minor frustration - Not a major issue for us.', hospitality: '1-4: Minor frustration - It\'s currently manageable.' }, points: 1 },
    ],
  },
  // Question 2: Organization Size
  {
    text: () => "What's your organization's size?",
    category: "Project Scoping",
    options: [
      { value: '<200', text: { church: 'Under 200 people', hospitality: 'Under 200 capacity' }, points: 1 },
      { value: '200-500', text: { church: '200-500 people', hospitality: '200-500 capacity' }, points: 2 },
      { value: '500-1000', text: { church: '500-1,000 people', hospitality: '500-1,000 capacity' }, points: 3 },
      { value: '1000+', text: { church: 'Over 1,000 people', hospitality: 'Over 1,000 capacity' }, points: 4 },
    ],
  },
  // Question 3: Timeline (IMPROVED)
  {
    text: () => `When are you planning to upgrade to <a href="https://thykingdomcomeproductions.com" target="_blank" class="${LINK_CLASS}">LED video walls</a>?`,
    category: "Timeline",
    options: [
      { value: 'urgent', text: { church: 'Urgent - Need by Christmas/Easter (next 3 months)', hospitality: 'Immediate - Losing bookings to competitors now' }, points: 4 },
      { value: 'q1_2026', text: { church: 'Active planning - Q1 2026 budget cycle', hospitality: 'Q1 2026 - Conference season preparation' }, points: 3 },
      { value: '6_12_months', text: { church: 'Exploring - Within next 6-12 months', hospitality: 'Planning - Within next 6-12 months' }, points: 2 },
      { value: 'researching', text: { church: 'Researching - No firm timeline yet', hospitality: 'Exploratory - No specific deadline' }, points: 0 },
    ],
  },
  // Question 4: Compelling Event Driver (IMPROVED)
  {
    text: () => `What's the primary driver behind your interest in <a href="https://thykingdomcomeproductions.com/led-panels/" target="_blank" class="${LINK_CLASS}">LED displays</a>?`,
    category: "Compelling Event",
    options: [
        { value: 'emergency_crisis', text: { church: 'Emergency - Projector failing/streaming issues', hospitality: 'Revenue crisis - Lost bookings/competitive gap' }, points: 4 },
        { value: 'capital_campaign_upgrade', text: { church: 'Capital campaign - Major facility renovation', hospitality: 'Facility upgrade - Renovation/expansion project' }, points: 3 },
        { value: 'strategic_enhancement', text: { church: 'Strategic upgrade - Enhance worship experience', hospitality: 'Competitive positioning - Stay ahead of market' }, points: 2 },
        { value: 'early_research', text: { church: 'Early research - Gathering information', hospitality: 'Initial exploration - Learning about options' }, points: 1 },
    ],
  },
  // Question 5: Transformation Thirst Builder
  {
    text: () => "Which path best describes your future?",
    category: "Impact",
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
        { value: 'committed', text: { church: '🎯 Fully committed - let\'s make this happen', hospitality: '🎯 Fully committed - let\'s make this happen' }, points: 4 },
        { value: 'leaning', text: { church: '🧭 Leaning toward it - want to understand the process', hospitality: '🧭 Leaning toward it - want to understand the process' }, points: 2 },
        { value: 'exploring', text: { church: '📚 Just exploring - not ready to decide yet', hospitality: '📚 Just exploring - not ready to decide yet' }, points: 1 },
    ],
  },
];
