const pool = require('../../database');
const moment = require('moment');

let user;
let userQueue;

const commands = {

  //       ___           __        __   ___  __
  //  |  |  |  | |    | |  \  /\  |  \ |__  /__`
  //  \__/  |  | |___ | |__/ /~~\ |__/ |___ .__/
  //

  // Vaciar la tabla Queue
  clear: {
    response: async function (command, name, message = '') {
      if (message === '') {
        await pool.query('TRUNCATE TABLE queue_users');

        return 'Puff, se ha borrado la lista de funación ╰(*°▽°*)╯';
      } else {
        await pool.query('DELETE FROM queue_users');
        await pool.query('DELETE FROM users');

        return 'Puff, se reinició la lista semanal (∩^o^)⊃━☆';
      }
    }
  },

  // Informa al usuario de su posición en la lista
  position: {
    response: async function (command, name, message = '') {
      if (message === '') {
        if (!await checkUser(name)) {
          const newuser = { name };
          const { insertId } = await pool.query('INSERT INTO users set ?', [newuser]);
          user.id = insertId;
        }

        if (!await checkUserQueue(user.id)) {
          return '¡No estas en la lista! Escribe !funame (solo suscriptores) o !lectura para ver como unirte 🌙';
        } else {
          const pos = await getPosition(user.id);
          return pos !== 1 ? `¿Esperando tu funación? Estas en el lugar #${pos}` : 'Según mis cálculos, deberían estarte funando en este momento... ¿Alo? ¿Kirzhe?';
        }
      } else {
        const regex = /@/;
        if (!message.match(regex)) {
          return 'Ingresa el usuario a añadir utilizando @nombre';
        }

        message = message.slice(1);

        if (!await checkUser(message)) {
          return `Parece que "${message}" no esta en la lista (｡･∀･)ﾉﾞ`;
        }

        if (!await checkUserQueue(user.id)) {
          return `Parece que "${message}" no esta en la lista (｡･∀･)ﾉﾞ`;
        } else {
          const pos = await getPosition(user.id);
          return pos !== 1 ? `"${message}" Esta esperando su funa en la posición: #${pos}` : `Deberían estar funando a "${message}" en este momento... ¿Alo? ¿Kirzhe?`;
        }
      }
    }
  },

  // Da información sobre la queue
  info: {
    response: async function (command, name, message) {
      const [users] = await pool.query('SELECT COUNT(user_id) AS UsersWaiting FROM queue_users');

      if (users.UsersWaiting === 0) {
        return '(*/ω＼*) Parece que no hay nadie anotado para la funación';
      }

      const time = new Date();
      return `(✿◠‿◠) Hay ${users.UsersWaiting === 1 ? '1 persona' : `${users.UsersWaiting} personas`} esperando su funación, acabando aproximadamente a las: ${moment(time).add(users.UsersWaiting * 7, 'm').format('HH:mm:ss')}`;
    }
  },

  //         __   __   ___  __        __   __   __
  //   |\/| /  \ |  \ |__  |__)  /\  |  \ /  \ |__)
  //   |  | \__/ |__/ |___ |  \ /~~\ |__/ \__/ |  \
  //

  // Este comando agrega a un usuario remoto a la lista de espera.
  add: {
    response: async function (command, name, message = '') {
      const regex = /@/;
      if (!message.match(regex)) {
        return 'Ingresa el usuario a añadir utilizando @nombre';
      }

      message = message.slice(1);

      if (!await checkUser(message)) {
        const newuser = { name };
        const { insertId } = await pool.query('INSERT INTO users set ?', [newuser]);
        user.id = insertId;
      }

      if (await checkUserQueue(user.id)) {
        return `"${message}" ya se encuentra en la lista, posición: #${await getPosition(user.id)}`;
      } else {
        const newuser = { user_id: user.id, message };
        await pool.query('INSERT INTO queue_users set ?', [newuser]);

        return `Has agregado a "${message}" a la lista de espera, posición: #${await getPosition(user.id)}`;
      }
    }
  },

  // Este comando remueve a un usuario remoto a la lista de espera.
  remove: {
    response: async function (command, name, message = '') {
      const regex = /@/;
      if (!message.match(regex)) {
        return 'Ingresa el usuario a añadir utilizando @nombre';
      }

      message = message.slice(1);

      if (!await checkUser(message)) {
        return `Parece que "${message}" no esta en la lista (｡･∀･)ﾉﾞ`;
      }

      if (await checkUserQueue(user.id)) {
        await pool.query(`DELETE FROM queue_users WHERE user_id=${user.id}`);
        await pool.query(`DELETE FROM users WHERE name=${message}`);
        return `(o゜▽゜)o☆ Se removio a "${message}" de la lista`;
      } else {
        return `Parece que "${message}" no esta en la lista (｡･∀･)ﾉﾞ`;
      }
    }
  },

  //   __        __   __   __     __  ___  __   __   ___  __
  //  /__` |  | /__` /  ` |__) | |__)  |  /  \ |__) |__  /__`
  //  .__/ \__/ .__/ \__, |  \ | |     |  \__/ |  \ |___ .__/
  //

  // Remueve al suscriptor de la lista
  leave: {
    response: async function (command, name, message) {
      if (!await checkUser(name)) {
        return 'Al parecer no te encontrabas en la lista de funación de todos modos (｡･∀･)ﾉﾞ';
      }

      if (await checkUserQueue(user.id)) {
        await pool.query(`DELETE FROM queue_users WHERE user_id=${user.id}`);
        await pool.query(`DELETE FROM users WHERE name='${name}'`);
        return 'Te has salido de la lista de espera (T_T)';
      } else {
        return 'Al parecer no te encontrabas en la lista de funación de todos modos (｡･∀･)ﾉﾞ';
      }
    }
  },

  // Agregarse a si mismo a la lista
  join: {
    response: async function (command, name, message = 'Suscriptor') {
      if (!await checkUser(name)) {
        const newuser = { name };
        const { insertId } = await pool.query('INSERT INTO users set ?', [newuser]);
        user.id = insertId;
      } else {
        return '( ´･･)ﾉ(._.`) Ya usaste tu canje de suscripción esta semana';
      }

      if (await checkUserQueue(user.id)) {
        return `Ya estas en la lista ผ(•̀_•́ผ), tu posición es: #${await getPosition(user.id)}`;
      } else {
        const newuser = { user_id: user.id, message };
        await pool.query('INSERT INTO queue_users set ?', [newuser]);

        return `¡Te uniste a la funación! Tu posición es: #${await getPosition(user.id)}, por favor espera tu turno o(*°▽°*)o`;
      }
    }
  }
};

async function checkUser (name) {
  [user] = await pool.query(`SELECT * FROM users WHERE name='${name}'`);

  if (typeof user === 'undefined') {
    user = {};
    return false;
  }

  return true;
}

async function checkUserQueue (id) {
  [userQueue] = await pool.query(`SELECT * FROM queue_users WHERE user_id=${id}`);

  if (typeof userQueue === 'undefined') {
    return false;
  }

  return true;
}

async function getPosition (id) {
  const [date] = await pool.query(`SELECT created_at FROM queue_users WHERE user_id=${id}`);
  const timeStamp = moment(date.created_at).format('YYYY-MM-DD HH:mm:ss');
  const data = await pool.query(`SELECT user_id FROM queue_users WHERE created_at<"${timeStamp}" ORDER BY created_at ASC`);

  return data.length + 1;
}

module.exports = commands;
