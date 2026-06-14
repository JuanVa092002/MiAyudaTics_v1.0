#!/usr/bin/env sh
# Block dangerous shell commands. Fail-closed on match (exit 2).
input=$(cat)
command=$(printf '%s' "$input" | node -e "
let d=''; process.stdin.on('data',c=>d+=c);
process.stdin.on('end',()=>{
  try { console.log(JSON.parse(d).command||''); }
  catch { console.log(''); }
});
")

case "$command" in
  *"git push"*"--force"*|*"git push -f"*|*"push --force"*)
    echo '{"permission":"deny","user_message":"Force push blocked by project hook.","agent_message":"Use a normal push or get Founder-CTO approval."}'
    exit 2
    ;;
  *"reset --hard"*|*"git reset --hard"*)
    echo '{"permission":"deny","user_message":"git reset --hard blocked.","agent_message":"Use git stash or revert instead."}'
    exit 2
    ;;
  *"rm -rf /"*|*"rm -rf /*"*)
    echo '{"permission":"deny","user_message":"Destructive rm blocked.","agent_message":"Scope deletions to project paths only."}'
    exit 2
    ;;
  *"drop database"*|*"db.dropDatabase"*)
    echo '{"permission":"deny","user_message":"Database drop blocked.","agent_message":"Use test DB or Atlas UI with HITL."}'
    exit 2
    ;;
esac

echo '{"permission":"allow"}'
exit 0
