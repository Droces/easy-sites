import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageComponent } from './structureComponents/page/page.component';
import { HomeComponent } from './home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SettingsPageComponent } from './settings-page/settings-page.component';
import { TemplatesPageComponent } from './templates-page/templates-page.component';
import { UsersPageComponent } from './users-page/users-page.component';

const routes: Routes = [
  // { path: '', redirectTo: '/page/1', pathMatch: 'full' },
  { path: '', component: HomeComponent },
  { path: 'page/:path', component: PageComponent },
  { path: 'settings', component: SettingsPageComponent },
  { path: 'templates', component: TemplatesPageComponent },
  { path: 'users', component: UsersPageComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
