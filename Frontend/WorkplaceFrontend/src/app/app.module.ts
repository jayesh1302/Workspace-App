import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { HttpClientModule } from '@angular/common/http'; 
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { ChatroomComponent } from './components/chatroom/chatroom.component';
import { LoginpageComponent } from './components/loginpage/loginpage.component';
import { FormsModule } from '@angular/forms';
import { SummarizeModalComponent } from './components/summarize-modal/summarize-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    RoomsComponent,
    WorkspaceComponent,
    NavbarComponent,
    ChatroomComponent,
    HomepageComponent,
    LoginpageComponent,
    SummarizeModalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
