const fs = require('fs');
const file = 'src/components/views/admin/AdminPublicationsView.tsx';
let content = fs.readFileSync(file, 'utf8');

// Rename component
content = content.replace('export const AsesorInventoryView = () => {', 'export const AdminPublicationsView = () => {');

// Replace titles
content = content.replace('title="Mis Propiedades"', 'title="Publicaciones (Moderación)"');
content = content.replace(/subtitle=\{isListLoading \? 'Cargando inventario\.\.\.' : `Tienes \$\{listData\?\.total \?\? 0\} propiedades\.`\}/, 'subtitle="Gestiona y modera el inventario global de la plataforma."');

// Change buttons in UI
content = content.replaceAll("Editar Propiedad", "Revisar Publicación");
content = content.replaceAll("title=\"Editar\"", "title=\"Revisar\"");
content = content.replaceAll("label: 'Eliminar'", "label: 'Suspender'");
content = content.replaceAll("title=\"Eliminar\"", "title=\"Suspender\"");

// Remove 'Nueva Propiedad' button block
// Instead of complex regex, let's just find the buttons
// Mobile button
content = content.replace(/<IconButton\s+variant="accent"\s+icon=\{\<Plus className="w-4 h-4 shrink-0" strokeWidth=\{2\} \/>\}\s+onClick=\{\(\) => \{\s*setViewMode\('list'\);\s*setIsCreating\(true\);\s*setWizardStep\(1\);\s*\}\}\s+\/>/, '');

// Desktop button
content = content.replace(/<Button\s+variant="accent"\s+icon=\{\<Plus className="w-4 h-4 shrink-0" strokeWidth=\{2\} \/>\}\s+className="!px-3 lg:!px-4 !py-2 shrink-0 shadow-glow active:scale-95 transition-transform"\s+onClick=\{\(\) => \{\s*setViewMode\('list'\);\s*setIsCreating\(true\);\s*setWizardStep\(1\);\s*\}\}\s+>\s+<span className="font-inter font-medium text-caption lg:text-sm text-white hidden md:inline">Nueva Propiedad<\/span>\s+<\/Button>/, '');

fs.writeFileSync(file, content);
console.log('Fixed');
