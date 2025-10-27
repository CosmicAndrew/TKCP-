
import { Question } from './types';

export const ASSESSMENT_QUESTIONS: Question[] = [
  // Readiness (5 questions)
  {
    text: "What best describes your current AV situation?",
    category: "Readiness",
    options: [
      { value: 'failing', text: { church: 'Our projector is failing or unreliable.', hospitality: 'Our current AV is outdated and causes issues.' }, points: 1 },
      { value: 'poor_visibility', text: { church: 'We have poor visibility in parts of the sanctuary.', hospitality: 'Guests complain about poor screen visibility.' }, points: 0.75 },
      { value: 'planning_upgrade', text: { church: 'We are planning a major facility upgrade.', hospitality: 'We are planning a venue-wide tech refresh.' }, points: 0.5 },
      { value: 'exploring', text: { church: 'Just exploring options for the future.', hospitality: 'Researching AV trends and possibilities.' }, points: 0.25 },
    ],
  },
  {
    text: "What is your project timeline?",
    category: "Readiness",
    options: [
      { value: 'now', text: { church: 'Immediately, we have an urgent need.', hospitality: 'As soon as possible, we are losing bookings.' }, points: 1 },
      { value: '30-60', text: { church: 'Within the next 1-2 months.', hospitality: 'Within the next 1-2 months.' }, points: 0.75 },
      { value: '3-6', text: { church: 'In the next 3-6 months.', hospitality: 'In the next 3-6 months.' }, points: 0.5 },
      { value: 'researching', text: { church: '6+ months out / Just researching.', hospitality: '6+ months out / Budget planning for next year.' }, points: 0 },
    ],
  },
  {
    text: "What is the status of your budget for this project?",
    category: "Readiness",
    options: [
      { value: 'approved', text: { church: 'Fully approved and ready to allocate.', hospitality: 'Budget is approved and allocated.' }, points: 1 },
      { value: 'in_review', text: { church: 'Submitted and is currently in review.', hospitality: 'In review with the finance committee.' }, points: 0.75 },
      { value: 'financing', text: { church: 'We are exploring financing options.', hospitality: 'We need to secure financing or a capital loan.' }, points: 0.5 },
      { value: 'not_discussed', text: { church: 'We have not discussed the budget yet.', hospitality: 'Budget has not been formally discussed.' }, points: 0 },
    ],
  },
   {
    text: "How much do you currently spend annually on AV maintenance (bulbs, repairs, service calls)?",
    category: "Readiness",
    options: [
      { value: 'high', text: { church: 'Over $5,000 per year', hospitality: 'Over $20,000 per year' }, points: 1 },
      { value: 'medium', text: { church: '$1,000 - $5,000 per year', hospitality: '$5,000 - $20,000 per year' }, points: 0.75 },
      { value: 'low', text: { church: 'Less than $1,000 per year', hospitality: 'Less than $5,000 per year' }, points: 0.5 },
      { value: 'unsure', text: { church: 'I\'m not sure', hospitality: 'I\'m not sure' }, points: 0.25 },
    ],
  },
  {
    text: "How familiar are you with LED wall technology?",
    category: "Readiness",
    options: [
        { value: 'expert', text: { church: 'Very familiar, we know what we need.', hospitality: 'Very familiar, we\'ve used them for events.' }, points: 1 },
        { value: 'some', text: { church: 'Somewhat familiar, seen them at other churches.', hospitality: 'Somewhat familiar, exploring for our venue.' }, points: 0.5 },
        { value: 'new', text: { church: 'New to this, trying to learn.', hospitality: 'We are new to this technology.' }, points: 0.25 },
    ],
  },
  // Alignment (4 questions)
  {
    text: "What is the approximate size of your main gathering space?",
    category: "Alignment",
    options: [
      { value: '1000+', text: { church: 'Seats 1,000+', hospitality: 'Accommodates 750+' }, points: 1 },
      { value: '500-1000', text: { church: 'Seats 500-1,000', hospitality: 'Accommodates 300-750' }, points: 0.75 },
      { value: '200-500', text: { church: 'Seats 200-500', hospitality: 'Accommodates 100-300' }, points: 0.5 },
      { value: '<200', text: { church: 'Seats less than 200', hospitality: 'Accommodates less than 100' }, points: 0.25 },
    ],
  },
  {
    text: "What is your role in the decision-making process?",
    category: "Alignment",
    options: [
      { value: 'final', text: { church: 'I am the final decision maker.', hospitality: 'I have final budgetary approval.' }, points: 1 },
      { value: 'influencer', text: { church: 'I am a key influencer/on the committee.', hospitality: 'I am a key influencer on the project.' }, points: 0.75 },
      { value: 'recommender', text: { church: 'I research and recommend solutions.', hospitality: 'I am the technical lead/event manager.' }, points: 0.5 },
      { value: 'research', text: { church: 'I am gathering information for my team.', hospitality: 'I am conducting initial research.' }, points: 0.25 },
    ],
  },
  {
    text: "How important is a long-term, low-maintenance solution?",
    category: "Alignment",
    options: [
      { value: 'critical', text: { church: 'Critical - Our volunteers are overwhelmed.', hospitality: 'Critical - We need reliability for back-to-back events.' }, points: 1 },
      { value: 'very', text: { church: 'Very important - We want to reduce costs.', hospitality: 'Very important - Downtime is not an option.' }, points: 0.75 },
      { value: 'somewhat', text: { church: 'Somewhat important, but not a top priority.', hospitality: 'We have a tech team, but less work is better.' }, points: 0.5 },
      { value: 'not', text: { church: 'Not a major factor for us.', hospitality: 'Our current maintenance plan is working.' }, points: 0.25 },
    ],
  },
  {
    text: "Which of these best describes your organization's view on technology?",
    category: "Alignment",
    options: [
      { value: 'leader', text: { church: 'We want to be a leader in using tech for ministry.', hospitality: 'We want to be known as a cutting-edge venue.' }, points: 1 },
      { value: 'investor', text: { church: 'We see technology as a key investment.', hospitality: 'We invest in tech that shows clear ROI.' }, points: 0.75 },
      { value: 'cautious', text: { church: 'We are cautious and practical with tech.', hospitality: 'We adopt new tech once it\'s proven.' }, points: 0.5 },
      { value: 'functional', text: { church: 'We use technology only when necessary.', hospitality: 'We prefer simple, functional solutions.' }, points: 0.25 },
    ],
  },
  // Impact (4 questions)
  {
    text: "What is the primary goal you hope to achieve with a new screen?",
    category: "Impact",
    options: [
      { value: 'enhance', text: { church: 'Enhance the worship experience.', hospitality: 'Create immersive, high-end event experiences.' }, points: 1 },
      { value: 'revenue', text: { church: 'Improve quality for livestream/broadcast.', hospitality: 'Increase event revenue and booking rates.' }, points: 1 },
      { value: 'reduce', text: { church: 'Reduce maintenance headaches and costs.', hospitality: 'Eliminate costly AV rentals and dependencies.' }, points: 0.75 },
      { value: 'edge', text: { church: 'Modernize our facility\'s look and feel.', hospitality: 'Gain a competitive edge over other venues.' }, points: 0.75 },
    ],
  },
  {
    text: "How much of an impact does your current AV have on your goals?",
    category: "Impact",
    options: [
      { value: 'major_blocker', text: { church: 'It\'s a major blocker to our ministry goals.', hospitality: 'It\'s actively costing us business.' }, points: 1 },
      { value: 'minor_hinderance', text: { church: 'It\'s a minor hindrance we work around.', hospitality: 'It limits the types of events we can book.' }, points: 0.75 },
      { value: 'neutral', text: { church: 'It gets the job done, but could be better.', hospitality: 'It\'s adequate, but not impressive.' }, points: 0.5 },
      { value: 'no_impact', text: { church: 'It has no real impact on our goals.', hospitality: 'It does not factor into our business goals.' }, points: 0.25 },
    ],
  },
    {
    text: "How do you plan to use the screen beyond main events?",
    category: "Impact",
    options: [
        { value: 'multi_use', text: { church: 'Youth events, conferences, community outreach.', hospitality: 'Digital signage, hybrid meetings, smaller breakouts.' }, points: 1 },
        { value: 'single_use', text: { church: 'Primarily for weekend worship services.', hospitality: 'Only for our main ballroom events.' }, points: 0.5 },
        { value: 'unsure_impact', text: { church: 'We haven\'t considered other uses yet.', hospitality: 'We are not sure about other applications.' }, points: 0.25 },
    ],
  },
  {
    text: "What would be the value of a 'wow' factor for your audience?",
    category: "Impact",
    options: [
        { value: 'game_changer', text: { church: 'Game-changer for engagement and outreach.', hospitality: 'A key selling point to attract premium clients.' }, points: 1 },
        { value: 'nice_to_have', text: { church: 'It would be nice, but substance matters more.', hospitality: 'It would be a good bonus feature.' }, points: 0.5 },
        { value: 'no_value', text: { church: 'We are not focused on a \'wow\' factor.', hospitality: 'Our clients are more focused on price.' }, points: 0.25 },
    ],
  },
];
