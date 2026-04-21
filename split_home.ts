import fs from 'fs';

let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const getNextMatch = (str, match) => str.indexOf(match);

const s1 = content.indexOf('{/* Home Settings Modal */}');
const s2 = content.indexOf('{/* Delete Confirmation Modal */}');
const s3 = content.indexOf('{/* Collection View Modal */}');
const s4 = content.indexOf('{/* Image Lightbox */}');
const s5 = content.indexOf('{/* Collection Action Sheet */}');
const s6 = content.indexOf('{/* Add Collection Modal */}');

const homeSettingsSection = content.substring(s1, s2);
const deleteModalSection = content.substring(s2, s3);
const collectionSection = content.substring(s3, s4);
const postSection = content.substring(s4, s5);

fs.writeFileSync('homeSettings.txt', homeSettingsSection);
fs.writeFileSync('collectionSection.txt', collectionSection);
fs.writeFileSync('postSection.txt', postSection);
fs.writeFileSync('deleteModal.txt', deleteModalSection);
