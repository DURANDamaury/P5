// API
const apiUrl = "http://localhost:3000/api/products";
async function fetchData() 
    {
    return fetch(apiUrl)
        .then((data) => data.json())
        .catch((err) => console.log(err));
    }

async function searchInfos(canapeID) 
    {
    let listeCanape = await fetchData();
    for (canapeNumber of listeCanape) 
        {
        idRead = canapeNumber._id;
        if (idRead === canapeID) 
            {
            return [canapeNumber.name,canapeNumber.price,canapeNumber.imageUrl,canapeNumber.description,canapeNumber.altTxt];
            }
        }
    }

// Local storage
console.log(localStorage.length);
let commande = localStorage.getItem("basket");
let itemList = JSON.parse(commande);
let NumberOfArticles = itemList.length
console.log(itemList.length);
// Construction
async function DisplayArticle (canape)
    {
        // récupération des infos du produit
        let infos = await searchInfos(canape.Id);
        let name = infos[0];
        let price = infos[1];
        let imgUrl = infos[2];
        let description = infos[3];
        let altTxt = infos[4];
        console.log(name,price,imgUrl,description,altTxt)
        // construction de la Dom
        let DomIdItem = document.querySelector('#cart__items');
        // <article>
        let DomAddArticle = document.createElement('article');
        DomAddArticle.setAttribute('class', 'cart__item');
        DomAddArticle.setAttribute('data-id',canape.Id);
        DomAddArticle.setAttribute('data-color',canape.Color);
            // <div class='cart__item__img'>
            let DomDivImg = document.createElement('div');
            DomDivImg.setAttribute('class','cart__item__img');
                // <img src='imgUrl' alt='Photographie d'un canapé'>                
                let DomImg = document.createElement('img');
                DomImg.setAttribute('src',imgUrl);
                DomImg.setAttribute('alt',altTxt);

            // <div class='cart__item__content'>
            let DomDivContent = document.createElement('div');
            DomDivContent.setAttribute('class','cart__item__content');
                // <div class="cart__item__content__description">
                let DomDescription = document.createElement('div');
                DomDescription.setAttribute('classe','cart__item__content__description');
                    // <h2> Nom du produit
                    let DomNom = document.createElement('h2');
                    DomNom.textContent = name;
                    // <p> Couleur
                    let DomColor = document.createElement('p');
                    DomColor.textContent = canape.Color;
                    //<p> Prix
                    let DomPrice = document.createElement('p');
                    DomPrice.textContent = price;

                // <div class="cart__item__content__settings">
                let DomSettings = document.createElement('div');
                DomSettings.setAttribute('classe','cart__item__content__settings')
                    // <div class="cart__item__content__settings__quantity">
                    let DomQuantity = document.createElement('div');
                    DomQuantity.setAttribute('class','cart__item__content__settings__quantity');
                        // <p>Qté :
                        let DomQte = document.createElement('p');
                        DomQte.textContent = "Qté : "+canape.Quantity;
                        // <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
                        let DomInputQuantity = document.createElement('input');
                        DomInputQuantity.setAttribute('type','number');
                        DomInputQuantity.setAttribute('class','itemQuantity');
                        DomInputQuantity.setAttribute('name','itemQuantity');
                        DomInputQuantity.setAttribute('min','1');
                        DomInputQuantity.setAttribute('max','100');
                        DomInputQuantity.setAttribute('value','42');
                        
                        
                    // <div class="cart__item__content__settings__delete">
                    let DomDelete = document.createElement('div')
                    DomDelete.setAttribute('class','cart__item__content__settings__delete');
                        // <p class="deleteItem">Supprimer</p>
                        let DomDeleteItem = document.createElement('p');
                        DomDeleteItem.setAttribute('class',"deleteItem");
                        DomDeleteItem.textContent = "Supprimer";

        DomDelete.append(DomDeleteItem);
        DomQuantity.append(DomQte,DomInputQuantity);
        DomSettings.append(DomQuantity,DomDelete);
        DomDescription.append(DomNom,DomColor,DomPrice);
        DomDivContent.append(DomDescription,DomSettings);        
        DomDivImg.append(DomImg);
        DomAddArticle.append(DomDivImg,DomDivContent);
        DomIdItem.appendChild(DomAddArticle);

    }
//

for (let i=0 ; i<NumberOfArticles ; i++)
    {
        let canape = itemList[i];
        DisplayArticle(canape);
    }

