const pool = require('../../database');
const moment = require('moment');

let id;

// Esta sección controla como los comandos funcionan, se exportan a command.js y envian una respuesta de regreso
const commands = {

  // Vaciar la lista secundaria
  clear: {
    response: async function () {
      await pool.query('TRUNCATE TABLE queue_users');
      return 'Puff, se ha borrado la lista de funación ╰(*°▽°*)╯';
    }
  },

  // Vacia la lista secundaria y la primaria
  reset: {
    response: async function () {
      await pool.query('DELETE FROM queue_users');
      await pool.query('DELETE FROM users');

      return 'Puff, se reinició la lista semanal (∩^o^)⊃━☆';
    }
  },

  // Informa al usuario de su posición en la lista
  position: {
    response: async function (user, message = '') {
      // - Si el comando es llamado sin argumentos, entonces se refiere a si mismo
      if (message === '') {
        // - Si el usuario no esta en la lista primaria se le informa
        if (await checkUser(user.name) === 0) {
          return '¡No estas en la lista! Escribe !funame (solo suscriptores) o !lectura para ver como unirte 🌙';
        }

        // - Asignación del id al objeto usuario
        user.id = id;

        // - Si el usuario no esta en ninguna de las dos listas
        if (await checkUserQueue(user.id) === 0) {
          return '¡No estas en la lista! Escribe !funame (solo suscriptores) o !lectura para ver como unirte 🌙';

        // - Si el usuario se encuentra en la lista secundaria
        } else {
          const pos = await getPosition(user.id);
          return pos !== 1 ? `¿Esperando tu funación? Estas en el lugar #${pos}` : 'Según mis cálculos, deberían estarte funando en este momento... ¿Alo? ¿Kirzhe?';
        }

      // - Si el comando viene con argumento significa que se busca conocer la posicion de otro usuario
      } else {
        // - Se valida el llamado del argumento con @
        const regex = /@/;
        if (!message.match(regex)) {
          return 'Ingresa el usuario a añadir utilizando @nombre';
        }

        // - Se elimina el @ del argumento
        message = message.slice(1);

        // - Si el usuario no esta en la lista principal
        if (await checkUser(message) === 0) {
          return `Parece que "${message}" no esta en la lista (｡･∀･)ﾉﾞ`;
        }

        // - Asignación del id al objeto usuario
        user.id = id;

        // - Si el usuario no esta en ninguna de las dos listas
        if (await checkUserQueue(user.id) === 0) {
          return `Parece que "${message}" no esta en la lista (｡･∀･)ﾉﾞ`;

        // - Si el usuario se encuentra en la lista secundaria
        } else {
          const pos = await getPosition(user.id);
          return pos !== 1 ? `"${message}" Esta esperando su funa en la posición: #${pos}` : `Deberían estar funando a "${message}" en este momento... ¿Alo? ¿Kirzhe?`;
        }
      }
    }
  },

  // Da información sobre la queue
  info: {
    response: async function () {
      const [users] = await pool.query('SELECT COUNT(user_id) AS UsersWaiting FROM queue_users');
      const allUsers = await pool.query('SELECT display_name FROM users WHERE id NOT IN (SELECT user_id FROM queue_users)');

      if (users.UsersWaiting === 0) {
        return '(*/ω＼*) Parece que no hay nadie anotado para la funación';
      }

      // const time = new Date();
      // return `(✿◠‿◠) Hay ${users.UsersWaiting === 1 ? '1 persona' : `${users.UsersWaiting} personas`} esperando su funación, acabando aproximadamente a las: ${moment(time).add(users.UsersWaiting * 7, 'm').format('HH:mm:ss')} hrs`;
      return `(✿◠‿◠) Hay ${users.UsersWaiting === 1 ? '1 persona' : `${users.UsersWaiting} personas`} esperando su funación, esta semana se han hecho ${allUsers.length} ${allUsers.length === 1 ? 'funación' : 'funaciones'}`;
    }
  },

  // Agrega a un usuario remoto a la lista de espera.
  add: {
    response: async function (user, message = '', userLevel = '-') {
      // - Se valida el llamado del argumento con @
      const regex = /@/;
      if (!message.match(regex)) {
        return 'Ingresa el usuario a añadir utilizando @nombre';
      }

      // - Se elimina el @ del argumento
      message = message.slice(1);
      user.name = message.toLowerCase();
      user.displayName = message;

      // Si el usuario no se encuentra en la lista principal
      if (await checkUser(user.name) === 0) {
        const addUser = {
          name: user.name,
          display_name: user.displayName,
          provider: user.provider,
          provider_id: String(Math.floor((Math.random() * 899999999) + 100000000))
        };

        const { insertId } = await pool.query('INSERT INTO users set ?', [addUser]);

        // - Asignación del id al objeto usuario
        user.id = insertId;

      // Si el usuario se encuentra en la lsita principal
      } else {
        // - Asignación del id al objeto usuario
        user.id = id;
      }

      // Función extra jeje
      if (message === 'Kirzheka') {
        message = 'ヾ(⌐■_■)ノ♪ Eres tu';
      } else {
        // Cambia el mensaje acorde al argumento
        switch (userLevel) {
          case 'p':
            message = 'Puntos';
            break;
          case 'b':
            message = 'Bits';
            break;
          case 'd':
            message = 'Donación';
            break;
          case 's':
            message = 'Sorteo';
            break;
          default:
            message = 'Otro';
        }
      }

      // Si el usuario no se encuentra en ninguna lista
      if (await checkUserQueue(user.id) === 0) {
        const userQueue = { user_id: user.id, message, user_level: userLevel };
        await pool.query('INSERT INTO queue_users set ?', [userQueue]);

        return `Has agregado a "${user.displayName}" a la lista de espera, posición: #${await getPosition(user.id)}`;

      // Si el usuario se encuentra en la lista secundaria
      } else {
        return `"${user.displayName}" ya se encuentra en la lista, posición: #${await getPosition(user.id)}`;
      }
    }
  },

  // Este comando remueve a un usuario remoto a la lista de espera.
  remove: {
    response: async function (user, message = '') {
      // - Se valida el llamado del argumento con @
      const regex = /@/;
      if (!message.match(regex)) {
        return 'Ingresa el usuario a añadir utilizando @nombre';
      }

      // - Se elimina el @ del argumento
      message = message.slice(1);
      user.name = message.toLowerCase();
      user.displayName = message;

      // - Si el usuario no se encuentra en la lista principal
      if (await checkUser(user.name) === 0) {
        return `Parece que "${user.displayName}" no esta en la lista (｡･∀･)ﾉﾞ`;
      }

      // - Asignación del id al objeto usuario
      user.id = id;

      // - Si el usuario no se encuentra en la lista secundaria
      if (await checkUserQueue(user.id) === 0) {
        return `Parece que "${user.displayName}" no esta en la lista (｡･∀･)ﾉﾞ`;

      // - Si el usuario se encuentra en la lista secundaria
      } else {
        await pool.query(`DELETE FROM queue_users WHERE user_id=${user.id}`);
        await pool.query(`DELETE FROM users WHERE name='${user.name}'`);
        return `(o゜▽゜)o☆ Se removio a "${user.displayName}" de la lista`;
      }
    }
  },

  // Este comando remueve a un usuario remoto por medio del ID
  removeById: {
    response: async function (userId) {
      const [userData] = await pool.query(`SELECT display_name FROM users WHERE id=${userId}`);
      await pool.query(`DELETE FROM queue_users WHERE user_id=${userId}`);
      // await pool.query(`DELETE FROM users WHERE id='${userId}'`);
      return `(o゜▽゜)o☆ Se removio a "${userData.display_name}" de la lista`;
    }
  },

  // Remueve al suscriptor de la lista
  leave: {
    response: async function (user) {
      // Si el usuario no se encuentra en la lista principal
      if (await checkUser(user.name) === 0) {
        return 'Al parecer no te encontrabas en la lista de todos modos (｡･∀･)ﾉﾞ';
      }

      // - Asignación del id al objeto usuario
      user.id = id;

      // Si el usuario no se encuentra en la lista secundaria
      if (await checkUserQueue(user.id) === 0) {
        return 'Al parecer no te encontrabas en la lista de todos modos (｡･∀･)ﾉﾞ';

      // Si el usuario se encuentra en la lista secundaria
      } else {
        await pool.query(`DELETE FROM queue_users WHERE user_id=${user.id}`);
        await pool.query(`DELETE FROM users WHERE id='${user.id}'`);

        return 'Te has salido de la lista de espera (T_T)';
      }
    }
  },

  // Agregarse a si mismo a la lista como suscriptor
  join: {
    response: async function (user, message) {
      // - Si el usuario no se encuentra en la lista principal
      if (await checkUser(user.name) === 0) {
        const addUser = {
          name: user.name,
          display_name: user.displayName,
          provider: user.provider,
          provider_id: user.providerId
        };

        const { insertId } = await pool.query('INSERT INTO users set ?', [addUser]);

        // - Asignación del id al objeto usuario
        user.id = insertId;

        // Función extra jeje
        if (user.display_name === 'Kirzheka') {
          message = 'ヾ(⌐■_■)ノ♪ Eres tu';
        } else {
          message = 'Suscriptor';
        }

        const userQueue = { user_id: user.id, message, user_level: user.userLevel };
        await pool.query('INSERT INTO queue_users set ?', [userQueue]);

        return `¡Te uniste a la funación! Tu posición es: #${await getPosition(user.id)}, por favor espera tu turno o(*°▽°*)o`;
      }

      // - Asignación del id al objeto usuario
      user.id = id;

      // - Si el usuario no se encuentra en la lista secundaria
      if (await checkUserQueue(user.id) === 0) {
        return '( ´･･)ﾉ(._.`) Ya usaste tu canje de suscripción esta semana';

      // - Si el usuario se encuentra en la lista secundaria
      } else {
        return `Ya estas en la lista ผ(•̀_•́ผ), tu posición es: #${await getPosition(user.id)}`;
      }
    }
  }
};

async function checkUser (name) {
  // Obtener el ID del usuario en la lista primaria
  const userID = await pool.query(`SELECT id FROM users WHERE name='${name}'`);

  // Si se encontro un ID, asignarlo a una variable ID general
  if (userID.length) { id = userID[0].id; }

  // Regresar true o false dependiendo del resultado de la busqueda
  return userID.length;
}

async function checkUserQueue (id) {
  // Onbtener el ID del usuario en la lista secundaria
  const queueID = await pool.query(`SELECT user_id FROM queue_users WHERE user_id=${id}`);

  // Regresar true o false dependiendo del resultado de la busqueda
  return queueID.length;
}

async function getPosition (id) {
  const [date] = await pool.query(`SELECT created_at FROM queue_users WHERE user_id=${id}`);
  const timeStamp = moment(date.created_at).format('YYYY-MM-DD HH:mm:ss');
  const data = await pool.query(`SELECT user_id FROM queue_users WHERE created_at<"${timeStamp}" ORDER BY created_at ASC`);

  return data.length + 1;
}

module.exports = commands;
