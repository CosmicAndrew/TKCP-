export enum Sector {
  Church = 'church',
  Hospitality = 'hospitality',
}

export type LeadStatus = 'hot' | 'warm' | 'cold';

export interface QuestionOption {
  value: string;
  text: { [key in Sector]: string };
  points: number;
  tooltip?: { [key in Sector]: string };
}

export interface PathDetail {
    title: { [key in Sector]: string };
    points: { [key in Sector]: string[] };
    footer: { [key in Sector]: string };
}

export interface Question {
  text: (sector: Sector) => string;
  category: string;
  options: QuestionOption[];
  visual?: 'two-paths';
  paths?: PathDetail;
}

export interface Answer {
  value: string;
  points: number;
}

export interface UserData {
    // From main contact form
    firstName?: string;
    lastName?: string;
    phone?: string;
    city?: string;
    state?: string;
    // from progressive/gatekeeper forms
    email?: string;
    fullName?: string;
    organizationType?: string;
}

export interface Result {
    userData: Partial<UserData>;
    leadStatus: LeadStatus;
    score: number;
    answers: { [key: number]: Answer };
}