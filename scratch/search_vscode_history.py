import os
import json

history_dir = os.path.expandvars(r"%APPDATA%\Code\User\History")
print(f"Searching in {history_dir}")

found_entries = []

if os.path.exists(history_dir):
    for root, dirs, files in os.walk(history_dir):
        if 'entries.json' in files:
            entries_path = os.path.join(root, 'entries.json')
            try:
                with open(entries_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if "AsesorInventoryView.tsx" in content:
                        print(f"Found match in {entries_path}")
                        data = json.loads(content)
                        for entry in data.get("entries", []):
                            entry_path = os.path.join(root, entry.get("id"))
                            # Get file modification time
                            if os.path.exists(entry_path):
                                mtime = os.path.getmtime(entry_path)
                                found_entries.append((entry_path, mtime))
            except Exception as e:
                pass

if found_entries:
    found_entries.sort(key=lambda x: x[1], reverse=True)
    print("Found historical files (newest first):")
    for fpath, mtime in found_entries[:10]:
        print(f"{fpath} - {mtime}")
else:
    print("No history entries found for AsesorInventoryView.tsx")
