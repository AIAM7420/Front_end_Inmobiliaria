const fs = require('fs');
let content = fs.readFileSync('src/components/views/asesor/AsesorInventoryView.tsx', 'utf8');

content = content.replace(/defaultValue=\{selectedProperty\.title\}/, "value={selectedProperty.title || ''} onChange={(e) => setSelectedProperty({...selectedProperty, title: e.target.value})} placeholder=\"Título de la propiedad\"");
content = content.replace(/defaultValue=\"Hermosa propiedad.*?\"\s+className=\"text-\[13px\] text-gray-600/s, "value={selectedProperty.description || ''} onChange={(e) => setSelectedProperty({...selectedProperty, description: e.target.value})} placeholder=\"Descripción de la propiedad...\" className=\"text-[13px] text-gray-600");

// Fix some residual encodings
content = content.replace(/mA,A[\uFFFD]+/g, 'm²');
content = content.replace(/UbicaciA3n/g, 'Ubicación');
content = content.replace(/AA[\uFFFD]+adir/g, 'Añadir');
content = content.replace(/MA[\uFFFD]+s/g, 'Más');
content = content.replace(/A3/g, 'ó');
content = content.replace(/A±/g, 'ñ');

fs.writeFileSync('src/components/views/asesor/AsesorInventoryView.tsx', content);
