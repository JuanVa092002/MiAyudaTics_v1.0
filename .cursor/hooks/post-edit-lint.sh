#!/usr/bin/env sh
# Post-edit lint: run eslint on touched client/server areas. Fail-open.
set -e
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

client=0
server=0

for f in $paths; do
  case "$f" in
    client/*|*/client/*) client=1 ;;
    server/*|*/server/*) server=1 ;;
  esac
done

if [ "$client" = 1 ]; then
  (cd client && pnpm exec eslint --fix . 2>/dev/null) || true
fi

if [ "$server" = 1 ]; then
  (cd server && pnpm exec eslint --fix . 2>/dev/null) || true
fi

exit 0
