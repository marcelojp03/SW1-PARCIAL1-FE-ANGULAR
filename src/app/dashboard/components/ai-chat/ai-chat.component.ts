import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { AvatarModule } from 'primeng/avatar';
import { ChipModule } from 'primeng/chip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { AiService } from '../../../shared/services/ai.service';
import { ChatMessage, DiagramAction } from '../../../shared/interfaces/ai.interface';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TextareaModule,
    ScrollPanelModule,
    AvatarModule,
    ChipModule,
    ProgressSpinnerModule
  ],
  providers: [MessageService],
  templateUrl: './ai-chat.component.html',
  styleUrls: ['./ai-chat.component.scss']
})
export class AiChatComponent {
  @Output() diagramAction = new EventEmitter<DiagramAction>();
  @Input() projectId: string | null = null;

  isExpanded = false;
  currentMessage = '';
  isLoading = false;
  messages: ChatMessage[] = [];

  constructor(
    private aiService: AiService,
    private messageService: MessageService
  ) {}

  quickSuggestions = [
    'Crear clase Usuario',
    'Diagrama de e-commerce', 
    'Agregar relaciones',
    'Sistema de blog'
  ];

  toggleChat(): void {
    this.isExpanded = !this.isExpanded;
  }

  sendMessage(): void {
    if (!this.currentMessage.trim() || this.isLoading || !this.projectId) return;

    // Add user message
    const userMessage = this.aiService.createUserMessage(this.currentMessage);
    this.messages.push(userMessage);
    
    const messageContent = this.currentMessage;
    this.currentMessage = '';
    this.isLoading = true;

    // Call AI service
    this.handleAiRequest(this.projectId, messageContent);
  }

  private async handleAiRequest(projectId: string, message: string): Promise<void> {
    try {
      const response = await this.aiService.sendChatMessage(projectId, message);
      this.isLoading = false;

      if (response && response.success) {
        // Add AI success response
        const aiMessage = this.aiService.createAiMessage(
          response.message || 'Modelo actualizado por IA'
        );
        this.messages.push(aiMessage);

        // Emit diagram update action
        if (response.data) {
          this.diagramAction.emit({
            type: 'ai_update_diagram',
            data: {
              canonical: response.data.canonical,
              syncfusion: response.data.syncfusion
            }
          });
        }

        // Show success message
        this.messageService.add({
          severity: 'success',
          summary: 'AI Assistant',
          detail: 'Modelo actualizado exitosamente',
          life: 3000
        });

      } else {
        this.handleAiError(response?.message || 'Error desconocido');
      }

    } catch (error: any) {
      this.isLoading = false;
      const errorMessage = this.aiService.getErrorMessage(error);
      this.handleAiError(errorMessage);
    }
  }

  private handleAiError(errorMessage: string): void {
    // Add AI error response
    const aiMessage = this.aiService.createAiMessage(
      `❌ ${errorMessage}. ¿Puedes intentar de otra manera?`
    );
    this.messages.push(aiMessage);

    // Show error message
    this.messageService.add({
      severity: 'error',
      summary: 'AI Assistant',
      detail: errorMessage,
      life: 5000
    });
  }

  selectSuggestion(suggestion: string): void {
    this.currentMessage = suggestion;
    this.sendMessage();
  }

  handleEnter(event: Event): void {
    const keyEvent = event as KeyboardEvent;
    if (keyEvent.key === 'Enter' && !keyEvent.shiftKey) {
      keyEvent.preventDefault();
      this.sendMessage();
    }
  }



  formatTime(date: Date): string {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
}