import fs from 'fs';

let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const settingsStartIndex = content.indexOf('{/* Home Settings Modal */}');
const deleteModalStartIndex = content.indexOf('{/* Delete Confirmation Modal */}');
const collectionViewStartIndex = content.indexOf('{/* Collection View Modal */}');
const imageLightboxStartIndex = content.indexOf('{/* Image Lightbox */}');
const collectionActionSheetStartIndex = content.indexOf('{/* Collection Action Sheet */}');
const addCollectionModalStartIndex = content.indexOf('{/* Add Collection Modal */}');

console.log('settings:', settingsStartIndex);
console.log('deleteModal:', deleteModalStartIndex);
console.log('collectionView', collectionViewStartIndex);
console.log('imageLightbox', imageLightboxStartIndex);
console.log('collectionAction', collectionActionSheetStartIndex);
console.log('addCollection', addCollectionModalStartIndex);

// Modals to extract into their own component strings from Home.tsx:
// 1. settings (HomeSettings Modal) -> goes up to Delete Confirmation Modal
// Wait, Delete Confirmation Modal is embedded inside the same file. It's used by settings or general?
// 2. collectionView (Collection View Modal) -> goes up to Image Lightbox
// 3. imageLightbox (Image Lightbox - Post View) -> goes up to Collection Action Sheet

