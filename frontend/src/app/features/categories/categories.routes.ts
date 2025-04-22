import { Routes } from '@angular/router';

export const CATEGORIES_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./components/categories-list/categories-list.component').then(m => m.CategoriesListComponent),
    },
    {
        path: 'create',
        loadComponent: () =>
            import('./components/category-form/category-form.component').then(m => m.CategoryFormComponent),
    },
    {
        path: 'edit/:id',
        loadComponent: () =>
            import('./components/category-form/category-form.component').then(m => m.CategoryFormComponent),
    }
];
