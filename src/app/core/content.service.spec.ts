import { TestBed } from '@angular/core/testing';

import { PROFILE } from '../data/profile';
import { ContentService } from './content.service';

describe('ContentService', () => {
  let content: ContentService;

  beforeEach(() => {
    localStorage.removeItem('jl.content.draft');
    TestBed.resetTestingModule();
    content = TestBed.inject(ContentService);
  });

  afterEach(() => localStorage.removeItem('jl.content.draft'));

  it('usa los valores por defecto del perfil', () => {
    expect(content.name()).toBe(PROFILE.name);
    expect(content.email()).toBe(PROFILE.email);
    expect(content.cvUrl()).toBe(PROFILE.cvUrl);
    expect(content.photo()).toBe(PROFILE.photo);
    expect(content.hasDraft()).toBeFalse();
  });

  it('parte el nombre para la portada', () => {
    expect(content.nameParts()).toEqual({ first: 'Jose', rest: 'Matos' });
  });

  it('aplica el borrador y lo guarda en el navegador', () => {
    content.saveDraft({ name: 'Nombre de prueba', cvUrl: 'https://drive.google.com/file/d/123/view' });

    expect(content.name()).toBe('Nombre de prueba');
    expect(content.cvUrl()).toBe('https://drive.google.com/file/d/123/view');
    expect(content.hasDraft()).toBeTrue();
    expect(localStorage.getItem('jl.content.draft')).toContain('Nombre de prueba');
  });

  it('descarta el borrador y vuelve a los valores por defecto', () => {
    content.saveDraft({ name: 'Nombre de prueba' });
    content.clearDraft();

    expect(content.name()).toBe(PROFILE.name);
    expect(localStorage.getItem('jl.content.draft')).toBeNull();
  });

  it('reemplaza el enlace de una red y deja las demás como están', () => {
    content.saveDraft({ socials: { github: 'https://github.com/otro' } });
    const socials = content.socials();

    expect(socials.find((social) => social.id === 'github')?.url).toBe('https://github.com/otro');
    expect(socials.find((social) => social.id === 'linkedin')?.url).toContain('linkedin.com');
  });

  it('ignora los párrafos vacíos de "Sobre mí"', () => {
    content.saveDraft({ about: { es: ['  ', ''], en: [] } });
    expect(content.aboutParagraphs().length).toBeGreaterThan(0);
  });
});
