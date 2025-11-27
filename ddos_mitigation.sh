#!/bin/bash
UMBRAL=15 
TIEMPO_ESPERA=10

echo "🛡️  Iniciando servicio de mitigación DDoS..."
echo "Configuración: Bloquear IPs con más de $UMBRAL conexiones."

while true; do
    netstat -ntu | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -nr | while read count ip; do
        if [ -z "$ip" ] || [ "$ip" == "Address" ] || [ "$ip" == "servers)" ]; then continue; fi
        if [ "$count" -gt "$UMBRAL" ]; then
            ESTADO_BLOQUEO=$(iptables -L INPUT -v -n | grep "$ip")
            if [ -z "$ESTADO_BLOQUEO" ]; then
                echo "🚨 ALERTA: IP $ip detectada con $count conexiones. Bloqueando..."
                iptables -A INPUT -s "$ip" -j DROP
                echo "✅ IP $ip bloqueada."
            fi
        fi
    done
    sleep $TIEMPO_ESPERA
done