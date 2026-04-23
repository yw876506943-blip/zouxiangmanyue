const { renderToStaticMarkup } = require('react-dom/server');
const React = require('react');
const icons = require('lucide-react');

const allIcons = [
  'Home', 'Briefcase', 'User', 'X', 'Link', 'QrCode', 'MessageCircle', 'Check', 'Download', 'Search', 'Plus', 'ChevronLeft', 'MoreHorizontal', 'Camera', 'Clock', 'CalendarDays', 'Calendar', 'MapPin', 'MessageSquare', 'AlertCircle', 'ChevronRight', 'Heart', 'Share2', 'Layers', 'Wallet', 'CheckCircle2', 'GripVertical', 'Tag', 'Trash2', 'FolderHeart', 'Image', 'Lock', 'Link2', 'Eye', 'Settings', 'DollarSign', 'Info', 'Edit3', 'LayoutTemplate', 'Phone', 'Headphones', 'Star', 'ImagePlus', 'Sparkles'
];

let result = 'export const iconsBase64: Record<string, string> = {\n';

for (const iconName of allIcons) {
  const IconRender = icons[iconName];
  if (IconRender) {
    const svgString = renderToStaticMarkup(React.createElement(IconRender, { size: 24, stroke: 'currentColor', fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }));
    const base64 = Buffer.from(svgString).toString('base64');
    result += `  ${iconName}: 'data:image/svg+xml;base64,${base64}',\n`;
  } else {
    console.log("Not found: " + iconName);
  }
}
result += '};\n';
const fs = require('fs');
fs.writeFileSync('src/lib/icons-base64.ts', result);
console.log('Saved to src/lib/icons-base64.ts');
