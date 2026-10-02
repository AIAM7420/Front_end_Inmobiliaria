import json
with open(r'C:\Users\Usuario\.gemini\antigravity\brain\3d3c4339-d64b-4d69-b089-f7d7b1452015\.system_generated\logs\transcript_full.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        try:
            obj = json.loads(line)
            if obj.get('type') == 'USER_INPUT':
                content = obj.get('content', '')
                if 'src/components/views/asesor/AsesorInventoryView.tsx' in content and 'import React' in content:
                    with open('scratch/user_prompt.txt', 'w', encoding='utf-8') as out:
                        out.write(content)
                    print('Found user prompt')
                    break
        except Exception as e:
            pass
