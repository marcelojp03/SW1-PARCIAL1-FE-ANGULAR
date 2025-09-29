// dashboard/components/edit-project-dialog/edit-project-dialog.component.ts
import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { Project } from '../../../shared/services/project.service';

@Component({
  selector: 'edit-project-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule],
  template: `
    <p-dialog 
      [(visible)]="visible" 
      [modal]="true" 
      [style]="{width: '450px'}" 
      header="Editar Proyecto"
      [closable]="true"
      [draggable]="false"
      [resizable]="false"
      (onHide)="onCancel()">
      
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="field">
          <label for="projectName" class="block text-900 font-medium mb-2">Nombre del Proyecto</label>
          <input 
            id="projectName"
            type="text" 
            pInputText 
            formControlName="name"
            class="w-full"
            placeholder="Ingresa el nombre del proyecto"
          />
          <small *ngIf="form.get('name')?.invalid && form.get('name')?.touched" class="p-error">
            El nombre es requerido
          </small>
        </div>
        
        <div class="field">
          <label for="projectDescription" class="block text-900 font-medium mb-2">Descripción (Opcional)</label>
          <textarea 
            id="projectDescription"
            pInputTextarea 
            formControlName="description"
            [rows]="3"
            class="w-full"
            placeholder="Describe brevemente tu proyecto">
          </textarea>
        </div>
      </form>
      
      <ng-template pTemplate="footer">
        <p-button 
          label="Cancelar" 
          icon="pi pi-times" 
          [text]="true"
          severity="secondary"
          (click)="onCancel()" />
        <p-button 
          label="Actualizar" 
          icon="pi pi-check"
          (click)="onSubmit()" 
          [loading]="loading"
          [disabled]="form.invalid" />
      </ng-template>
    </p-dialog>
  `
})
export class EditProjectDialog implements OnChanges {
  @Input() visible = false;
  @Input() project: Project | null = null;
  @Input() loading = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() projectUpdate = new EventEmitter<{name: string, description?: string}>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['project'] && this.project) {
      // Actualizar formulario con datos del proyecto
      this.form.patchValue({
        name: this.project.name,
        description: this.project.description || ''
      });
    }
    
    if (changes['visible']) {
      this.visibleChange.emit(this.visible);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      this.projectUpdate.emit({
        name: formValue.name,
        description: formValue.description || undefined
      });
    }
  }

  onCancel() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.cancel.emit();
  }
}