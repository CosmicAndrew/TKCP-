import { Question, Sector } from './types';

export const TKCP_CONFIG = {
    companyName: "Thy Kingdom Come Productions",
    website: "https://thykingdomcomeproductions.com",
    phone: "(469) 840-9808",
    phoneLink: "tel:+14698409808",
    colors: {
        churchPrimary: "#2B4C7E",
        churchAccent: "#D4AF37",
        hospitalityPrimary: "#1B365D",
        hospitalityAccent: "#FF6B35"
    },
    logoBase64: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMjAwIDYwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjEwIiB5PSI0NSIgZm9udC1mYW1pbHk9IidQbGF5ZmFpciBEaXNwbGF5Jywgc2VyaWYiIGZvbnQtd2VpZ2h0PSJib2xkIiBmb250LXNpemU9IjI0IiBmaWxsPSIjMkI0QzdFIj5US0NQPC90ZXh0Pjwvc3ZnPg=="
};

export const HUBSPOT_CONFIG = {
    portalId: 'YOUR_PORTAL_ID', // Replace with actual Portal ID
    meetingLinks: {
        priority: 'https://meetings.hubspot.com/jasmineford',
        discovery: 'https://meetings.hubspot.com/tkcp/discovery',
        planning: 'https://meetings.hubspot.com/tkcp/followup'
    }
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
  // Question 3: Timeline/Compelling Event
  {
    text: () => "Within the next 3-6 months, are you planning to upgrade your visual/tech capabilities?",
    category: "Timeline",
    options: [
      { value: 'yes_now', text: { church: 'Yes, we are actively exploring options now.', hospitality: 'Yes, we are actively exploring options now.' }, points: 4 },
      { value: 'yes_q1', text: { church: 'Yes, but it\'s looking more toward Q1 2026.', hospitality: 'Yes, but it\'s looking more toward Q1 2026.' }, points: 2 },
      { value: 'maybe', text: { church: 'Maybe down the road, no firm plans.', hospitality: 'Maybe down the road, no firm plans.' }, points: 1 },
      { value: 'no', text: { church: 'No immediate plans.', hospitality: 'No immediate plans.' }, points: 0 },
    ],
  },
  // Question 4: NEW - Compelling Event Driver
  {
    text: (sector: Sector) => sector === 'church' 
        ? "What's the main driver behind your interest in LED technology?"
        : "What's the main driver behind your interest in LED technology?",
    category: "Compelling Event",
    options: [
        { value: 'urgent_problem', text: { church: 'Our current system keeps failing when we need it most', hospitality: 'Our current limitations are costing us bookings' }, points: 4 },
        { value: 'planned_upgrade', text: { church: 'We\'re planning facility improvements for 2026', hospitality: 'We\'re planning venue upgrades for competitive advantage' }, points: 3 },
        { value: 'future_proofing', text: { church: 'Want to future-proof our ministry technology', hospitality: 'Want to enhance our event capabilities' }, points: 2 },
        { value: 'general_interest', text: { church: 'Just learning about LED options', hospitality: 'Just exploring what\'s available' }, points: 1 },
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