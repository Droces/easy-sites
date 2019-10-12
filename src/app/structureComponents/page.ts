import { Section } from './section';

export class Page {
  id: string; // ID of the page in the backend
  path: string;
  navWeight: number;
  title: string;
  sections: Section[];
}
