import re

with open('src/components/views/asesor/AsesorOverview.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the start of the return
return_match = re.search(r'return \(\s*<div className="flex flex-col gap-4 md:gap-6 h-full w-full', content)
if not return_match:
    print('Could not find return match')
    exit(1)

# We want to replace the BottomSheets with nothing, and put their content into sideContent variables.
ranking_content = re.search(r'<BottomSheet isOpen=\{isTopSheetOpen\}[^>]*>(.*?)</BottomSheet>', content, re.DOTALL)
portafolio_content = re.search(r'<BottomSheet isOpen=\{isPortafolioSheetOpen\}[^>]*>(.*?)</BottomSheet>', content, re.DOTALL)

if ranking_content and portafolio_content:
    content = content.replace(ranking_content.group(0), '')
    content = content.replace(portafolio_content.group(0), '')

    side_content_code = f"""
  const isSplitOpen = isTopSheetOpen || isPortafolioSheetOpen;

  const handleCloseSplit = () => {{
    setIsTopSheetOpen(false);
    setIsPortafolioSheetOpen(false);
  }};

  const getSideTitle = () => {{
    if (isTopSheetOpen) return "Ranking Inmuebles";
    if (isPortafolioSheetOpen) return "Análisis de Portafolio";
    return "";
  }};

  const sideContent = (
    <div className="p-4 md:p-0">
      {{isTopSheetOpen && (
        {ranking_content.group(1).strip()}
      )}}
      {{isPortafolioSheetOpen && (
        {portafolio_content.group(1).strip()}
      )}}
    </div>
  );
"""
    
    # insert side_content_code before return (
    content = content.replace('  return (', side_content_code + '\n  return (')

    # wrap the main div
    wrapper_start = """    <SplitViewLayout
      isOpen={isSplitOpen}
      onClose={handleCloseSplit}
      sideTitle={getSideTitle()}
      sideContent={sideContent}
      bottomSheetNoPadding={false}
      bottomSheetIsHero={false}
      mainContent={
"""
    content = content.replace('  return (\n    <div className="flex flex-col gap-4 md:gap-6 h-full w-full', '  return (\n' + wrapper_start + '      <div className="flex flex-col gap-4 md:gap-6 h-full w-full')

    # close the SplitViewLayout at the end
    # We look for the last closing divs and the final Notificaciones sheet.
    # The original file ended with:
    #     </div>
    #   );
    # };
    # Let's just replace the final `  );\n};` with closing the wrapper.
    content = content.replace('    </div>\n  );\n};', '    </div>\n      }\n    />\n  );\n};')

    with open('src/components/views/asesor/AsesorOverview.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Refactored successfully')
else:
    print('Could not find bottom sheets')
