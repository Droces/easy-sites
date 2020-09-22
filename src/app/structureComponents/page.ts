import { Section } from './section';

interface PageState {
  [key: string]: any
}

export class Page {
  id: string; // ID of the page in the backend
  path: string;
  navWeight: number;
  title: string;
  sections: Section[];
  state: PageState;
  parent: string; // IDs of the parent page
}
