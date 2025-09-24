import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="visible" class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 max-w-md mx-4">
        <div class="flex items-center mb-4">
          <span *ngIf="icon" class="text-2xl mr-3">{{ icon }}</span>
          <h3 class="text-lg font-semibold">{{ title || 'Confirmar' }}</h3>
        </div>
        
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          {{ message || '¿Estás seguro de que quieres continuar?' }}
        </p>
        
        <div class="flex justify-end gap-3">
          <button 
            (click)="cancel()"
            class="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {{ cancelText || 'Cancelar' }}
          </button>
          <button 
            (click)="confirm()"
            [class]="confirmButtonClass"
          >
            {{ confirmText || 'Confirmar' }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class ConfirmDialog {
  @Input() visible = false;
  @Input() title = '';
  @Input() message = '';
  @Input() icon = '';
  @Input() confirmText = 'Confirmar';
  @Input() cancelText = 'Cancelar';
  @Input() severity: 'info' | 'warning' | 'danger' | 'success' = 'info';
  
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  get confirmButtonClass(): string {
    const base = 'px-4 py-2 text-white rounded-md ';
    switch (this.severity) {
      case 'danger':
        return base + 'bg-red-600 hover:bg-red-700';
      case 'warning':
        return base + 'bg-yellow-600 hover:bg-yellow-700';
      case 'success':
        return base + 'bg-green-600 hover:bg-green-700';
      default:
        return base + 'bg-blue-600 hover:bg-blue-700';
    }
  }

  cancel() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.cancelled.emit();
  }

  confirm() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.confirmed.emit();
  }
}
