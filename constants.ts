import { Question, Sector } from './types';

export const TKCP_CONFIG = {
    companyName: "Thy Kingdom Come Productions",
    website: "https://assessment.thykingdomcomeproductions.com/",
    phone: "(817) 952-9202",
    phoneLink: "tel:+18179529202",
    colors: {
        churchPrimary: "#2B4C7E",
        churchAccent: "#D4AF37",
        hospitalityPrimary: "#1B365D",
        hospitalityAccent: "#FF6B35"
    },
    logoBase64: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMjAwIDYwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjEwIiB5PSI0NSIgZm9udC1mYW1pbHk9IidQbGF5ZmFpciBEaXNwbGF5Jywgc2VyaWYiIGZvbnQtd2VpZ2h0PSJib2xkIiBmb250LXNpemU9IjI0IiBmaWxsPSIjMkI0QzdFIj5US0NQPC90ZXh0Pjwvc3ZnPg=="
};

export const HUBSPOT_CONFIG = {
    portalId: '22563653', // TKCP's actual Portal ID
    meetingLinks: {
        priority: 'https://meetings.hubspot.com/led-solution-consultation/led-video-consult',
        discovery: 'https://meetings.hubspot.com/led-solution-consultation/led-video-consult',
        planning: 'https://meetings.hubspot.com/led-solution-consultation/led-video-consult'
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
      { value: '1000+', text: { church: 'Over 1,000 people', hospitality: 'Over 1,000 capacity' }, points: 4 },
      { value: '500-1000', text: { church: '500-1,000 people', hospitality: '500-1,000 capacity' }, points: 3 },
      { value: '200-500', text: { church: '200-500 people', hospitality: '200-500 capacity' }, points: 2 },
      { value: '<200', text: { church: 'Under 200 people', hospitality: 'Under 200 capacity' }, points: 1 },
    ],
  },
  // Question 3: Timeline (Improved)
  {
    text: () => "When do you need your new <a href='https://thykingdomcomeproductions.com/led-display-solutions/' target='_blank' class='text-church-primary underline'>LED displays</a> to be operational?",
    category: "Timeline",
    options: [
      { value: 'urgent', text: { church: 'Urgently - Our current system is failing / We have a critical event soon.', hospitality: 'Urgently - We have a critical event or system failure.' }, points: 4 },
      { value: '3-6_months', text: { church: 'Within 3-6 months - We\'re planning for the next major season (e.g., Easter/Christmas).', hospitality: 'Within 3-6 months - Planning for our next major conference season.' }, points: 3 },
      { value: 'fiscal_year', text: { church: 'This fiscal year - It\'s in the budget, but timing is flexible.', hospitality: 'This fiscal year - It\'s in the budget, but timing is flexible.' }, points: 2 },
      { value: 'exploring', text: { church: 'Just exploring - We\'re in the early planning stages for next year.', hospitality: 'Just exploring - We\'re in the early planning stages for next year.' }, points: 1 },
    ],
  },
  // Question 4: Compelling Event (Improved & Sector-Specific)
  {
    text: (sector: Sector) => sector === 'church' 
        ? "What's the main driver for upgrading your church <a href='https://thykingdomcomeproductions.com/church-led-walls/' target='_blank' class='text-church-primary underline'>LED walls</a>?"
        : "What's the main driver for upgrading your venue's <a href='https://thykingdomcomeproductions.com/' target='_blank' class='text-church-primary underline'>LED video walls</a>?",
    category: "Compelling Event",
    options: [
        { value: 'system_failure', text: { church: 'Repeated tech failures are disrupting our services.', hospitality: 'Our current AV setup is unreliable and costly to rent.' }, points: 4 },
        { value: 'revenue_competition', text: { church: 'We\'re preparing for a major event like Easter or Christmas.', hospitality: 'We\'re losing bookings to better-equipped competitors.' }, points: 3 },
        { value: 'improve_experience', text: { church: 'We want to improve our livestream and online presence.', hospitality: 'We need to increase revenue from high-end corporate events.' }, points: 2 },
        { value: 'capital_upgrade', text: { church: 'We\'re in a capital campaign for facility upgrades.', hospitality: 'We\'re undergoing a facility modernization or renovation.' }, points: 1 },
    ],
  },
  // Question 5: Commitment Level
  {
    text: () => "Which path best describes your future?",
    category: "Impact",
    visual: 'two-paths',
    paths: {
        title: { church: "Current Projector Reality", hospitality: "The Old AV Approach" },
        points: {
            church: ["Constant bulb replacements", "Emergency repair calls", "Sunday morning stress", "Poor back-row visibility"],
            hospitality: ["High AV rental costs", "Lost bookings to better-equipped venues", "Limited creative options", "Complex, unreliable setups"]
        },
        footer: { church: `Maybe next year we'll upgrade...`, hospitality: `It's just the cost of doing business...` }
    },
    options: [
        { value: 'committed', text: { church: '🎯 Fully committed - let\'s make this happen', hospitality: '🎯 Fully committed - let\'s make this happen' }, points: 4 },
        { value: 'leaning', text: { church: '🧭 Leaning toward it - want to understand the process', hospitality: '🧭 Leaning toward it - want to understand the process' }, points: 2 },
        { value: 'exploring', text: { church: '📚 Just exploring - not ready to decide yet', hospitality: '📚 Just exploring - not ready to decide yet' }, points: 1 },
    ],
  },
];
