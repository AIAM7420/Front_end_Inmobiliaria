import json
with open(r'C:\Users\Usuario\.gemini\antigravity\brain\3d3c4339-d64b-4d69-b089-f7d7b1452015\.system_generated\logs\transcript_full.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        try:
            obj = json.loads(line)
            if obj.get('type') == 'TOOL_RESPONSE':
                for res in obj.get('tool_responses', []):
                    output = res.get('response', {}).get('output', '')
                    if 'export const AsesorInventoryView' in output and 'import React' in output:
                        with open('scratch/recovered_cat.tsx', 'w', encoding='utf-8') as out:
                            out.write(output)
                        print('Found full cat output!')
                        break
        except Exception as e:
            pass
