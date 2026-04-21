import fs from 'fs';

let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const s1 = content.indexOf('{/* Delete Confirmation Modal */}');
const e1 = content.lastIndexOf('</AnimatePresence>');
// we know e1 is the end of Add Portfolio Modal 
// wait, the closing of the main JSX is `  </div>` right after `</AnimatePresence>`. 

if (s1 > -1 && e1 > -1) {
  content = content.slice(0, s1) + content.slice(e1 + '</AnimatePresence>'.length);
}

fs.writeFileSync('src/pages/Home.tsx', content);
