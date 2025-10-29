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
    }
};

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
   // Question 4: Budget Authority
  {
    text: (sector: Sector) => sector === 'church' 
        ? "Is upgrading your worship technology something your leadership team is discussing for 2026?"
        : "Is upgrading your venue's AV capabilities something you're budgeting for in 2026?",
    category: "Budget Authority",
    options: [
      { value: 'approved', text: { church: 'Yes, it\'s already approved/allocated.', hospitality: 'Yes, it\'s already approved/allocated.' }, points: 4 },
      { value: 'advocating', text: { church: 'Yes, we\'re currently advocating for it.', hospitality: 'Yes, we\'re currently advocating for it.' }, points: 3 },
      { value: 'discuss', text: { church: 'We still need to discuss it with leadership.', hospitality: 'We still need to discuss it with the project team.' }, points: 2 },
      { value: 'not_yet', text: { church: 'No, it\'s not on the radar yet.', hospitality: 'No, it\'s not on the radar yet.' }, points: 0 },
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
        { value: 'committed', text: { church: '🎯 Fully committed - let\'s make this happen', hospitality: '🎯 Fully committed - let\'s make this happen' }, points: 0 },
        { value: 'leaning', text: { church: '🧭 Leaning toward it - want to understand the process', hospitality: '🧭 Leaning toward it - want to understand the process' }, points: 0 },
        { value: 'exploring', text: { church: '📚 Just exploring - not ready to decide yet', hospitality: '📚 Just exploring - not ready to decide yet' }, points: 0 },
    ],
  },
];