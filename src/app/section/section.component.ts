import { Component, OnInit, Input } from '@angular/core';

import { Section } from '../section';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit {
  @Input() section: Section;

  constructor() { }

  ngOnInit() {
  }

  addGroup(): void {
    this.section.groups.push({id: Date.now(), blocks: []});
  }

  removeLastGroup(): void {
    this.section.groups.pop();
  }

  changeColour(): void {
    switch (this.section.colourStyle) {
      case 'default': {
        this.section.colourStyle = "blue";
        break;
      }
      case 'blue': {
        this.section.colourStyle = "default";
        break;
      }
    }
  }
}
