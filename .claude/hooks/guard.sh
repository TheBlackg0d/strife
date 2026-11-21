#!/usr/bin/env bash
# Hook PreToolUse : bloque l'accès aux secrets et la modification des migrations déjà appliquées.
# Code de sortie 2 = l'outil est bloqué et le message (stderr) est renvoyé à l'agent.
input=$(cat)
tool=$(printf '%s' "$input" | sed -n 's/.*"tool_name" *: *"\([^"]*\)".*/\1/p')
path=$(printf '%s' "$input" | sed -n 's/.*"file_path" *: *"\([^"]*\)".*/\1/p')
cmd=$(printf '%s' "$input" | sed -n 's/.*"command" *: *"\(.*\)".*/\1/p')

block() { echo "BLOQUÉ par .claude/hooks/guard.sh : $1" >&2; exit 2; }

# 1. Secrets : .env (mais pas .env.example)
if [ -n "$path" ] && printf '%s' "$path" | grep -Eq '(^|/)\.env(\.[A-Za-z0-9_-]+)?$' \
   && ! printf '%s' "$path" | grep -q '\.env\.example$'; then
  block "accès à un fichier .env interdit. Utilise .env.example pour les noms de variables."
fi
if [ "$tool" = "Bash" ] && printf '%s' "$cmd" | grep -Eq '\.env([^.A-Za-z]|$)'; then
  block "commande qui touche un fichier .env interdite."
fi

# 2. Migrations Liquibase déjà existantes : on en crée une nouvelle, on ne modifie pas l'ancienne
if { [ "$tool" = "Edit" ] || [ "$tool" = "Write" ] || [ "$tool" = "MultiEdit" ]; } \
   && printf '%s' "$path" | grep -q '/db/changelog/changes/' && [ -f "$path" ]; then
  block "$path est un changeset déjà appliqué. Crée un nouveau fichier numéroté et ajoute-le au master."
fi

# 3. Git dangereux
if [ "$tool" = "Bash" ] && printf '%s' "$cmd" | grep -Eq 'git push.*(--force|-f( |$))|git push [^ ]+ main'; then
  block "push forcé ou push direct sur main interdit. Ouvre une PR."
fi
exit 0
