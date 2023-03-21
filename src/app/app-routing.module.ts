import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/components/dashboard/dashboard.component';
import { ItemsComponent } from './pages/components/items/items.component';
import { ItemCategoryComponent } from './pages/components/item-category/item-category.component';
import { LedgersComponent } from './pages/components/ledgers/ledgers.component';
import { LayoutsComponent } from './pages/layouts/layouts.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';


const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full'
  },
  {
    path: 'main',
    component: LayoutsComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      
      {
        path: 'ledgers',
        component: LedgersComponent,
      },
      
      {
        path: 'items',
        component: ItemsComponent,
      },
      {
        path: 'item-category',
        component: ItemCategoryComponent,
      },
    ]
  },
  {
    path: 'register',
    component: RegisterComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
