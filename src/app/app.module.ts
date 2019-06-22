import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { PageComponent }        from './structureComponents/page/page.component';
import { SectionComponent }     from './structureComponents/section/section.component';
import { GroupComponent }       from './structureComponents/group/group.component';

import { TextBlockComponent }   from './structureComponents/blocks/text-block/text-block.component';
import { ImageBlockComponent }  from './structureComponents/blocks/image-block/image-block.component';
import { LineBlockComponent }   from './structureComponents/blocks/line-block/line-block.component';

import { HomeComponent }          from './home.component';
import { PagesListComponent }     from './pages-list/pages-list.component';
import { PageNotFoundComponent }  from './page-not-found/page-not-found.component';
import { PrimaryNavComponent }    from './primary-nav/primary-nav.component';
import { ThemeSelectorComponent } from './theme-selector/theme-selector.component';
import { SettingsPageComponent }  from './settings-page/settings-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageComponent,
    SectionComponent,
    GroupComponent,
    TextBlockComponent,
    PagesListComponent,
    PageNotFoundComponent,
    PrimaryNavComponent,
    ThemeSelectorComponent,
    SettingsPageComponent,
    ImageBlockComponent,
    LineBlockComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CKEditorModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
