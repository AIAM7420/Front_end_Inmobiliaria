const fs = require('fs');

function updateButtons(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Replace generic full-width buttons
  content = content.replace(
    /<Button([^>]*)className=\"w-full\"([^>]*)>(.*?)<\/Button>/g,
    '<Button$1className="w-full sm:w-1/3 self-start !py-3"$2>$3</Button>'
  );

  // Replace specific "Agregar Método de Pago" button
  content = content.replace(
    /<Button([^>]*)className=\"w-full !rounded-full\"([^>]*)>Agregar (m|M).*?todo de Pago<\/Button>/g,
    '<Button$1className="w-full sm:w-1/3 self-start !py-3"$2>Agregar Método de Pago</Button>'
  );

  // Replace specific "Confirmar Baja Permanente" button
  content = content.replace(
    /<Button([^>]*)className=\"w-full !text-red-500 !border !border-red-300 dark:!border-red-800 hover:!bg-red-50 dark:hover:!bg-red-900\/10\"([^>]*)>(.*?)<\/Button>/g,
    '<Button$1className="w-full sm:w-1/3 self-start !py-3 !text-red-500 !border !border-red-300 dark:!border-red-800 hover:!bg-red-50 dark:hover:!bg-red-900/10"$2>$3</Button>'
  );
  
  // Fix encoding issues globally in case they persist for Contraseña
  content = content.replace(/ContraseAa/g, 'Contraseña');

  fs.writeFileSync(file, content);
}

updateButtons('src/components/templates/AsesorProfileTemplate.tsx');
updateButtons('src/components/templates/PublicProfileTemplate.tsx');

console.log('Done!');
