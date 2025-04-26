import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatbotService } from '../../../../core/services/chatbot.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-chatbot-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-chatbot-widget.component.html',
  styleUrls: ['./customer-chatbot-widget.component.scss'],
})
export class CustomerChatbotWidgetComponent {
  @Input() customPrompt: string = ''; // <-- dışarıdan özel prompt al
  isOpen = false;
  userMessage = '';
  messages: { type: 'user' | 'bot'; content: string }[] = [];
  loading = false;
  sessionId: string = this.generateSessionId(); // <-- session ID üretildi

  constructor(private chatbotService: ChatbotService) {}

  toggleChatbot(): void {
    this.isOpen = !this.isOpen;
  }

  sendMessage(): void {
    const message = this.userMessage.trim();
    if (!message) return;

    this.messages.push({ type: 'user', content: message });
    this.userMessage = '';
    this.loading = true;

    // Burada artık sessionId'yi de gönderiyoruz!
    this.chatbotService.connectToChat(message, this.customPrompt, this.sessionId).subscribe({
      next: (chunk) => {
        const last = this.messages[this.messages.length - 1];
        if (last?.type === 'bot') {
          last.content += chunk;
        } else {
          this.messages.push({ type: 'bot', content: chunk });
        }
      },
      complete: () => {
        this.loading = false;
      },
      error: () => {
        this.messages.push({ type: 'bot', content: 'Bir hata oluştu.' });
        this.loading = false;
      }
    });
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}
