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
import { MessageCardComponent } from './components/message-card/message-card.component';
import { CancelModalComponent } from './components/cancel-modal/cancel-modal.component';
import { ControlPanelComponent } from './components/control-panel/control-panel.component';
import { AddRoomModalComponent } from './components/add-room-modal/add-room-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChatbotWorkspaceComponent } from './components/chatbot-workspace/chatbot-workspace.component';
import { AttachModalComponent } from './components/attach-modal/attach-modal.component';


@NgModule({
  declarations: [
    AppComponent,
    RoomsComponent,
    WorkspaceComponent,
    NavbarComponent,
    ChatroomComponent,
    HomepageComponent,
    LoginpageComponent,
    SummarizeModalComponent,
    MessageCardComponent,
    CancelModalComponent,
    ControlPanelComponent,
    AddRoomModalComponent,
    ChatbotWorkspaceComponent,
    AttachModalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
