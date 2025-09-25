// dashboard/components/new-project-dialog/new-project-dialog.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-project-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-project-dialog.component.html',
  styleUrl: './new-project-dialog.component.scss'
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