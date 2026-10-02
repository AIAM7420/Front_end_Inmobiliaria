const fs = require('fs');

function fixAlignment(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Change self-start to self-center
  content = content.replace(/self-start/g, 'self-center');

  fs.writeFileSync(file, content);
}

fixAlignment('src/components/templates/AsesorProfileTemplate.tsx');
fixAlignment('src/components/templates/PublicProfileTemplate.tsx');

// Now remove the inner gray button from AsesorProfileTemplate.tsx
const asesorFile = 'src/components/templates/AsesorProfileTemplate.tsx';
let asesorContent = fs.readFileSync(asesorFile, 'utf8');

// The block to remove:
// <div className="w-full h-px bg-gray-100 dark:bg-inmo-darktertiary" />
// <div className="p-4 bg-gray-50 dark:bg-inmo-darkbg/50 flex justify-start">
//   <Button variant="secondary" onClick={handleStripePortal} className="w-full sm:w-1/3 justify-center !py-2 !px-4 !text-sm">
//     Agregar método de pago
//   </Button>
// </div>

const regexToRemove = /<div className=\"w-full h-px bg-gray-100 dark:bg-inmo-darktertiary\" \/>\s*<div className=\"p-4 bg-gray-50 dark:bg-inmo-darkbg\/50 flex justify-start\">\s*<Button variant=\"secondary\".*?>\s*Agregar.*?pago\s*<\/Button>\s*<\/div>/i;

asesorContent = asesorContent.replace(regexToRemove, '');
fs.writeFileSync(asesorFile, asesorContent);
