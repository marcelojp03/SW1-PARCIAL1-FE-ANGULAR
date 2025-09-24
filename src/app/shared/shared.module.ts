import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from './primeng.module';
import { SyncfusionModule } from './syncfusion.module';

@NgModule({
  declarations: [   
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
    SyncfusionModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    SyncfusionModule
  ],
})
export class SharedModule {}
