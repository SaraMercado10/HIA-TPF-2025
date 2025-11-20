
FROM mysql:8.0

COPY backup.sh /usr/local/bin/backup.sh

RUN chmod +x /usr/local/bin/backup.sh

CMD ["/bin/bash", "-c", "while true; do /usr/local/bin/backup.sh; sleep 300; done"]