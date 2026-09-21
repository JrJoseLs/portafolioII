import { TestBed } from '@angular/core/testing';

import { App } from './app';
import { SECTIONS } from './core/sections';

describe('App', () => {
  beforeEach(() => TestBed.configureTestingModule({ imports: [App] }));

  it('se crea', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renderiza todas las secciones de la navegación', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    for (const section of SECTIONS) {
      expect(element.querySelector(`section#${section.id}`)).withContext(section.id).not.toBeNull();
    }
  });

  it('abre el buscador de comandos con Ctrl + K', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
    await fixture.whenStable();
    const dialog = (fixture.nativeElement as HTMLElement).querySelector('dialog');
    expect(dialog?.open).toBeTrue();
    dialog?.close();
  });
});
