import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/components/dashboard/dashboard.component';
import { LayoutsComponent } from './pages/layouts/layouts.component';
import { LedgersComponent } from './pages/components/ledgers/ledgers.component';
import { ItemsComponent } from './pages/components/items/items.component';
import { CustomerCategoryComponent } from './pages/components/customer-category/customer-category.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { ItemAddComponent } from './pages/components/item-add/item-add.component';
import { RegisterComponent } from './pages/register/register.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [
    AppComponent,
    CustomerCategoryComponent,
    DashboardComponent,
    ItemAddComponent,
    LoginComponent,
    LayoutsComponent,
    LedgersComponent,
    ItemsComponent
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NgSelectModule,
    NgxDatatableModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgbModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
