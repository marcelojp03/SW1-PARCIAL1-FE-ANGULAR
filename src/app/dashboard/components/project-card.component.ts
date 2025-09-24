import { Component, Input } from '@angular/core';

@Component({
  selector: 'dashboard-project-card',
  standalone: true,
  template: `
    <div class="p-3 bg-white dark:bg-gray-800 rounded shadow">
      <h4 class="font-semibold">{{name}}</h4>
      <div class="text-sm text-gray-500">Última: --</div>
    </div>
  `
})
export class DashboardProjectCard { @Input() name = 'Proyecto'; }
