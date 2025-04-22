import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private readonly apiUrl = `${environment.apiUrl}/aiflow/chat`;

  connectToChat(message: string, customPrompt: string = ''): Observable<string> {
    return new Observable<string>((observer) => {
      fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, custom_prompt: customPrompt })
      })
      .then((response) => {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        const read = async () => {
          if (!reader) return;

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.trim().startsWith('data: ')) {
                const content = line.slice(6);
                if (content === '{"done":true}') continue;
                observer.next(content);
              }
            }
          }

          observer.complete();
        };

        read();
      })
      .catch((err) => {
        observer.error('Bağlantı hatası');
      });
    });
  }
}
