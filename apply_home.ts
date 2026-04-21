import fs from 'fs';

let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// We need to add the correct imports at the top
content = content.replace("import React, { useState } from 'react';", 
`import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { HomeSettings } from './HomeSettings';
import { HomeCollectionDetail } from './HomeCollectionDetail';
import { HomePostDetail } from './HomePostDetail';`);

// Then replace the parameters of `Home` to include navigate and location if needed
const mainFuncRegex = /export function Home\([^)]+\) {/;
const mainFuncMatch = content.match(mainFuncRegex);
if (!mainFuncMatch) {
  console.log('Could not find main function match');
} else {
  const matchStr = mainFuncMatch[0];
  content = content.replace(matchStr, `${matchStr}
  const navigate = useNavigate();
  const location = useLocation();
`);
}

// Remove local states that are no longer needed
const toRemove = [
  "const [showHomeSettings, setShowHomeSettings] = useState(false);",
  "const [settingsPage, setSettingsPage] = useState<'main' | 'profile' | 'display' | 'collections' | 'portfolio' | 'collection_detail' | 'work_detail'>('main');",
  "const [selectedCollectionForEdit, setSelectedCollectionForEdit] = useState<any>(null);",
  "const [selectedWorkForEdit, setSelectedWorkForEdit] = useState<any>(null);",
  "const [selectedPost, setSelectedPost] = useState<any>(null);",
  "const [selectedCollection, setSelectedCollection] = useState<any>(null);",
];
toRemove.forEach(str => {
  content = content.replace(str, "");
});

// Update standard navigate calls
content = content.replace(/setShowHomeSettings\(true\)/g, "navigate('/home/settings')");
content = content.replace(/setSelectedCollection\(collection\)/g, "navigate(`/home/collection/${collection.id}`)");
// Let's find exactly how selectedPost is set
content = content.replace(/setSelectedPost\(work\);\n\s+setCurrentImageIndex\(0\);/g, "navigate(`/home/post/${work.id}`);");
content = content.replace(/setSelectedPost\(item\);\n\s+setCurrentImageIndex\(0\);/g, "navigate(`/home/post/${item.id}`);");
content = content.replace(/setSelectedPost\(work\)/g, "navigate(`/home/post/${work.id}`)");
content = content.replace(/setSelectedPost\(item\)/g, "navigate(`/home/post/${item.id}`)");

// Also replace the entire return portion
// The main return spans all the JSX. We should wrap it in Routes:
/*
  return (
    <Routes>
      <Route path="/settings/*" element={<HomeSettings ... />} />
      <Route path="/collection/:id" element={<HomeCollectionDetail ... />} />
      <Route path="/post/:id" element={<HomePostDetail ... />} />
      <Route path="/" element={ ... (the original main JSX) ... } />
    </Routes>
  );
*/

const returnStartStr = `  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-sans relative">`;

const replacementStr = `  return (
    <Routes>
      <Route path="/settings/*" element={<HomeSettings profile={profile} setProfile={setProfile} homeSettings={homeSettings} setHomeSettings={setHomeSettings} collections={collections} setCollections={setCollections} portfolio={portfolio} setPortfolio={setPortfolio} categories={categories} setCategories={setCategories} ALL_SYSTEM_PORTFOLIO={ALL_SYSTEM_PORTFOLIO} />} />
      <Route path="/collection/:id" element={<HomeCollectionDetail collections={collections} allPortfolio={ALL_SYSTEM_PORTFOLIO} profile={profile} />} />
      <Route path="/post/:id" element={<HomePostDetail posts={[...portfolio, ...ALL_SYSTEM_PORTFOLIO]} />} />
      <Route path="/" element={
        <div className="bg-slate-50 min-h-screen pb-24 font-sans relative">`;

content = content.replace(returnStartStr, replacementStr);

// Close out the Route at the end. It ends before function PortfolioCard
// We also need to strip out the existing modals!
// Let's just remove the text between `{/* Home Settings Modal */}` and `{/* Add Collection Modal */}`
// wait, delete confirmation modal and add collection modal might still be needed in Home?
// We only extracted settings, collection detail, and post detail.

const m1 = content.indexOf('{/* Home Settings Modal */}');
const m2 = content.indexOf('{/* Delete Confirmation Modal */}');
const m3 = content.indexOf('{/* Collection View Modal */}');
const m4 = content.indexOf('{/* Image Lightbox */}');
const m5 = content.indexOf('{/* Collection Action Sheet */}');

content = content.slice(0, m1) + content.slice(m2, m3) + content.slice(m5);

// Add the closing Route tag before the final closing brace of Home
const homeEndBraceMatch = content.lastIndexOf("}\n\nfunction PortfolioCard");
if (homeEndBraceMatch > 0) {
  content = content.slice(0, homeEndBraceMatch) + `\n        }\n      />\n    </Routes>\n  );\n` + content.slice(homeEndBraceMatch);
}

fs.writeFileSync('src/pages/Home.tsx', content);
console.log('Done refactoring Home');
