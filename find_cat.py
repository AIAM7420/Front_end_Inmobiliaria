import json
with open(r'C:\Users\Usuario\.gemini\antigravity\brain\3d3c4339-d64b-4d69-b089-f7d7b1452015\.system_generated\logs\transcript_full.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        try:
            obj = json.loads(line)
            if 'cat src/components/views/asesor/AsesorInventoryView.tsx' in str(obj):
                print('Found cat command in step', obj.get('step_index'))
        except Exception:
            pass
