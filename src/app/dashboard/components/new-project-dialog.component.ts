import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-project-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="visible" class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-4">Nuevo Proyecto</h3>
        
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Nombre del proyecto</label>
          <input 
            [(ngModel)]="projectName" 
            placeholder="Ingresa el nombre del proyecto"
            class="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            (keyup.enter)="confirm()"
            #nameInput
          />
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Descripción (opcional)</label>
          <textarea 
            [(ngModel)]="projectDescription"
            placeholder="Describe brevemente tu proyecto"
            rows="3"
            class="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>
        
        <div class="flex justify-end gap-3">
          <button 
            (click)="cancel()"
            class="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button 
            (click)="confirm()"
            [disabled]="!projectName.trim()"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Crear Proyecto
          </button>
        </div>
      </div>
    </div>
  `
})
export class NewProjectDialog {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() projectCreated = new EventEmitter<{name: string, description?: string}>();
  
  projectName = '';
  projectDescription = '';

  cancel() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.resetForm();
  }

  confirm() {
    const name = this.projectName.trim();
    if (!name) return;
    
    this.projectCreated.emit({
      name,
      description: this.projectDescription.trim() || undefined
    });
    
    this.visible = false;
    this.visibleChange.emit(false);
    this.resetForm();
  }

  private resetForm() {
    this.projectName = '';
    this.projectDescription = '';
  }
}
