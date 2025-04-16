// src/app/shared/directives/has-role.directive.ts
import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Directive({
  selector: '[hasRole]'
})
export class HasRoleDirective implements OnInit {
  @Input('hasRole') roles!: string[]; // Örn. *hasRole="['ADMIN','SUPER_ADMIN']"

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.viewContainer.clear();
    const userHasAccess = this.roles.some((role) => this.authService.hasRole(role));
    if (userHasAccess) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
