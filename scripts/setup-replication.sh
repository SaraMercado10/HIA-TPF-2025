#!/bin/bash
set -e

echo "Configurando replicación en el esclavo..."


until mysqladmin ping -h mysql-maestro -u root -proot --silent; do
  echo "Esperando a mysql-maestro..."
  sleep 3
done

mysql -h mysql-maestro -u root -proot -e "ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'root';"

mysql -u root -proot -e "
CHANGE REPLICATION SOURCE TO
  SOURCE_HOST='mysql-maestro',
  SOURCE_PORT=3306,
  SOURCE_USER='root',
  SOURCE_PASSWORD='root',
  SOURCE_AUTO_POSITION=1;
"

mysql -u root -proot -e "START REPLICA;"

echo "Replicación iniciada en mysql-esclavo."