const fs = require('fs');

function fixAllBottomButtons(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Replace any <Button> that has className="w-full" (exact match)
  content = content.replace(
    /<Button([^>]*)className=\"w-full\"([^>]*)>(.*?)<\/Button>/g,
    '<Button$1className="w-full sm:w-1/3 self-start !py-3"$2>$3</Button>'
  );

  // Replace any <Button> that has className="w-full !rounded-full" (exact match)
  content = content.replace(
    /<Button([^>]*)className=\"w-full !rounded-full\"([^>]*)>(.*?)<\/Button>/g,
    '<Button$1className="w-full sm:w-1/3 self-start !py-3 !rounded-full"$2>$3</Button>'
  );

  // Replace any <Button> that has the red secondary classes
  content = content.replace(
    /className=\"w-full !text-red-500 !border !border-red-300 dark:!border-red-800 hover:!bg-red-50 dark:hover:!bg-red-900\/10\"/g,
    'className="w-full sm:w-1/3 self-start !py-3 !text-red-500 !border !border-red-300 dark:!border-red-800 hover:!bg-red-50 dark:hover:!bg-red-900/10"'
  );

  // Hardcode fix the encodings for 'método' and 'Contraseña'
  content = content.replace(/mActodo/g, 'método');
  content = content.replace(/MActodo/g, 'Método');
  content = content.replace(/ContraseAa/g, 'Contraseña');
  content = content.replace(/ContraseA.a/g, 'Contraseña'); // sometimes powershell injects Aa

  fs.writeFileSync(file, content);
}

fixAllBottomButtons('src/components/templates/AsesorProfileTemplate.tsx');
fixAllBottomButtons('src/components/templates/PublicProfileTemplate.tsx');

