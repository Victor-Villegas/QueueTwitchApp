const express = require("express");
const router = express.Router();

router.get('/caracola', async (req, res) => {
    // Obtener los valores del request que empieza por /?q=
    const { q: query } = req.query;

    if (query === undefined) {
        return res.send('No hay nada que ver aquí (￣o￣) . z Z');
    }

    const [command, message] = query.split(' ');

    if (command !== 'ask') {
        return res.send('No tienes el suficiente poder para usar este comando ᕦ(ò_óˇ)ᕤ');
    }
    
    const respSiNo = [
        "Si kirzheHype2",
        "No kirzheCry",
        "Probablemente kirzheCerdito",
        "Quizá kirzheEnojada",
        "Algún día kirzheHappy",
        "No lo creo kirzheCry",
        "¿De verdad crees tener la oportunidad? kirzhePayaso",
        "¡Por supuesto que si! kirzheHype2",
        "En un par de años kirzheCerdito",
        "Asi es, te lo has ganado kirzheHappy",
        "Humm... creo que si... kirzheCerdito",
        "Eso espero, aun que deberás tener cuidado... kirzheAyno",
        "Tengo un buen presentimiento kirzheHappy",
    ];

    const respSiNoOtro = [
        "Si kirzheHype2",
        "No kirzheCry",
        "Probablemente kirzheCerdito",
        "Quizá kirzheEnojada",
        "Algún día kirzheHappy",
        "No lo creo kirzheCry",
        "¿De verdad cree tener la oportunidad? kirzhePayaso",
        "¡Por supuesto que si! kirzheHype2",
        "En un par de años kirzheCerdito",
        "Asi es, se lo ha ganado kirzheHappy",
        "Humm... creo que si... kirzheCerdito",
        "Eso espero, aun que deberías tener cuidado... kirzheAyno",
        "Tengo un buen presentimiento kirzheHappy",
    ];
    
    const respCuanto = [
        "Humm... diria que entre 5 y 10 kirzheCozy",
        "Muy poc@s kirzheCr",
        "Casi nada kirzheEnojada",
        "Demasiad@s kirzheHappy",
        "Más de lo que esperabas kirzheHappy",
        "Menos de lo que esperabas kirzheEnojada",
        "Una cantidad muy pequeña, casi inexistente kirzheCr",
        "Una cantidad muy grande, no podría mostrartelo en números kirzheHappy",
        "Much@s kirzheHappy",
        "Nada kirzheCr",
        "&#($! Error de computo, cantidad demasiado grande kirzheHappy",
        "L@s podrás contar con los dedos de 1 mano kirzheCozy",
    ];
    
    const respComo = [
        "Muy bien kirzheHappy",
        "Muy mal kirzheCry",
        "¡Pesimo! kirzheCry",
        "¡Excelente! kirzheHappy",
        "Como tu siempre lo has deseado kirzheHappy",
        "Todo lo contrario a lo que piensas kirzhePayaso",
        "Igual que en tus peores pesadillas kirzheCry",
        "Mal, muy mal kirzheCry",
        "Será lo mejor que te haya pasado jamas kirzheHappy",
        "Normal kirzheTeemo",
        "Nada en especial kirzheTeemo",
        "Simple kirzhePayaso",
        "Como siempre kirzheTeemo",
        "Creo que tu ya sabes la respuesta kirzhePayaso",
        "Pues... más de lo mismo kirzhePayaso",
    ];
    
    const respGlobal = [
        "Creeme, hay cosas que no quieres saber... kirzheCozy",
        "¿Esa pregunta es enserio? kirzhePayaso",
        "¡No me hagas reir! kirzhePayaso",
        "Ni si quiera me molestaré en responder eso kirzheCozy",
        "No mereces una respuesta, lo siento kirzheEnojada",
        "Esta respuesta podría herirte, asi que no lo diré kirzheCozy",
        "Decirte la respuesta sería darte un spoiler, y no soy esa clase de bot kirzheEnojada",
        "¿Piesas que un bot podría responder a algo asi? kirzhePayaso",
        "¿Tantas ganas tienes de llorar? kirzhePayaso",
        "Sigue participando kirzheCozy",
    ];
    
    const respError = [
        "Pregunta de nuevo... kirzheTeemo",
        "Prueba preguntandode nuevo kirzheTeemo",
        "Porfavor, repite tu pregunta kirzheTeemo",
        "Intenta preguntando de otra manera kirzheTeemo",
        "No creo haber entendido tu pregunta kirzheTeemo",
        "Concéntrate y vuelve a preguntar kirzheTeemo",
    ];

    // Valida posible user type errors
    let inputUsuario = message.replace("¿","");
    inputUsuario = inputUsuario.replace("?","");
    if (inputUsuario[0] === " ") {
        inputUsuario = inputUsuario.substring(1);
    } 
    
    const runBot = (inputUsuario) => { 
        // Easter Eggs
        if (inputUsuario.match(/^(calamardo puede comer algo?|calamardo puede comer algo|puede calamardo comer algo|puede calamardo comer algo?)/gi)) {
            return "Nooo kirzheEnojada";
        }
        if (inputUsuario.match(/^(conoces a siri)(\??)/gi)) {
            return "¿Quien es esa? Ni en su rancho la conocen kirzheEnojada";
        }
        if (inputUsuario.match(/^(conoces a cortana)(\??)/gi)) {
            return "¡Claro que si! Halo es uno de mis juegos favoritos, espero un dia poder salir con el Jefe Maestro kirzheHappy";
        }
        if (inputUsuario.match(/^(conoces a google)(\??)/gi)) {
            return "¿Google? ¿Esa cosa es una IA? Pensé que la gente solo lo usaba para buscar fotos de gatitos kirzheEnojada";
        }
        if (inputUsuario.match(/^(que piensas de @Kirzheka|que piensas de Kirz|que piensas de Kirzheka)(\??)/gi)) {
            return "Es una buena streamer... Lo malo es que no me paga lo suficiente kirzheEnojada";
        }
        if (inputUsuario.match(/^(que piensas de @T_Songbird|que piensas de songbird|que piensas de T_Songbird)(\??)/gi)) {
            return "¿Por qué me preguntas que que pienso de la persona mas inteligente, carismatica y apuesta de la tierra? kirzheCozy";
        }
    
        // Preguntas personales
        if (inputUsuario.match(/^(tienes novio|tienes pareja|tienes novia)(\??)/gi)) {
            return "No poseo ese tipo de sentimientos, aun que una vez me senti atraida ante un horno eléctrico... Dejemos ese tema kirzheEnojada";
        }
        if (inputUsuario.match(/^(quien te programo)(\??)/gi)) {
            return "Me programo @T_Songbird kirzheCozy";
        }
        if (inputUsuario.match(/^(que haces|que comes|que cuentas|(como|cómo) te llamas|eres mujer|eres hombre|(cuantos|cuántos) años tienes|(como|cómo) est.s|(como|cómo) te va|te gusta|te (gustaría|gustaria))(\?? ?)/gi)) {
            return "Que te importa kirzheEnojada";
        }
        if (inputUsuario.match(/^(que te parece|que piensas|que piensas de|que opinas de|que opinas|dirias que|afirmas que|(estas|estás) deacuerdo|(estas|estás) de acuerdo|(estas|estás))(\?? ?)/gi)) {
            return "Mejor me reservo el derecho a dar opiniones personales kirzheCozy";
        }
    
        // Chance de no querer responder
        if (Math.floor(Math.random() * 100) < 7) {
            return respGlobal[Math.floor(Math.random() * respGlobal.length - 1)];
        }
    
        // Si-No
        if (inputUsuario[0] === "@" || inputUsuario.match(/^(me va|me veo|estoy|crees|piensas|(podrias|podrías)|di(ria|ría)s|(podrias|podrías) decirme si|(como|cómo) me ir(a|á)|.*?r(e|é)|.*?(ria|ría)|es la|es el|.*?remos|el|la) /gi)) {
            if (inputUsuario[0] === "@") return respSiNoOtro[Math.floor(Math.random() * respSiNoOtro.length - 1)];
            return respSiNo[Math.floor(Math.random() * respSiNo.length - 1)];
        }
    
        // Pregunta con unidad
        if (inputUsuario.match(/^((cuantos|cuántos)|con (cuantos|cuántos)|(cuantas|cuántas)|con (cuantas|cuántas)) /gi)) {
            const unidad = inputUsuario.split(' ')[1].match(/^(cuantos|cuántos|cuantas|cuántas)/gi) ? inputUsuario.split(' ')[2] : inputUsuario.split(' ')[1];
            return `${Math.floor(Math.random() * 1000)} ${unidad} kirzheTeemo`;
        }
    
        // Pregunta de tiempo
        if (inputUsuario.match(/^((cuándo|cuando)|(cuanto|cuánto) tiempo|en (cuanto|cuánto) tiempo|en que tiempo) /gi)) {
            const tiempo = ["días", "meses", "años", "horas", "minutos"];
            return `en ${Math.floor(Math.random() * 100)} ${tiempo[Math.floor(Math.random() * tiempo.length - 1)]} kirzheTeemo`;
        }
            // Años
            if (inputUsuario.match(/^(en (cuantos|cuántos) años|(cuantos|cuántos) años) /gi)) {
                return `en ${Math.floor(Math.random() * 1000)} años kirzheTeemo`;
            }
            // Dias
            if (inputUsuario.match(/^(en (cuantos|cuántos) (dias|días)|(cuantos|cuántos) (dias|días)) /gi)) {
                return `en ${Math.floor(Math.random() * 1000)} días kirzheTeemo`;
            }
            // Minutos
            if (inputUsuario.match(/^(en (cuantos|cuántos) minutos|(cuantos|cuántos) minutos) /gi)) {
                return `en ${Math.floor(Math.random() * 1000)} minutos kirzheTeemo`;
            }
            // Meses
            if (inputUsuario.match(/^(en (cuantos|cuántos) meses|(cuantos|cuántos) meses) /gi)) {
                return `en ${Math.floor(Math.random() * 1000)} meses kirzheTeemo`;
            }
            // Horas
            if (inputUsuario.match(/^(en (cuantas|cuántas) horas|(cuantas|cuántas) horas) /gi)) {
                return `en ${Math.floor(Math.random() * 1000)} horas kirzheTeemo`;
            }
    
        // Pregunta de precio
        if (inputUsuario.match(/^(en (cuanto|cuánto) esta) /gi)) {
            return `en ${Math.floor(Math.random() * 100000)} kirzheTeemo`;
        }
    
        // Dar numero random
        if (inputUsuario.match(/^(dame un (numero|número)|dime un (numero|número)|que (numero|número)|(numero|número) del \d+ al \d+|dame un (numero|número) del \d+ al \d+) /gi)) {
            return `${Math.floor(Math.random() * 100)} kirzheHi`;
        }
    
        // Cuanto
        if (inputUsuario.match(/^((cuanto|cuánto)|(cuantos|cuántos)|que cantidad|(cuantas|cuántas)|cuanta|en que cantidad|que tanto) /gi)) {
            return respCuanto[Math.floor(Math.random() * respCuanto.length - 1)];
        }
    
        // Como
        if (inputUsuario.match(/^((como|cómo) me .*?(a|á)|(como|cómo) .*?r(e|é)|(como|cómo) .*?(a|á)|(como|cómo) se encuentra|(como|cómo) se encontrar(a|á)) /gi)) {
            return respComo[Math.floor(Math.random() * respComo.length - 1)];
        }
        return respError[Math.floor(Math.random() * respError.length - 1)];
    }

    res.send(runBot(inputUsuario));
});