#!/usr/bin/env sh
# Remind to complete handoff when agent stops after code edits. Fail-open.
input=$(cat)
paths=$(printf '%s' "$input" | node -e "
let d=''; process.stdin.on('data',c=>d+=c);
process.stdin.on('end',()=>{
  try {
    const j=JSON.parse(d);
    const files=[].concat(j.file_path||[], j.paths||[], j.files||[], j.edited_files||[]).flat().filter(Boolean);
    console.log(files.join('\n'));
  } catch { console.log(''); }
});
")

code=0
docs=0

for f in $paths; do
  case "$f" in
    client/*|server/*|mobile/*|packages/*|*/client/*|*/server/*|*/mobile/*|*/packages/*)
      code=1
      ;;
    docs/*|*/docs/*|AGENTS.md|*/AGENTS.md)
      docs=1
      ;;
  esac
done

if [ "$code" = 1 ] && [ "$docs" = 0 ]; then
  echo '{"followup_message":"Complete docs/handoff-template.md before considering this workstream done. Run docs-handoff skill if needed."}'
fi

exit 0
