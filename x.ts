import fs from 'fs';

for (let file of ['src/components/WorkbenchShared.tsx', 'src/pages/WorkbenchCollections.tsx', 'src/pages/WorkbenchPortfolio.tsx']) {
  const content = fs.readFileSync(file, 'utf8');
  fs.writeFileSync(file, content.replace("@/src/components/ui/button", "@/src/components/ui/Button"));
}

const pf = 'src/pages/WorkbenchPortfolio.tsx';
let pfc = fs.readFileSync(pf, 'utf8');
pfc = pfc.replace("export function PortfolioPage({ items, setItems }: { items: any[], setItems: (items: any[]) => void }) {", "export function PortfolioPage({ items, setItems, onBack }: { items: any[], setItems: (items: any[]) => void, onBack?: () => void }) {");
fs.writeFileSync(pf, pfc);
console.log('Fixed');
