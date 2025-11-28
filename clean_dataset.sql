USE tpf_db_d;

SET FOREIGN_KEY_CHECKS = 0;

DELETE c
FROM cuotas c
JOIN alquileres a ON a.id = c.alquilerId
WHERE a.numeroAlquiler LIKE 'A%';

DELETE n
FROM novedades n
JOIN alquileres a ON a.id = n.alquilerId
WHERE a.numeroAlquiler LIKE 'A%';

DELETE p
FROM promociones p
JOIN alquileres a ON a.id = p.alquilerId
WHERE a.numeroAlquiler LIKE 'A%';

DELETE FROM alquileres
WHERE numeroAlquiler LIKE 'A%';

DELETE FROM locales
WHERE numero LIKE 'L%';

DELETE FROM usuarios
WHERE usuario LIKE 'user%';

SET FOREIGN_KEY_CHECKS = 1;