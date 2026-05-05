export interface ParsedSegment {
  text: string;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  obfuscated?: boolean;
}

const colorMap: Record<string, string> = {
  '0': '#000000',
  '1': '#0000AA',
  '2': '#00AA00',
  '3': '#00AAAA',
  '4': '#AA0000',
  '5': '#AA00AA',
  '6': '#FFAA00',
  '7': '#AAAAAA',
  '8': '#555555',
  '9': '#5555FF',
  'a': '#55FF55',
  'b': '#55FFFF',
  'c': '#FF5555',
  'd': '#FF55FF',
  'e': '#FFFF55',
  'f': '#FFFFFF',
};

const hexRegex = /^#([A-Fa-f0-9]{6})$/;

export function parseMinecraftText(input: string): ParsedSegment[] {
  const segments: ParsedSegment[] = [];
  let current: ParsedSegment = { text: '' };
  
  let i = 0;
  while (i < input.length) {
    if ((input[i] === '§' || input[i] === '&') && i + 1 < input.length) {
      if (current.text) {
        segments.push({ ...current });
      }
      
      const code = input[i + 1].toLowerCase();
      
      if (code === 'r') {
        current = { text: '' };
      } else if (code === 'l') {
        current = { ...current, text: '', bold: true };
      } else if (code === 'o') {
        current = { ...current, text: '', italic: true };
      } else if (code === 'n') {
        current = { ...current, text: '', underline: true };
      } else if (code === 'm') {
        current = { ...current, text: '', strikethrough: true };
      } else if (code === 'k') {
        current = { ...current, text: '', obfuscated: true };
      } else if (code === 'x' && i + 13 < input.length) {
        const hex = input.slice(i + 2, i + 14);
        if (hexRegex.test('#' + hex)) {
          current = { ...current, text: '', color: '#' + hex };
          i += 13;
        } else {
          current = { ...current, text: '' };
          i++;
        }
      } else if (code in colorMap) {
        current = { ...current, text: '', color: colorMap[code] };
      } else {
        current = { ...current, text: '' };
      }
      
      i += 2;
    } else if (input[i] === '\\' && input[i + 1] === 'n') {
      if (current.text) {
        segments.push({ ...current });
      }
      segments.push({ text: '\n', color: 'transparent' });
      current = { text: '' };
      i += 2;
    } else if (input[i] === '\n') {
      if (current.text) {
        segments.push({ ...current });
      }
      segments.push({ text: '\n', color: 'transparent' });
      current = { text: '' };
      i++;
    } else {
      current.text += input[i];
      i++;
    }
  }
  
  if (current.text) {
    segments.push(current);
  }
  
  return segments.length ? segments : [{ text: input }];
}

export function segmentsToHtml(segments: ParsedSegment[]): string {
  return segments.map(seg => {
    if (seg.text === '\n') return '<br>';
    
    let classes = '';
    let style = '';
    
    if (seg.color) style += `color: ${seg.color};`;
    if (seg.bold) classes += 'mc-format-bold ';
    if (seg.italic) classes += 'mc-format-italic ';
    if (seg.underline) classes += 'mc-format-underline ';
    if (seg.strikethrough) classes += 'mc-format-strikethrough ';
    if (seg.obfuscated) classes += 'mc-format-obfuscated ';
    
    const classAttr = classes.trim() ? ` class="${classes.trim()}"` : '';
    const styleAttr = style ? ` style="${style}"` : '';
    
    return `<span${classAttr}${styleAttr}>${escapeHtml(seg.text)}</span>`;
  }).join('');
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function renderMinecraftText(input: string): string {
  return segmentsToHtml(parseMinecraftText(input));
}
