console.log(localStorage.length);
let commande = localStorage.getItem("item");
let itemList = JSON.parse(commande);
console.log(itemList.Id,itemList.Color,itemList.Quantity)