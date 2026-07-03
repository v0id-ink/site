export type GalleryItem = {
  name?: string;
  file: string;
};

function isExternal(file: string): boolean {
  return file.startsWith('https://');
}

function baseName(file: string): string {
  const name = file.split('/').pop() || file;
  return name.replace(/\.[^.]+$/, '');
}

export function imgSrc(file: string): string {
  return isExternal(file) ? file : `/images/${file}`;
}

export function thumbSrc(file: string): string {
  return isExternal(file) ? file : `/images/thumb/${baseName(file)}.webp`;
}

export function fullSrc(file: string): string {
  return isExternal(file) ? file : `/images/full/${baseName(file)}.webp`;
}
