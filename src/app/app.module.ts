import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms'; // <-- NgModel lives here

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageComponent } from './page/page.component';
import { SectionComponent } from './section/section.component';
import { GroupComponent } from './group/group.component';
import { BlockComponent } from './block/block.component';
import { PagesListComponent } from './pages-list/pages-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PrimaryNavComponent } from './primary-nav/primary-nav.component';
import { ThemeSelectorComponent } from './theme-selector/theme-selector.component';

@NgModule({
  declarations: [
    AppComponent,
    PageComponent,
    SectionComponent,
    GroupComponent,
    BlockComponent,
    PagesListComponent,
    PageNotFoundComponent,
    PrimaryNavComponent,
    ThemeSelectorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
