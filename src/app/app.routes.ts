import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'kitaplar',
    pathMatch: 'full'
  },
  {
    path: 'kitaplar',
    loadComponent: () =>
      import('./features/books/pages/books-list/books-list').then(m => m.BooksListComponent)
  },
  {
    path: 'kitaplar/ekle',
    loadComponent: () =>
      import('./features/books/pages/books-form/books-form').then(m => m.BooksFormComponent),
    canDeactivate: [() => import('./core/guards/unsaved-changes-guard').then(m => m.unsavedChangesGuard)]
  },
  {
    path: 'kitaplar/:id/duzenle',
    loadComponent: () =>
      import('./features/books/pages/books-form/books-form').then(m => m.BooksFormComponent),
    canDeactivate: [() => import('./core/guards/unsaved-changes-guard').then(m => m.unsavedChangesGuard)]
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/books/pages/dashboard/dashboard').then(m => m.DashboardComponent)
  },
  {
    path: '**',
    redirectTo: 'kitaplar'
  }
];