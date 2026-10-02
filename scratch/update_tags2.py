import os

filepath = r"C:\Users\Usuario\Documents\GitHub\INMO\src\components\organisms\PropertyCreatorWizard.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Find the button start and end precisely
start_idx = content.find("<button\\n                onClick={() => {\\n                  const val = prompt('Nuevo Tag")
if start_idx == -1:
    start_idx = content.find("<button\n                onClick={() => {\n                  const val = prompt('Nuevo Tag")
    
if start_idx != -1:
    end_idx = content.find("</button>", start_idx) + len("</button>")
    
    new_input_logic = """              {isAddingTag ? (
                <input
                  autoFocus
                  type="text"
                  value={newTagText}
                  onChange={(e) => setNewTagText(e.target.value)}
                  onBlur={() => {
                    if (newTagText.trim()) {
                      update('tags', [...formData.tags, { text: newTagText.trim(), variant: 'secondary' as const }]);
                    }
                    setNewTagText('');
                    setIsAddingTag(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (newTagText.trim()) {
                        update('tags', [...formData.tags, { text: newTagText.trim(), variant: 'secondary' as const }]);
                      }
                      setNewTagText('');
                      setIsAddingTag(false);
                    } else if (e.key === 'Escape') {
                      setNewTagText('');
                      setIsAddingTag(false);
                    }
                  }}
                  className="text-sm bg-inmo-accent/10 text-inmo-accent px-3 py-1.5 rounded-lg font-bold uppercase outline-none border border-inmo-accent min-w-[120px] placeholder:text-inmo-accent/50 placeholder:normal-case focus:ring-2 focus:ring-inmo-accent/50 transition-all"
                  placeholder="Nuevo tag..."
                />
              ) : (
                <button
                  onClick={() => setIsAddingTag(true)}
                  className="text-sm bg-gray-50 dark:bg-inmo-darktertiary border border-dashed border-gray-300 dark:border-gray-600 text-gray-500 hover:text-inmo-accent hover:border-inmo-accent transition-colors px-3 py-1.5 rounded-lg font-bold uppercase"
                >
                  + Agregar Tag
                </button>
              )}"""

    content = content[:start_idx] + new_input_logic + content[end_idx:]

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated button to inline logic")
else:
    print("Could not find button")
