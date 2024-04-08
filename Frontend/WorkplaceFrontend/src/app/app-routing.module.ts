import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkspaceComponent } from './components/workspace/workspace.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { ChatroomComponent } from './components/chatroom/chatroom.component';
import { LoginpageComponent } from './components/loginpage/loginpage.component';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'home', component: HomepageComponent },
  { path: 'login', component: LoginpageComponent },
  { path: 'chat/room/:roomId', component: ChatroomComponent, canActivate: [AuthGuardService] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
