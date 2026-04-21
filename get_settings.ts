import fs from 'fs';

let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// The HomeSettings Modal starts with {/* Home Settings Modal */} and ends before {/* Delete Confirmation Modal */}
const s1 = content.indexOf('{/* Home Settings Modal */}');
const s2 = content.indexOf('{/* Delete Confirmation Modal */}');
const settingsString = content.substring(s1, s2);

// Write to a template file for us to analyze and refactor
fs.writeFileSync('settings_temp.tsx', settingsString);
