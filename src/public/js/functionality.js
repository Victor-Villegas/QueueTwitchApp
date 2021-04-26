function buttonClick (id) {
  const alertCont = document.querySelector('#alert-container');
  const thisButton = document.getElementById(`${id}`);

  $.ajax({
    type: 'POST',
    url: `/?q=removeByName ${id}`,
    data: 'name=t_songbird&displayName=T_Songbird&provider=twitch&providerId=195003953&userLevel=owner',
    success: function (data) {
      thisButton.parentElement.parentElement.remove();

      alertCont.innerHTML = `<div class="uk-alert-primary" id="user-alert" uk-alert><a class="uk-alert-close" uk-close></a><p>${data} </p></div>`;

      const alertObj = alertCont.firstChild;

      socket.emit('refreshing');

      setTimeout(() => {
        UIkit.alert(alertObj).close();
      }, 4000);
    }
  });
}

function buttonCancel (id) {
  const alertCont = document.querySelector('#alert-container');
  const thisButton = document.getElementById(`${id}`);

  id = id.slice(1);

  $.ajax({
    type: 'POST',
    url: `/?q=removeByName ${id} ${true}`,
    data: 'name=t_songbird&displayName=T_Songbird&provider=twitch&providerId=195003953&userLevel=owner',
    success: function (data) {
      thisButton.parentElement.parentElement.remove();

      alertCont.innerHTML = `<div class="uk-alert-primary" id="user-alert" uk-alert><a class="uk-alert-close" uk-close></a><p>${data} </p></div>`;

      const alertObj = alertCont.firstChild;

      socket.emit('refreshing');

      setTimeout(() => {
        UIkit.alert(alertObj).close();
      }, 4000);
    }
  });
}

function updateList () {
  const container = document.querySelector('#funacion');
  const containerSem = document.querySelector('#funacion-semana');
  const cantidad = document.querySelector('#numero-funacion');

  $.ajax({
    type: 'POST',
    url: '/kirzheka',
    success: function (data) {
      container.innerHTML = '';
      containerSem.innerHTML = '';

      if (data.count[0].qty === 0) {
        cantidad.innerHTML = '<p>Al parecer no hay personitas en la lista de funación</p>';
      } else {
        cantidad.innerHTML = `<p>Tienes a ${data.count[0].qty} ${data.count[0].qty === 1 ? 'persona' : 'personas'} esperando su funación</p>`;
      }

      data.queueUsers.forEach(user => {
        container.innerHTML += `
            <div class="uk-grid uk-grid-column-collapse uk-width-1-1 uk-flex-middle uk-margin-small-bottom uk-margin-small-top">
              <div class="uk-width-1-5">
                ${user.message}
              </div>
              <div class="uk-width-3-5 uk-text-large">
                ${user.display_name}
              </div>
              <div class="uk-width-1-5">
                <button type="button" class="uk-button uk-button-danger uk-button-small" id="${user.name}" onClick="buttonClick(this.id)">
                  <i class="fas fa-check"></i>
                </button>
                <button type="button" class="uk-button uk-button-default uk-button-small" id="-${user.name}"
                onClick="buttonCancel(this.id)">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>`;
      });

      data.users.forEach(user => {
        containerSem.innerHTML += `
            <div class="uk-width-auto">
              ${user.display_name}
            </div>`;
      });
    }
  });
}
