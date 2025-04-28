import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private readonly API_URL = `${environment.apiUrl}/aiflow/chat`;

  constructor(private tokenService: TokenService) {}

  connectToChat(userMessage: string, customPrompt: string = '', sessionId: string): Observable<string> {
    return new Observable<string>((observer) => {
      const token = this.tokenService.token;

      fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          data: {
            message: userMessage,
            customPrompt,
            sessionId
          }
        })
      })
        .then(response => {
          if (!response.ok) {
            observer.error('Sunucu hatası: ' + response.statusText);
            return;
          }

          const reader = response.body?.getReader();
          const decoder = new TextDecoder();

          const read = async () => {
            if (!reader) return;

            try {
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
            } catch (err) {
              observer.error('Veri okuma hatası: ' + (err instanceof Error ? err.message : 'Bilinmeyen hata'));
            }
          };

          read();
        })
        .catch(err => {
          observer.error('Bağlantı hatası: ' + (err?.message || 'Bilinmeyen hata'));
        });
    });
  }
}
