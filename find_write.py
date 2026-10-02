import json
with open(r'C:\Users\Usuario\.gemini\antigravity\brain\3d3c4339-d64b-4d69-b089-f7d7b1452015\.system_generated\logs\transcript_full.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        try:
            obj = json.loads(line)
            if 'tool_calls' in obj:
                for tc in obj['tool_calls']:
                    if tc['function']['name'] == 'default_api:write_to_file':
                        args = json.loads(tc['function']['arguments'])
                        if 'AsesorInventoryView.tsx' in args.get('TargetFile', ''):
                            with open('scratch/restored_v1.tsx', 'w', encoding='utf-8') as out:
                                out.write(args.get('CodeContent', ''))
                            print('Found write_to_file in step', obj.get('step_index'))
        except Exception as e:
            pass
