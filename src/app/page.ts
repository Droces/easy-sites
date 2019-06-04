import { Section } from './section';

export class Page {
  id: number;
  be_id: string; // ID of the page in the backend
  title: string;
  sections: Section[];
}
