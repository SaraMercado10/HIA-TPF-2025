#!/bin/sh

# Configura un firewall ipv4 de salida restrictivo que solo permite tráfico a un
# destino (dirección, protocolo, puerto, dirección ip).

# Salir en el primer código de salida distinto de cero.
set -e

echo "Initializing Firewall"

# Limpiar tabla de salida.
iptables --flush OUTPUT

# Descartar tráfico no coincidente (Drop).
iptables --policy OUTPUT DROP

# Permitir tráfico correspondiente al tráfico entrante.
iptables \
  --append OUTPUT \
  --match conntrack \
  --ctstate ESTABLISHED,RELATED \
  --jump ACCEPT

# Permitir tráfico a la interfaz loopback.
iptables \
  --append OUTPUT \
  --out-interface lo \
  --jump ACCEPT

# Permitir tráfico a interfaces de túnel (opcional, útil si usas VPNs).
iptables \
  --append OUTPUT \
  --out-interface tap0 \
  --jump ACCEPT

iptables \
  --append OUTPUT \
  --out-interface tun0 \
  --jump ACCEPT

# Permitir tráfico al destino único permitido (definido en variables de entorno).
iptables \
  --append OUTPUT \
  --destination "${ALLOW_IP_ADDRESS}" \
  --protocol "${ALLOW_PROTO}" \
  --dport "${ALLOW_PORT}" \
  --jump ACCEPT

# Permitir tráfico local a la red docker.
# El rango de direcciones locales enrutadas por la interfaz eth0.
# Nota: Al compartir red con el frontend, eth0 es la interfaz del frontend.
docker_network=$(ip -o addr show dev eth0 | awk '$3 == "inet" {print $4}')

iptables \
  --append OUTPUT \
  --destination ${docker_network} \
  --jump ACCEPT

echo "Firewall Initialized"

# Aceptar conexiones en el puerto para señalar que el firewall está activo.
nc -l -k -p $FIREWALL_READY_SIGNAL_PORT localhost