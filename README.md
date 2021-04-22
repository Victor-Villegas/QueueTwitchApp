# Acerca del proyecto
Nightbot Twitch Addon: Queue System fue diseñado para la streamer 'Kirzheka', es una extensión que permite a usuarios interactuar a travez de diversos comandos con la sección de lectura de Tarot, uniendose o saliendose de la fila asi como recibiendo información de la misma.

## Comandos
- clear: Permite a los moderadores limpiar la lista actual.
- reset: Permite a los moderadores reiniciar todos los registros.
- position: Permite a los usuarios saber su posición en la lista.
- info: Permite a los usuarios obtener información sobre la lista.
- join: Permite a los suscriptores unirse a la lista.
- leave: Permite a los suscriptores dejar la lista.
- add: Permite a los moderadores añadir a usuarios a la lista.
- remove: Permite a los moderadores sacar a usuarios de la lista.

## Instrucciones
- Cambia el archivo .env.example a .env e introduce tus parámetros MySQL.
- Cambia la variable DEVELOPER a "1" para hacer uso de la conexión localhost:3000.
- Ejecuta npm run dev para entrar a modo desarrollador utilizando nodemon.

## Changelog
Version 2.0.0:
- Envia alertas de sonido cuando un usuario se registra.
- Se actualiza automaticamente al detectar cambios en la base de datos.
- Funcionalidad más rápida.
