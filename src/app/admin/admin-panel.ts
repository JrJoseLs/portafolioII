import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterRenderEffect,
  computed,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';

import { ContentService } from '../core/content.service';
import { UI_STRINGS } from '../core/i18n/ui-strings';
import { ContentOverrides } from '../data/content-overrides';
import { PROFILE, SOCIAL_LINKS } from '../data/profile';
import { Icon } from '../shared/icon/icon';

interface FormState {
  name: string;
  headlineEs: string;
  headlineEn: string;
  locationEs: string;
  locationEn: string;
  email: string;
  cvUrl: string;
  photo: string;
  aboutEs: string;
  aboutEn: string;
  socials: Record<string, string>;
}

/** Tamaño de la foto guardada dentro de content.json. */
const PHOTO_SIZE = 512;
/** A partir de aquí conviene guardar la foto como archivo en vez de dentro del JSON. */
const PHOTO_WARNING_BYTES = 300_000;

/**
 * Panel de edición privado (se abre con `#admin`).
 *
 * El sitio es estático y se publica en GitHub Pages, así que no hay servidor ni
 * base de datos donde guardar los cambios: este panel los guarda en tu
 * navegador para que los veas al instante y genera un `content.json` que se
 * sube a `public/` para publicarlos. No expone nada: todo lo que se edita aquí
 * es información que ya es pública en el sitio.
 */
@Component({
  selector: 'app-admin-panel',
  imports: [Icon],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPanel {
  /** Se emite al cerrar el panel. */
  readonly closed = output<void>();

  private readonly content = inject(ContentService);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  protected readonly socialLinks = SOCIAL_LINKS;
  protected readonly form = signal<FormState>(this.readCurrentValues());
  protected readonly saved = signal(false);
  protected readonly photoWarning = computed(() => this.form().photo.length > PHOTO_WARNING_BYTES);
  protected readonly hasDraft = this.content.hasDraft;

  /** Valores por defecto, para mostrarlos como marcador de posición. */
  protected readonly defaults = {
    name: PROFILE.name,
    headlineEs: PROFILE.headline.es,
    headlineEn: PROFILE.headline.en,
    locationEs: UI_STRINGS.es.hero.location,
    locationEn: UI_STRINGS.en.hero.location,
    email: PROFILE.email,
    cvUrl: PROFILE.cvUrl,
  };

  constructor() {
    afterRenderEffect(() => {
      const dialog = this.dialog().nativeElement;
      if (!dialog.open) dialog.showModal();
    });
  }

  protected update<K extends keyof FormState>(key: K, value: FormState[K]): void {
    this.form.update((form) => ({ ...form, [key]: value }));
    this.saved.set(false);
  }

  protected updateSocial(id: string, url: string): void {
    this.form.update((form) => ({ ...form, socials: { ...form.socials, [id]: url } }));
    this.saved.set(false);
  }

  /** Aplica los cambios al sitio y los guarda en este navegador. */
  protected save(): void {
    this.content.saveDraft(this.buildOverrides());
    this.saved.set(true);
  }

  /** Descarga el archivo que hay que subir a `public/content.json`. */
  protected downloadJson(): void {
    this.save();
    const json = JSON.stringify(this.buildOverrides(), null, 2);
    this.download(new Blob([json], { type: 'application/json' }), 'content.json');
  }

  /** Descarga la foto recortada, por si prefieres guardarla en `public/images/`. */
  protected downloadPhoto(): void {
    const photo = this.form().photo;
    if (!photo.startsWith('data:')) return;
    this.download(dataUrlToBlob(photo), 'profile.webp');
  }

  protected async onPhotoSelected(input: HTMLInputElement): Promise<void> {
    const file = input.files?.[0];
    if (!file) return;
    this.update('photo', await toSquareWebp(file, PHOTO_SIZE));
    input.value = '';
  }

  protected removePhoto(): void {
    this.update('photo', '');
  }

  /** Descarta los cambios locales y vuelve al contenido publicado. */
  protected reset(): void {
    this.content.clearDraft();
    this.form.set(this.readCurrentValues());
    this.saved.set(false);
  }

  protected close(): void {
    this.dialog().nativeElement.close();
    this.closed.emit();
  }

  /** Solo se guarda lo que cambia respecto a los valores por defecto. */
  private buildOverrides(): ContentOverrides {
    const form = this.form();
    const overrides: ContentOverrides = {};
    const set = <K extends keyof ContentOverrides>(key: K, value: ContentOverrides[K], isDefault: boolean) => {
      if (!isDefault) overrides[key] = value;
    };

    set('name', form.name.trim(), !form.name.trim() || form.name.trim() === this.defaults.name);
    set('email', form.email.trim(), !form.email.trim() || form.email.trim() === this.defaults.email);
    set('cvUrl', form.cvUrl.trim(), !form.cvUrl.trim() || form.cvUrl.trim() === this.defaults.cvUrl);
    set('photo', form.photo, !form.photo || form.photo === PROFILE.photo);

    const headline = { es: form.headlineEs.trim(), en: form.headlineEn.trim() };
    set('headline', headline, headline.es === this.defaults.headlineEs && headline.en === this.defaults.headlineEn);

    const location = { es: form.locationEs.trim(), en: form.locationEn.trim() };
    set('location', location, location.es === this.defaults.locationEs && location.en === this.defaults.locationEn);

    const about = { es: toParagraphs(form.aboutEs), en: toParagraphs(form.aboutEn) };
    const defaultAbout = UI_STRINGS.es.about.paragraphs.join('|') + UI_STRINGS.en.about.paragraphs.join('|');
    set('about', about, about.es.join('|') + about.en.join('|') === defaultAbout);

    const socials: Record<string, string> = {};
    for (const link of SOCIAL_LINKS) {
      const url = form.socials[link.id]?.trim();
      if (url && url !== link.url) socials[link.id] = url;
    }
    set('socials', socials, !Object.keys(socials).length);

    return overrides;
  }

  private readCurrentValues(): FormState {
    const overrides = this.content.overrides();
    return {
      name: overrides.name ?? PROFILE.name,
      headlineEs: overrides.headline?.es ?? PROFILE.headline.es,
      headlineEn: overrides.headline?.en ?? PROFILE.headline.en,
      locationEs: overrides.location?.es ?? UI_STRINGS.es.hero.location,
      locationEn: overrides.location?.en ?? UI_STRINGS.en.hero.location,
      email: overrides.email ?? PROFILE.email,
      cvUrl: overrides.cvUrl ?? PROFILE.cvUrl,
      photo: overrides.photo ?? PROFILE.photo,
      aboutEs: (overrides.about?.es ?? UI_STRINGS.es.about.paragraphs).join('\n\n'),
      aboutEn: (overrides.about?.en ?? UI_STRINGS.en.about.paragraphs).join('\n\n'),
      socials: Object.fromEntries(SOCIAL_LINKS.map((link) => [link.id, overrides.socials?.[link.id] ?? link.url])),
    };
  }

  private download(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }
}

/** Divide el texto en párrafos usando las líneas en blanco. */
function toParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim().replace(/\s*\n\s*/g, ' '))
    .filter(Boolean);
}

/** Recorta la imagen a un cuadrado centrado y la convierte a WebP. */
async function toSquareWebp(file: File, size: number): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  context?.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, size, size);
  bitmap.close();
  return canvas.toDataURL('image/webp', 0.85);
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(',');
  const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
  return new Blob([bytes], { type: header.slice(5, header.indexOf(';')) });
}
