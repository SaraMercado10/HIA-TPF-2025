FROM alpine:3.7

# Instalar dependencias en tiempo de ejecución.
# netcat-openbsd es necesario porque el nc de busybox no soporta la bandera -k
RUN apk --update add \
  iptables \
  ip6tables \
  netcat-openbsd

# Valores por defecto (se pueden sobreescribir en docker-compose.yml)
ENV ALLOW_IP_ADDRESS 1.1.1.1
ENV ALLOW_PORT 53
ENV ALLOW_PROTO udp
ENV FIREWALL_READY_SIGNAL_PORT 60000

# Copiar y configurar el script de firewall
COPY ./setup_firewall.sh /firewall/
RUN chmod +x /firewall/setup_firewall.sh

ENTRYPOINT [ "/firewall/setup_firewall.sh" ]