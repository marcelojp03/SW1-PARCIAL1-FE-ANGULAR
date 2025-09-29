// dashboard/components/unsaved-changes-dialog/unsaved-changes-dialog.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

export interface UnsavedChangesResult {
  action: 'save' | 'discard' | 'cancel';
}

@Component({
  selector: 'app-unsaved-changes-dialog',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './unsaved-changes-dialog.component.html',
  styleUrl: './unsaved-changes-dialog.component.scss'
})
export class UnsavedChangesDialog {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() result = new EventEmitter<UnsavedChangesResult>();

  onSave() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.result.emit({ action: 'save' });
  }

  onDiscard() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.result.emit({ action: 'discard' });
  }

  onCancel() {
    this.visible = false;
    this.visibleChange.emit(false);
    this.result.emit({ action: 'cancel' });
  }
}