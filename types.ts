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
    title: string;
    points: string[];
    footer: string;
}

export interface Question {
  text: string;
  category: 'Pain Scale' | 'Project Scoping' | 'Timeline' | 'Budget Authority' | 'Impact';
  options: QuestionOption[];
  visual?: 'two-paths';
  paths?: {
      left: PathDetail;
      right: PathDetail;
  };
}

export interface Answer {
  value: string;
  points: number;
}

export interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    city: string;
    state: string;
}