import fs from 'fs';

let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Find boundaries
const settingsStart = content.indexOf('{/* Home Settings Modal */}');
const postStart = content.indexOf('{/* Post Detail Fullscreen */}');
const postEnd = content.indexOf('{/* Add Collection Modal */}');
const settingsEnd = postStart;

console.log('Settings section:', settingsStart, settingsEnd);
console.log('Post section:', postStart, postEnd);
