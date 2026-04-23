const fs = require('fs');
const path = require('path');
const { renderToStaticMarkup } = require('react-dom/server');
const React = require('react');
const lucide = require('lucide-react');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = walkSync(dirFile, filelist);
    } catch (err) {
      if ((err.code === 'ENOTDIR' || err.code === 'EBADF') && (dirFile.endsWith('.tsx') || dirFile.endsWith('.ts'))) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
};

const files = walkSync('./src');
const usedIcons = new Set();

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('lucide-react')) {
    // Some lines might span multiple lines, let's use a broad regex or simple replace
    const match = content.match(/import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"];?/g);
    if (match) {
      match.forEach(m => {
        const innerMatch = m.match(/import\s+\{([^}]+)\}/);
        if (innerMatch) {
          const imports = innerMatch[1].split(',').map(s => s.trim()).filter(Boolean);
          imports.forEach(i => {
            const iconName = i.includes(' as ') ? i.split(' as ')[0].trim() : i;
            usedIcons.add(iconName);
          });
        }
        content = content.replace(m, m.replace(/['"]lucide-react['"]/, "'@/src/lib/icons'"));
      });
      fs.writeFileSync(file, content);
    }
  }
}

const iconsArray = Array.from(usedIcons);
console.log('Found icons:', iconsArray);

// Generate src/lib/icons-base64.ts
let base64Code = 'export const iconsBase64: Record<string, string> = {\n';
for (const iconName of iconsArray) {
  const IconRender = lucide[iconName];
  if (IconRender) {
    const svgString = renderToStaticMarkup(React.createElement(IconRender, { size: 24, stroke: 'currentColor', fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }));
    const base64 = Buffer.from(svgString).toString('base64');
    base64Code += `  ${iconName}: 'data:image/svg+xml;base64,${base64}',\n`;
  } else {
    console.log("NOT FOUND IN LUCIDE: " + iconName);
  }
}
base64Code += '};\n';
fs.writeFileSync('./src/lib/icons-base64.ts', base64Code);
console.log('Created src/lib/icons-base64.ts');

// Generate src/lib/icons.tsx
let iconsCode = `import React from 'react';
import { iconsBase64 } from './icons-base64';

export const createIcon = (name: string) => {
  return ({ size = 24, className = '', color, style, ...props }: any) => {
    return (
      <div 
        className={className}
        style={{
          width: size,
          height: size,
          flexShrink: 0,
          backgroundColor: color || 'currentColor',
          WebkitMaskImage: \`url(\${(iconsBase64 as any)[name]})\`,
          WebkitMaskSize: '100% 100%',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskImage: \`url(\${(iconsBase64 as any)[name]})\`,
          maskSize: '100% 100%',
          maskRepeat: 'no-repeat',
          maskPosition: 'center',
          display: 'inline-block',
          ...style
        }}
        {...props}
      />
    );
  };
};

`;

for (const icon of iconsArray) {
  iconsCode += `export const ${icon} = createIcon('${icon}');\n`;
}

fs.writeFileSync('./src/lib/icons.tsx', iconsCode);
console.log('Created src/lib/icons.tsx');
