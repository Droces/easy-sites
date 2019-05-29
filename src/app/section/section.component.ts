import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Section } from '../section';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit {
  @Input() section: Section;

  // An event emitter
  @Output() moveUp = new EventEmitter();
  @Output() moveDown = new EventEmitter();

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

  up(): void {
    this.moveUp.emit(this.section);
  }

  down(): void {
    this.moveDown.emit(this.section);
  }
}
