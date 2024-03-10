document.addEventListener("DOMContentLoaded", function () {
  console.log(user, chat_id);

  var url = "ws://" + window.location.host + "/ws/chat/" + chat_id + "/";
  console.log(url);

  var chatSocket = new WebSocket(url);
  console.log(chatSocket);

  chatSocket.onopen = function (e) {
    console.log("WEBSOCKET ABIERTO");

    chatSocket.send(
      JSON.stringify({ message: "ping", target: chat_id, user: user })
    );

    setInterval(function () {
      if (chatSocket.readyState === 1) {
        // Solo enviar si está abierto
        chatSocket.send(
          JSON.stringify({ message: "ping", target: chat_id, user: user })
        );
      }
    }, 5000);
  };

  chatSocket.onclose = function (e) {
    console.log("WEBSOCKET CERRADO");
  };

  chatSocket.onmessage = function (e) {
    var data = JSON.parse(e.data);
    var message = data["message"];
    var user = data["user"];
    var type = data["type"];
    if (type === "join_chat") {
      loadMessageHTML(message, user);
    } else if (message !== "ping") {
      loadMessageHTML(message, user);
    }
  };

  var btnMessage = document.querySelector("#btnMessage");
  var inputMessage = document.querySelector("#inputMessage");

  if (btnMessage) {
    btnMessage.addEventListener("click", sendMessage);
  }

  if (inputMessage) {
    inputMessage.addEventListener("keypress", function (e) {
      if (e.keyCode == 13) {
        sendMessage();
      }
    });
  }

  function sendMessage() {
    var messageInput = document.querySelector("#inputMessage");
    var message = messageInput.value.trim();

    if (message !== "") {
      chatSocket.send(
        JSON.stringify({ message: message, target: chat_id, user: user })
      );
      messageInput.value = "";
    } else {
      console.log("Intentó enviar un mensaje vacío");
    }
  }

  function obtenerMes(mes) {
    const meses = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];
    return meses[mes];
  }

  function loadMessageHTML(m, u) {
    var now = new Date();
    var timestamp =
      now.getDate() +
      " de " +
      obtenerMes(now.getMonth()) +
      " de " +
      now.getFullYear() +
      " a las " +
      now.getHours() +
      ":" +
      now.getMinutes();

    switch (u) {
      case "admin":
        document.querySelector("#boxMessages").innerHTML += `
          <p class="self-end px-4 py-2 rounded-xl max-w-[70%] bg-gray-200 flex flex-col gap-y-2">
              ${m}
              <span class="self-end text-sm text-gray-600">${timestamp}</span>
            </p>`;
        break;
      case "ciudadano":
        document.querySelector("#boxMessages").innerHTML += `
          <p class="self-start px-4 py-2 rounded-xl max-w-[70%] bg-process_cyan-500 flex flex-col gap-y-2">
              ${m}
            <span class="self-end text-sm text-white/80">${timestamp}</span>
          </p>`;
        break;
      case "promotor":
        document.querySelector("#boxMessages").innerHTML += `
          <p class="self-start px-4 py-2 rounded-xl max-w-[70%] bg-steel_pink-500 flex flex-col gap-y-2">
              ${m}
              <span class="self-end text-sm text-white/80">${timestamp}</span>
            </p>`;
        break;
      case "banco":
        document.querySelector("#boxMessages").innerHTML += `
          <p class="self-start px-4 py-2 rounded-xl max-w-[70%] bg-turquoise-500 flex flex-col gap-y-2">
              ${m}
              <span class="self-end text-sm text-gray-600">${timestamp}</span>
            </p>`;
        break;
      default:
        document.querySelector("#boxMessages").innerHTML += `
          <p class="self-start px-4 py-2 rounded-xl max-w-[70%] bg-gray-200 flex flex-col gap-y-2">
              ${m}
            <span class="self-end text-sm text-gray-600">${timestamp}</span>
          </p>`;
        break;
    }
    //Mantenemos abajo del chat
    var boxMessages = document.querySelector("#boxMessages");
    boxMessages.scrollTop = boxMessages.scrollHeight;
  }

  function joinChat() {
    chatSocket.send(
      JSON.stringify({
        type: "join_chat",
        chat_id: chat_id,
        user: user,
        message: user + " ha entrado en el chat",
      })
    );
    location.reload();
  }

  var btnJoinChat = document.querySelector("#btnJoinChat");

  if (btnJoinChat) {
    btnJoinChat.addEventListener("click", joinChat);
  }
});
