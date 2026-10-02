const fs = require('fs');

const file = 'src/components/templates/AsesorProfileTemplate.tsx';
let content = fs.readFileSync(file, 'utf8');

const target1 = `  const renderDetailContent = () => {
    switch (activeView) {`;
const replacement1 = `  const renderDetailContent = () => {
    const renderContent = () => {
      switch (activeView) {`;

content = content.replace(target1, replacement1);

const target2 = `      default:
        return null;
    }
  };

  const getDetailTitle = () => {`;
const replacement2 = `      default:
        return null;
      }
    };
    return <div className="h-full overflow-y-auto w-full">{renderContent()}</div>;
  };

  const getDetailTitle = () => {`;

content = content.replace(target2, replacement2);

fs.writeFileSync(file, content);
