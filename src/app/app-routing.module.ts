import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentComponent } from './Pages/student/student.component';

const routes: Routes = [
  {
    path: 'Student',
    component: StudentComponent,
  },
  { path: '**', pathMatch: 'full', redirectTo: 'Student' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
