import os
import json
import re

brain_dir = r"C:\Users\Usuario\.gemini\antigravity\brain"
target_file = "AsesorInventoryView.tsx"
out_dir = r"C:\Users\Usuario\Documents\GitHub\INMO\scratch\recovered_versions"

os.makedirs(out_dir, exist_ok=True)

version = 0

for root, dirs, files in os.walk(brain_dir):
    if "transcript_full.jsonl" in files:
        tpath = os.path.join(root, "transcript_full.jsonl")
        try:
            with open(tpath, "r", encoding="utf-8") as f:
                for line in f:
                    if target_file in line:
                        try:
                            data = json.loads(line)
                        except:
                            continue
                            
                        # Check tool calls
                        if "tool_calls" in data:
                            for tc in data["tool_calls"]:
                                args = tc.get("args", {})
                                if tc.get("name") == "write_to_file" and target_file in args.get("TargetFile", ""):
                                    version += 1
                                    with open(os.path.join(out_dir, f"v{version}_write.tsx"), "w", encoding="utf-8") as outf:
                                        outf.write(args.get("CodeContent", ""))
                                        
                        # Check content for code blocks
                        content = data.get("content", "")
                        if content and target_file in content:
                            # Try to extract code blocks
                            blocks = re.findall(r"```(?:tsx|typescript)?\n(.*?)```", content, re.DOTALL)
                            for idx, b in enumerate(blocks):
                                if "export" in b or "import" in b:
                                    version += 1
                                    with open(os.path.join(out_dir, f"v{version}_codeblock_{idx}.tsx"), "w", encoding="utf-8") as outf:
                                        outf.write(b)
        except Exception as e:
            print(f"Error reading {tpath}: {e}")

print(f"Extracted {version} versions to {out_dir}")
