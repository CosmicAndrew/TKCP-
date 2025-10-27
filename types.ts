
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

export interface Question {
  text: string;
  category: 'Readiness' | 'Alignment' | 'Impact';
  options: QuestionOption[];
}

export interface Answer {
  value: string;
  points: number;
}

export interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
}
