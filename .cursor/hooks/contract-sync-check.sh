#!/usr/bin/env sh
# Warn when contract-related files change. Fail-open (stdout only).
input=$(cat)
paths=$(printf '%s' "$input" | node -e "
let d=''; process.stdin.on('data',c=>d+=c);
process.stdin.on('end',()=>{
  try {
    const j=JSON.parse(d);
    const files=[].concat(j.file_path||[], j.paths||[], j.files||[]).flat().filter(Boolean);
    if(!files.length && j.path) files.push(j.path);
    console.log(files.join('\n'));
  } catch { console.log(''); }
});
")

contracts=0
docs=0

for f in $paths; do
  case "$f" in
    packages/contracts/*|*/packages/contracts/*|server/src/features/*/routes*|*/server/src/features/*/routes*)
      contracts=1
      ;;
    docs/contracts.md|*/docs/contracts.md)
      docs=1
      ;;
  esac
done

if [ "$contracts" = 1 ] && [ "$docs" = 0 ]; then
  echo '{"additional_context":"Contract-related code changed. Update docs/contracts.md and packages/contracts if invariants changed. Run rbac-review skill."}'
fi

exit 0
