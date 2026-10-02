import os

filepath = r"C:\Users\Usuario\Documents\GitHub\INMO\src\components\organisms\PropertyCreatorWizard.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add state variables
state_injection = """  const [step, setStep] = useState(0);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagText, setNewTagText] = useState('');"""
content = content.replace("  const [step, setStep] = useState(0);", state_injection)

# 2. Replace the button with the inline input logic
old_button = """              <button
                onClick={() => {
                  const val = prompt('Nuevo Tag (ej. Pet Friendly, Alberca):');
                  if (val?.trim()) update('tags', [...formData.tags, { text: val.trim(), variant: 'secondary' as const }]);
                }}
                className="text-sm bg-gray-50 dark:bg-inmo-darktertiary border border-dashed border-gray-300 dark:border-gray-600 text-gray-500 hover:text-inmo-accent hover:border-inmo-accent transition-colors px-3 py-1.5 rounded-lg font-bold uppercase"
              >
                + Agregar Tag
              </button>"""

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

content = content.replace(old_button, new_input_logic)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated inline tag creation")
