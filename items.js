// When a customer lands on the chatbot page, the bot should send these options to the customer:
// Select 1 to Place an order
// Select 99 to checkout order
// Select 98 to see order history
// Select 97 to see current order
// Select 0 to cancel order
// When a customer selects “1”, the bot should return a list of items from the restaurant. It is up to you to create the items in your restaurant for the customer. The order items can have multiple options but the customer should be able to select the preferred items from the list using this same number select system and place an order.
// When a customer selects “99” out an order, the bot should respond with “order placed” and if none the bot should respond with “No order to place”. Customer should also see an option to place a new order
// When a customer selects “98”, the bot should be able to return all placed order
// When a customer selects “97”, the bot should be able to return current order
// When a customer selects “0”, the bot should cancel the order if there is.

const items = {
    1: { name: "Pizza" },
    2: { name: "Burger" },
    3: { name: "Pasta" },
    4: { name: "Salad" },
    5: { name: "Sandwich" },
    6: { name: "Fries" },
    7: { name: "Soda" },
    8: { name: "Beer" },
    9: { name: "Wine" },
    10: { name: "Coffee" },
  };
  
  const botMessage = (message, socket) => {
    socket.emit("Bot message", { message, name: "Chat bot" });
  };
  
  const userMessage = (data, socket) => {
    socket.emit("User message", data);
  };
  
  const responseExec = (data, socket, message, state, items) => {
    const controlsMessage =
      "Select 1 to Place an order\nSelect 99 to checkout order\nSelect 98 to see order history\nSelect 97 to see current order\nSelect 0 to cancel order\n";
  
    if (data.message === "1" && !state.placing) {
      message = "Here are the items you can order:\n";
      state.placing = true;
      for (let key in items) {
        message += `${key} - ${items[key].name}\n`;
      }
      message += "Please select a number to add to order";
    } else if (data.message === "99") {
      if (Object.keys(state.currentOrder).length > 0) {
        message = "order placed";
        state.orders.push(state.currentOrder);
        state.currentOrder = {};
      } else {
        message = "No order to place\n";
        message += controlsMessage;
      }
    } else if (data.message === "98") {
      if (state.orders.length > 0) {
        for (let i = 0; i < state.orders.length; i++) {
          message += `Order ${i + 1}:\n`;
          for (let key in state.orders[i]) {
            message += `${key} - ${state.orders[i][key]}\n`;
          }
        }
      } else {
        message = "No order history";
      }
    } else if (data.message === "97") {
      if (Object.keys(state.currentOrder).length > 0) {
        message = "Current order:\n";
        for (let key in state.currentOrder) {
          message += `${key} - ${state.currentOrder[key]}\n`;
        }
      } else {
        message = "No current order\n";
        message += controlsMessage;
      }
    } else if (data.message === "0") {
      if (Object.keys(state.currentOrder).length === 0) {
        message = "No order to cancel\n";
      } else {
        state.currentOrder = {};
  
        message = "Order cancelled\n";
      }
      message += controlsMessage;
    } else if (state.placing) {
      if (data.message in items) {
        if (state.currentOrder[items[data.message].name]) {
          state.currentOrder[items[data.message].name]++;
        } else {
          state.currentOrder[items[data.message].name] = 1;
        }
        message = `${items[data.message].name} added to order\n`;
      } else {
        message = "Invalid input.\n Please select a number from the list\n";
        message += controlsMessage;
      }
    } else {
      message = "Invalid input\n";
      message += controlsMessage;
    }
  
    if (message.length > 0) {
      botMessage(message, socket);
    }
  };
  
  module.exports = { botMessage, userMessage, responseExec, items };