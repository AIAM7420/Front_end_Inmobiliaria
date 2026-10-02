import json
import sys
import os

transcript_path = r"C:\Users\Usuario\.gemini\antigravity\brain\eba06efe-5855-4c1c-933b-be5e764adb7a\.system_generated\logs\transcript_full.jsonl"
target_file = "AsesorInventoryView.tsx"

with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
        except:
            continue
            
        if "tool_calls" in data:
            for tc in data["tool_calls"]:
                args = tc.get("args", {})
                
                # Check for write_to_file
                if tc.get("name") == "write_to_file":
                    if target_file in args.get("TargetFile", ""):
                        print("Found write_to_file for", args.get("TargetFile"))
                        with open("recovered_AsesorInventoryView_write.tsx", "w", encoding='utf-8') as out:
                            out.write(args.get("CodeContent", ""))
                        
                # Check for replace_file_content
                elif tc.get("name") == "replace_file_content":
                    if target_file in args.get("TargetFile", ""):
                        print(f"Found replace_file_content for {args.get('TargetFile')} at lines {args.get('StartLine')}-{args.get('EndLine')}")
