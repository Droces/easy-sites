import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Page } from './page';
import { Section } from './section';
import { Group } from './group';
import { BlockInterface } from './block-interface';

@Component({
  selector: 'app-structure-component-base'
})
export class StructureComponentBase implements OnInit {
  @Input() section: Section;
  @Input() sectionsInPage: number;

  @Output() moveUp = new EventEmitter();
  @Output() moveDown = new EventEmitter();
  @Output() remove = new EventEmitter();

  isActive: boolean = false;

  constructor() { }

  ngOnInit() { }

  up(): void {
    this.moveUp.emit(this.section);
  }

  down(): void {
    this.moveDown.emit(this.section);
  }

  toggleActive(isActive: boolean): void {
    this.isActive = isActive;
  }

  removeSelf(): void {
    this.remove.emit(this.section);
  }
}
