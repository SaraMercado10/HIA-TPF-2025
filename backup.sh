#!/bin/bash
DB_HOST="mysql-db" 
DB_USER="root"
DB_PASS="root"
DB_NAME="tpf_db_d"
BACKUP_DIR="/backups"

echo "⏳ Primera ejecución: esperando a que MySQL esté completamente listo..."
until mysqladmin ping -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" --silent; do
    echo "MySQL no listo, reintentando..."
    sleep 3
done

echo "MySQL listo. Ejecutando backup..."
mysqldump -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" > \
    "$BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql"

echo "Backup exitoso"