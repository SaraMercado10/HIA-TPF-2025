# 🏢 Sistema de Gestión de Alquileres Comerciales

**Práctica Integradora Final – Herramientas Informáticas Avanzadas**  
---

## 👥 Integrantes
* **Cruz, Kevin Brian Joel**
* **Mercado, Sara Denise**
* **Montaño, Nahir María Cecilia**

---

## 🎯 Objetivo del Proyecto

Este proyecto implementa una solución integral para la **gestión de alquileres comerciales** en grandes centros de compras. El sistema ha sido diseñado para soportar alta carga y volumen de datos, cumpliendo con los siguientes requisitos críticos:

* **Persistencia Masiva**: Base de datos MySQL con dataset de prueba ≥500.000 registros por tabla.
* **Arquitectura de Microservicios**: Contenerización completa orquestada con Docker Compose.
* **Alta Disponibilidad**: Replicación MySQL Master/Slave (GTID).
* **Seguridad**: Implementación de HTTPS, Headers de seguridad y protección contra DDoS.
* **Observabilidad**: Monitoreo full-stack (Infraestructura, DB y Aplicación).
* **Automatización**: CI/CD pipelines y despliegue continuo.

---

## 🛠️ Stack Tecnológico y Herramientas

La arquitectura del proyecto se divide en las siguientes capas y servicios:

| Categoría | Tecnología / Herramienta | Propósito Principal |
| :--- | :--- | :--- |
| **Aplicación Core** | **Backend**: Node.js, Express, Sequelize | Lógica de negocio y API RESTful. |
| | **Frontend**: Angular 16+ | Interfaz de usuario (UX/UI) responsiva. |
| | **Base de Datos**: MySQL 8.0 | Persistencia relacional de datos masivos. |
| **Contenerización** | **Docker y Docker Compose** | Definición, aislamiento y orquestación de servicios. |
| **Base de Datos Tools** | **phpMyAdmin** | Administración visual de la base de datos. |
| | **MySQLTuner y Percona Toolkit** | Diagnóstico, auditoría y tuning de performance. |
| | **MySQL Master/Slave (GTID)** | Estrategia de replicación para escalabilidad de lectura. |
| **CI/CD** | **GitHub Actions** | Automatización de Build y Push de imágenes a Docker Hub. |
| | **Docker Hub** | Registro público/privado de imágenes de contenedores. |
| | **Watchtower** | Despliegue Continuo (CD): Actualización automática de contenedores. |
| **Monitoreo & Obs.** | **Prometheus** | Recolección y almacenamiento de métricas (Time-Series DB). |
| | **Grafana** | Visualización de datos y creación de Dashboards. |
| | **cAdvisor y Node-Exporter** | Métricas de recursos (CPU, RAM, I/O) de Contenedores y Host. |
| | **mysqld-exporter** | Exportador de métricas específicas de MySQL. |
| **Gestión & Docs.** | **Jira** | Gestión ágil de proyectos (Scrum/Híbrido). |
| | **GLPI** | Gestión de incidencias, tickets de soporte e inventario TI. |
| | **Nextcloud** | Nube privada para almacenamiento de documentación. |
| | **JupyterLab (Python)** | Análisis de datos (Pandas), reportes y pruebas de estrés. |
| **Seguridad** | **SSL/HTTPS (Self-Signed)** | Encriptación de tráfico en tránsito. |
| | **Helmet (Backend)** | Hardening: Configuración de cabeceras HTTP seguras. |
| | **Simple Firewall** | Control de tráfico de salida (Egress Firewall) en contenedores. |
| | **Mitigación DDoS** | Rate Limiting para prevenir ataques de fuerza bruta/DoS. |

---

## 🚀 Instalación y Despliegue

### Prerrequisitos
* Docker Engine instalado.
* Docker Compose instalado.
* Git.
* OpenSSL (generalmente incluido en Git Bash o Linux).

### Pasos para levantar el entorno

1.  **Clonar el repositorio:**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd nombre-del-proyecto
    ```

2.  **Configurar variables de entorno (.env):**
    Crea un archivo llamado `.env` en la raíz del proyecto y agrega el siguiente contenido (asegúrate de que los credenciales de Docker sean correctos):

    ```properties
    # Credenciales de Docker Hub (para Watchtower/Pull)
    DOCKER_USERNAME=chechi20
    DOCKER_PASSWORD=

    # Configuración de GLPI
    GLPI_DB_HOST=glpi-db
    GLPI_DB_PORT=3306
    GLPI_DB_NAME=glpi
    GLPI_DB_USER=glpi
    GLPI_DB_PASSWORD=glpi
    ```

3.  **Generar Certificados SSL (HTTPS):**
    Es necesario generar los certificados locales antes de iniciar los contenedores para que el proxy reverso funcione correctamente. Ejecuta el siguiente comando en tu terminal (Git Bash o Linux):

    ```bash
    mkdir -p certs
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
      -keyout certs/nginx.key \
      -out certs/nginx.crt \
      -subj "//C=AR/ST=BuenosAires/L=CABA/O=HIA-TPF/OU=IT/CN=localhost"
    ```

4.  **Construir y levantar contenedores:**
    ```bash
    docker-compose up -d --build
    ```

5.  **Verificar estado de los servicios:**
    ```bash
    docker-compose ps
    ```

---

