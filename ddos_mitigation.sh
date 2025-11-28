#!/bin/bash

# Configuración
UMBRAL=20             # Conexiones máximas permitidas por IP
TIEMPO_ESPERA=5       # Segundos entre escaneos
LISTA_BLANCA="127.0.0.1 ::1" # IPs seguras (localhost)

echo "🛡️  [DEFENSA ACTIVA] Iniciando monitor de DDoS..."
echo "🔎  Escaneando tráfico en interfaz HOST (Protege Frontend :80 y Backend :3000)"
echo "⛔  Regla: Bloquear IPs con más de $UMBRAL conexiones."

while true; do
    # Obtenemos conexiones, ordenamos por cantidad y leemos
    netstat -ntu | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -nr | while read count ip; do
        
        # 1. Filtros básicos (ignorar líneas vacías o encabezados)
        if [ -z "$ip" ] || [ "$ip" == "Address" ] || [ "$ip" == "servers)" ]; then continue; fi
        
        # 2. Verificar Lista Blanca (No bloquearse a uno mismo)
        if [[ " $LISTA_BLANCA " =~ " $ip " ]]; then continue; fi

        # 3. Lógica de Bloqueo
        if [ "$count" -gt "$UMBRAL" ]; then
            # Chequear si ya está bloqueada para no repetir logs
            ESTADO_BLOQUEO=$(iptables -L INPUT -v -n | grep "$ip")
            
            if [ -z "$ESTADO_BLOQUEO" ]; then
                echo "🚨 [ATAQUE DETECTADO] La IP $ip tiene $count conexiones activas."
                echo "⚔️  Acción: Bloqueando acceso total al servidor (iptables DROP)..."
                
                iptables -A INPUT -s "$ip" -j DROP
                
                echo "✅ [MITIGADO] Amenaza neutralizada: IP $ip bloqueada."
            fi
        fi
    done
    sleep $TIEMPO_ESPERA
done