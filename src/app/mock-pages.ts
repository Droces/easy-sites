import { Page } from './page';
import { Section } from './section';
import { Group } from './group';
import { Block } from './block';

export const PAGES: Page[] = [
  {id: 1, title: 'Home', sections: [
    {id: 2, colourStyle: 'default', groups: [
      {id: 3, blocks: [
        {id: 4, content: "block"}
      ]}
    ]}
  ]}
];
