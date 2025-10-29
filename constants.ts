import { Question } from './types';

export const ASSESSMENT_QUESTIONS: Question[] = [
  // Question 1: Need & Timeline
  {
    text: "What's the primary driver for you to explore a new LED solution right now?",
    category: "Readiness",
    options: [
      { value: 'urgent_need', text: { church: 'Our current system is failing or unreliable.', hospitality: 'Our current AV is outdated and causing issues for events.' }, points: 2 },
      { value: 'enhance_experience', text: { church: 'We want to significantly enhance the worship experience.', hospitality: 'We aim to create more immersive, high-end event experiences.' }, points: 1.5 },
      { value: 'planned_upgrade', text: { church: 'It\'s part of a planned facility upgrade.', hospitality: 'It\'s part of a scheduled venue-wide tech refresh.' }, points: 1 },
      { value: 'researching', text: { church: 'We are in the early stages of exploring options.', hospitality: 'Just researching future AV trends and possibilities.' }, points: 0.5 },
    ],
  },
  // Question 2: Authority
  {
    text: "What is your role in this technology decision?",
    category: "Alignment",
    options: [
      { value: 'final_authority', text: { church: 'I have the final say on the budget and decision.', hospitality: 'I have final budgetary approval.' }, points: 2 },
      { value: 'key_influencer', text: { church: 'I am a key influencer on the committee.', hospitality: 'I am a key influencer in the project team.' }, points: 1.5 },
      { value: 'recommender', text: { church: 'I research and recommend solutions to leadership.', hospitality: 'I am the technical lead who makes recommendations.' }, points: 1 },
      { value: 'information_gatherer', text: { church: 'I am gathering information for my team.', hospitality: 'I am conducting initial research for others.' }, points: 0.5 },
    ],
  },
  // Question 3: Need (Pain Point)
  {
    text: "What is your biggest frustration with your current AV setup?",
    category: "Impact",
    options: [
      { value: 'maintenance', text: { church: 'Constant maintenance, bulb changes, and unreliability.', hospitality: 'High maintenance costs and operational downtime.' }, points: 2 },
      { value: 'visibility', text: { church: 'Poor visibility and clarity, especially for our livestream.', hospitality: 'Guests complain about poor screen visibility or quality.' }, points: 2 },
      { value: 'outdated', text: { church: 'It makes our space feel dated and behind the times.', hospitality: 'It limits the types of premium events we can book.' }, points: 1.5 },
      { value: 'rental_costs', text: { church: 'We rely on rentals for special events.', hospitality: 'High costs and logistics of AV rentals for major events.' }, points: 1.5 },
    ],
  },
   // Question 4: Need / Budget proxy
  {
    text: "What is the approximate capacity of your main venue space?",
    category: "Alignment",
    options: [
      { value: '<200', text: { church: 'Seats less than 200 people', hospitality: 'Accommodates less than 100 guests' }, points: 0.5 }      
      { value: '200-500', text: { church: 'Seats 200-500 people', hospitality: 'Accommodates 100-300 guests' }, points: 1 }      
      { value: '500-1000', text: { church: 'Seats 500-1,000 people', hospitality: 'Accommodates 300-750 guests' }, points: 1.5 }      
      { value: '1000+', text: { church: 'Seats over 1,000 people', hospitality: 'Accommodates over 750 guests' }, points: 2 },
,
,
,
    ],
  },
  // Question 5: Timeline
  {
    text: "Realistically, when do you need this solution to be fully installed and operational?",
    category: "Readiness",
    options: [
        { value: '0-3', text: { church: 'Within the next 3 months.', hospitality: 'Within 3 months for our peak season.' }, points: 2 },
        { value: '3-6', text: { church: 'In the next 3-6 months.', hospitality: 'In the next 3-6 months.' }, points: 1.5 },
        { value: '6-12', text: { church: 'In the next 6-12 months.', hospitality: 'Within the next fiscal year.' }, points: 1 },
        { value: '12+', text: { church: 'More than a year out / Just budget planning.', hospitality: '12+ months out / In long-term planning.' }, points: 0 },
    ],
  },
];
