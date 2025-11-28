@echo off
echo Ejecutando limpieza del dataset en MySQL (mysql-db alias → maestro)...
echo.

if not exist clean_dataset.sql (
    echo ERROR: No se encuentra el archivo clean_dataset.sql
    exit /b 1
)

docker exec -i mysql-maestro mysql -u root -proot tpf_db_d < clean_dataset.sql

echo.
echo Limpieza finalizada.
pause