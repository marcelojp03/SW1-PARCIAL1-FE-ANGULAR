// dashboard/components/project-card/project-card.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'dashboard-project-card',
  standalone: true,
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss'
})
export class DashboardProjectCard { 
  @Input() name = 'Proyecto'; 
}