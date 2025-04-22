import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../../core/models/user.model';

@Pipe({
  name: 'name',
  standalone: true
})
export class NamePipe implements PipeTransform {
  transform(user: User | null): string {
    if (!user) return 'Kullanıcı';

    const full = `${user.first_name || ''} ${user.last_name || ''}`.trim();
    if (full) return full;

    if (user.email) return user.email.split('@')[0];

    return 'Kullanıcı';
  }
}
