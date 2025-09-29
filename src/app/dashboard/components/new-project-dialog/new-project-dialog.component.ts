// dashboard/components/new-project-dialog/new-project-dialog.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-new-project-dialog',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './new-project-dialog.component.html',
  styleUrl: './new-project-dialog.component.scss'
})
export class NewProjectDialog {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() projectCreated = new EventEmitter<{name: string, description?: string}>();
  
  projectName = '';
  projectDescription = '';
  loading = false;

  cancel() {
    if (this.loading) return; // Prevenir cancelar durante loading
    this.visible = false;
    this.visibleChange.emit(false);
    this.resetForm();
  }

  confirm() {
    const name = this.projectName.trim();
    if (!name || this.loading) return;
    
    this.loading = true;
    
    this.projectCreated.emit({
      name,
      description: this.projectDescription.trim() || undefined
    });
    
    // Reset después de un pequeño delay para mostrar el loading
    setTimeout(() => {
      this.loading = false;
      this.visible = false;
      this.visibleChange.emit(false);
      this.resetForm();
    }, 500);
  }

  private resetForm() {
    this.projectName = '';
    this.projectDescription = '';
    this.loading = false;
  }
}