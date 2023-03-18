
  
      let name = prompt("Welcome, what's your name?");
      if (!name) {
        name = "Anonymous";
      }
      const socket = io();

      const form = document.getElementById("form");
      const input = document.getElementById("input");

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (input.value) {
          socket.emit("user message", { message: input.value, name });
          input.value = "";
        }
      });

      socket.on("Bot message", function (data) {
        const item = document.createElement("p");
        item.textContent = `${data.name}: ${data.message}`;
        item.classList.add("bot");
        document.getElementById("messages").appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
      });

      socket.on("User message", function (data) {
        const item = document.createElement("p");
        item.textContent = `${data.name === name ? "You" : name}: ${
          data.message
        }`;
        item.classList.add("user");
        document.getElementById("messages").appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
      });

      socket.emit("welcome", { name });
    