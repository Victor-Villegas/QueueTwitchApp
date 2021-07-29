const pool = require("../../database");
const moment = require("moment");

// Esta sección controla como los comandos funcionan, se exportan a command.js y envian una respuesta de regreso
const commands = {
  // Vaciar la lista secundaria
  clear: {
    response: async function () {
      await pool.query("TRUNCATE TABLE queue_users");

      const data = {
        sound: false,
        message: "Puff, se ha borrado la lista de funación ╰(*°▽°*)╯",
      };

      return data;
    },
  },

  // Vacia la lista secundaria y la primaria
  reset: {
    response: async function () {
      await pool.query("DELETE FROM queue_users");
      await pool.query("DELETE FROM users");

      const data = {
        sound: false,
        message: "Puff, se reinició la lista semanal (∩^o^)⊃━☆",
      };

      return data;
    },
  },

  // Informa al usuario de su posición en la lista
  position: {
    response: async function (user, message = "") {
      // - Si el comando es llamado sin argumentos, entonces se refiere a si mismo
      if (message === "") {
        // - Usuario en lista secundaria
        if ((await checkUserQueue(user.name)) !== 0) {
          const pos = await getPosition(user.name);
          return pos !== 1
            ? `¿Esperando tu funación? Estas en el lugar #${pos}`
            : "Según mis cálculos, deberían estarte funando en este momento... ¿Alo? ¿Kirzhe?";

          // - Usuario no en lista secundaria
        } else {
          return "¡No estas en la lista! Escribe !funame (solo suscriptores) o !lectura para ver como unirte 🌙";
        }

        // - Si el comando viene con argumento significa que se busca conocer la posición de otro usuario
      } else {
        // - Se valida el llamado del argumento con @
        const regex = /@/;
        if (!message.match(regex)) {
          return "Ingresa el usuario a añadir utilizando @nombre";
        }

        // - Se elimina el @ del argumento
        message = message.slice(1);
        user.name = message.toLowerCase();
        user.displayName = message;

        // - Usuario en lista secundaria
        if ((await checkUserQueue(user.name)) !== 0) {
          const pos = await getPosition(user.name);
          return pos !== 1
            ? `"${message}" Esta esperando su funa en la posición: #${pos}`
            : `Deberían estar funando a "${message}" en este momento... ¿Alo? ¿Kirzhe?`;

          // - Usuario no en lista secundaria
        } else {
          return `Parece que "${message}" no esta en la lista (｡･∀･)ﾉﾞ`;
        }
      }
    },
  },

  // Da información sobre la queue
  info: {
    response: async function () {
      const [queueUsers] = await pool.query(
        "SELECT COUNT(id) AS UsersWaiting FROM queue_users"
      );
      const [users] = await pool.query(
        "SELECT COUNT(id) AS UsersWaiting FROM users"
      );
      const [total] = await pool.query(
        "SELECT stat FROM queue_stats WHERE id=1"
      );

      // const time = new Date();
      // return `(✿◠‿◠) Hay ${users.UsersWaiting === 1 ? '1 persona' : `${users.UsersWaiting} personas`} esperando su funación, acabando aproximadamente a las: ${moment(time).add(users.UsersWaiting * 7, 'm').format('HH:mm:ss')} hrs`;
      return `(✿◠‿◠) Hay ${
        queueUsers.UsersWaiting === 1
          ? "1 persona"
          : `${queueUsers.UsersWaiting} personas`
      } esperando. Esta semana ${
        users.UsersWaiting === 1
          ? `ha participado ${users.UsersWaiting} persona`
          : `han participado ${users.UsersWaiting} personas`
      }. ¡En total llevamos ${total.stat} funaciones!`;
    },
  },

  // Agrega a un usuario remoto a la lista de espera.
  add: {
    response: async function (user, message = "", userLevel = "-") {
      const [queueStat] = await pool.query(
        "SELECT stat FROM queue_stats WHERE id=2"
      );
      if (queueStat.stat === 1) {
        // - Se valida el llamado del argumento con @
        const regex = /@/;
        if (!message.match(regex)) {
          return "Ingresa el usuario a añadir utilizando @nombre";
        }

        // - Se elimina el @ del argumento
        message = message.slice(1);
        user.name = message.toLowerCase();
        user.displayName = message;

        // - Usuario en lista secundaria
        if ((await checkUserQueue(user.name)) !== 0) {
          return `"${
            user.displayName
          }" ya se encuentra en la lista, posición: #${await getPosition(
            user.name
          )}`;

          // - Usuario no en lista secundaria
        } else {
          if (message === "Kirzheka") {
            message = "ヾ(⌐■_■)ノ♪ Eres tu";
          } else {
            switch (userLevel) {
              case "p":
                message = "Puntos";
                break;
              case "b":
                message = "Bits";
                break;
              case "d":
                message = "Donación";
                break;
              case "s":
                message = "Sorteo";
                break;
              default:
                message = "Otro";
            }
          }

          let newUserTimeStamp;

          if (message === "Sorteo") {
            const [date] = await pool.query(
              `SELECT * FROM queue_users ORDER BY id LIMIT 1`
            );
            const timeStamp = moment(date.created_at)
              .subtract(1, "minute")
              .format("YYYY-MM-DD HH:mm:ss");

            newUserTimeStamp = timeStamp;
          }

          const addUser = {
            name: user.name,
            display_name: user.displayName,
            provider: user.provider,
            provider_id: String(
              Math.floor(Math.random() * 899999999 + 100000000)
            ),
            message: message,
            created_at: newUserTimeStamp
              ? newUserTimeStamp
              : moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          };

          await pool.query("INSERT INTO queue_users set ?", [addUser]);

          const data = {
            sound: true,
            message: `Has agregado a "${
              user.displayName
            }" a la lista de espera, posición: #${await getPosition(
              user.name
            )}`,
          };

          return data;
        }
      } else {
        return "No estamos aceptando solicitudes en este momento, regresa después (｡･∀･)ﾉﾞ";
      }
    },
  },

  // Este comando remueve a un usuario remoto a la lista de espera.
  remove: {
    response: async function (user, message = "") {
      // - Se valida el llamado del argumento con @
      const regex = /@/;
      if (!message.match(regex)) {
        return "Ingresa el usuario a añadir utilizando @nombre";
      }

      // - Se elimina el @ del argumento
      message = message.slice(1);
      user.name = message.toLowerCase();
      user.displayName = message;

      // - Usuario en lista secundaria
      if ((await checkUserQueue(user.name)) !== 0) {
        await pool.query(`DELETE FROM queue_users WHERE name='${user.name}'`);

        const data = {
          sound: false,
          message: `(o゜▽゜)o☆ Se removió a "${user.displayName}" de la lista`,
        };

        return data;

        // - Usuario no en lista secundaria
      } else {
        return `Parece que "${user.displayName}" no esta en la lista (｡･∀･)ﾉﾞ`;
      }
    },
  },

  // Este comando remueve a un usuario remoto por medio del ID
  removeByName: {
    response: async function (userName, method = false) {
      // - Removing queue request
      if (Boolean(method) === true) {
        const [userData] = await pool.query(
          `SELECT display_name FROM queue_users WHERE name='${userName}'`
        );
        await pool.query(`DELETE FROM queue_users WHERE name='${userName}'`);

        const data = {
          sound: false,
          message: `(o゜▽゜)o☆ Se removió a "${userData.display_name}" de la lista`,
        };

        return data;
      }

      // - Acepting queue request
      const [userData] = await pool.query(
        `SELECT created_at, name, display_name, provider, provider_id FROM queue_users WHERE name='${userName}'`
      );
      await pool.query(`DELETE FROM queue_users WHERE name='${userName}'`);

      const userExist = await pool.query(
        `SELECT id FROM users WHERE name='${userName}'`
      );
      if (userExist.length === 0) {
        await pool.query("INSERT INTO users set ?", [userData]);
      }

      const userStat = await pool.query(
        `SELECT id FROM user_stats WHERE name='${userName}'`
      );
      if (userStat.length !== 0) {
        await pool.query(
          `UPDATE user_stats SET readings=readings+1 WHERE name='${userName}'`
        );
      } else {
        userData.readings = 1;
        delete userData.created_at;
        await pool.query("INSERT INTO user_stats set ?", [userData]);
      }

      await pool.query("UPDATE queue_stats SET stat=stat+1 WHERE id=1");

      const data = {
        sound: false,
        message: `¡Listo! Se registro la funación de "${userData.display_name}" ( •̀ ω •́ )✧`,
      };

      return data;
    },
  },

  // Remueve al suscriptor de la lista
  leave: {
    response: async function (user) {
      // - Usuario en lista secundaria
      if ((await checkUserQueue(user.name)) !== 0) {
        await pool.query(`DELETE FROM queue_users WHERE name='${user.name}'`);

        const data = {
          sound: false,
          message: "Te has salido de la lista de espera (T_T)",
        };

        return data;

        // - Usuario no en lista secundaria
      } else {
        return "Al parecer no te encontrabas en la lista de todos modos (｡･∀･)ﾉﾞ";
      }
    },
  },

  // Agregarse a si mismo a la lista como suscriptor
  join: {
    response: async function (user, message) {
      const [queueStat] = await pool.query(
        "SELECT stat FROM queue_stats WHERE id=2"
      );
      if (queueStat.stat === 1) {
        // - Usuario en lista principal
        if ((await checkUser(user.name)) !== 0) {
          return "( ´･･)ﾉ(._.`) Ya usaste tu canje de suscripción esta semana";

          // - Usuario no en lista principal
        } else {
          // - Usuario en lista secundaria
          if ((await checkUserQueue(user.name)) !== 0) {
            return `Ya estas en la lista ผ(•̀_•́ผ), tu posición es: #${await getPosition(
              user.name
            )}`;

            // - Usuario no en lista secundaria
          } else {
            if (user.display_name === "Kirzheka") {
              message = "ヾ(⌐■_■)ノ♪ Eres tu";
            } else {
              message = "Suscriptor";
            }

            const addUser = {
              name: user.name,
              display_name: user.displayName,
              provider: user.provider,
              provider_id: user.providerId,
              message: message,
            };

            await pool.query("INSERT INTO queue_users set ?", [addUser]);

            const data = {
              sound: true,
              message: `¡Te uniste a la funación! Tu posición es: #${await getPosition(
                user.name
              )}, por favor espera tu turno o(*°▽°*)o`,
            };

            return data;
          }
        }
      } else {
        return "No estamos aceptando solicitudes en este momento, regresa después (｡･∀･)ﾉﾞ";
      }
    },
  },

  open: {
    response: async function () {
      const [queueStat] = await pool.query(
        "SELECT stat FROM queue_stats WHERE id=2"
      );

      if (queueStat.stat === 1) {
        return "La lista ya se encuentra abierta ψ(._. )>";
      }

      await pool.query("UPDATE queue_stats SET stat=1 WHERE id=2");

      return "¡La funación ha comenzado oficialmente! Escribe !funame (solo suscriptores) o !lectura para ver como unirte 🌙";
    },
  },

  close: {
    response: async function () {
      const [queueStat] = await pool.query(
        "SELECT stat FROM queue_stats WHERE id=2"
      );

      if (queueStat.stat === 0) {
        return "La lista ya se encuentra cerrada ψ(._. )>";
      }

      await pool.query("UPDATE queue_stats SET stat=0 WHERE id=2");

      return "¡La funación ha finalizado! Gracias a todos por participar (｡･∀･)ﾉﾞ";
    },
  },
};

async function checkUser(name) {
  const userID = await pool.query(`SELECT id FROM users WHERE name='${name}'`);

  return userID.length;
}

async function checkUserQueue(name) {
  const userID = await pool.query(
    `SELECT id FROM queue_users WHERE name='${name}'`
  );

  return userID.length;
}

async function getPosition(name) {
  const [date] = await pool.query(
    `SELECT created_at FROM queue_users WHERE name='${name}'`
  );
  const timeStamp = moment(date.created_at).format("YYYY-MM-DD HH:mm:ss");
  const data = await pool.query(
    `SELECT id FROM queue_users WHERE created_at<"${timeStamp}" ORDER BY created_at ASC`
  );

  return data.length + 1;
}

module.exports = commands;
