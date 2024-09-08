FROM postgres:15-alpine

COPY init.sql /docker-entrypoint-initdb.d/

# COPY custom-postgresql.conf /etc/postgresql/postgresql.con Expose the default Postgres port

CMD ["postgres"]