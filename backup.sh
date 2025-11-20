#!/bin/bash
if [ ! -f /tmp/backup_initialized ]; then
  echo "⏳ Primera ejecución: esperando a que MySQL esté completamente listo..."
  sleep 20
  touch /tmp/backup_initialized
fi

BACKUP_DIR="/backups"

DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/backup_$DATE.sql"

# --- CORRECCIÓN ---
# Ahora usamos las variables de entorno (DB_HOST, DB_USER, etc.)
# que se definen en docker-compose.yml.
# Ya no están "hardcodeadas" en el script.
mysqldump \
  -h "${DB_HOST}" \
  -u "${DB_USER}" \
  -p"${DB_PASSWORD}" \
  --single-transaction \
  --routines \
  --triggers \
  --set-gtid-purged=OFF \
  "${DB_NAME}" > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
  echo "✅ Backup exitoso: $BACKUP_FILE"

  if [ $(ls -1 "$BACKUP_DIR"/backup_*.sql 2>/dev/null | wc -l) -gt 10 ]; then
    echo "🧹 Limpiando backups antiguos..."
    ls -tp "$BACKUP_DIR"/backup_*.sql | tail -n +11 | xargs -r rm --
  fi
else
  echo "Error al realizar el backup de la base de datos '${DB_NAME}'"
  exit 1
fi