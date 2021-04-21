import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UsersRoutingModule } from './users-routing.module';

@NgModule({
  imports: [
    UsersRoutingModule
  ],
  exports: [RouterModule],
})
export class UsersModule { }
