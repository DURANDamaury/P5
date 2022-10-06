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
let commande = localStorage.getItem("basket");
let itemList = JSON.parse(commande);
let NumberOfArticles = itemList.length

function setBasket(basket) 
    {
    localStorage.setItem("basket", JSON.stringify(basket));
    }
/* ********************************************* */
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
                DomDescription.setAttribute('class','cart__item__content__description');
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
                DomSettings.setAttribute('class','cart__item__content__settings')
                    // <div class="cart__item__content__settings__quantity">
                    let DomQuantity = document.createElement('div');
                    DomQuantity.setAttribute('class','cart__item__content__settings__quantity');
                        // <p>Qté :
                        let DomQte = document.createElement('p');
                        DomQte.textContent = "Qté : ";
                        // <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
                        let DomInputQuantity = document.createElement('input');
                        DomInputQuantity.setAttribute('type','number');
                        DomInputQuantity.setAttribute('class','itemQuantity');
                        DomInputQuantity.setAttribute('name','itemQuantity');
                        DomInputQuantity.setAttribute('min','1');
                        DomInputQuantity.setAttribute('max','100');
                        DomInputQuantity.setAttribute('value',canape.Quantity);
                        
                        
                    // <div class="cart__item__content__settings__delete">
                    let DomDelete = document.createElement('div')
                    DomDelete.setAttribute('class','cart__item__content__settings__delete');
                        // <p class="deleteItem">Supprimer</p>
                        let DomDeleteItem = document.createElement('p');
                        DomDeleteItem.setAttribute('class','deleteItem');
                        DomDeleteItem.textContent = "Supprimer";

        // Génération de la Dom
        DomDelete.append(DomDeleteItem);
        DomQuantity.append(DomQte,DomInputQuantity);
        DomSettings.append(DomQuantity,DomDelete);
        DomDescription.append(DomNom,DomColor,DomPrice);
        DomDivContent.append(DomDescription,DomSettings);        
        DomDivImg.append(DomImg);
        DomAddArticle.append(DomDivImg,DomDivContent);
        DomIdItem.appendChild(DomAddArticle);
    }

function TotalQuantity()
{
    let commande = localStorage.getItem("basket");
    let itemList = JSON.parse(commande);
    let NumberOfArticles = itemList.length

    let Total = 0;
    for (let i=0; i<NumberOfArticles ; i++)
    {
        let canape = itemList[i];
        NewValue = JSON.parse(canape.Quantity)
        Total += NewValue;
    }
    document.querySelector('#totalQuantity').textContent = Total;
}
//

async function DomGeneration()
    {
        for (let i=0 ; i<NumberOfArticles ; i++)
            {
                let canape = itemList[i];
                await DisplayArticle(canape);
            }
        return;
    }
/* ************************************************************ */
function Delete()
    {
        const boutonDelete = document.querySelectorAll('.deleteItem');
        boutonDelete.forEach((item,BoutonNumber) => 
            {
            item.addEventListener('click', event => 
                {
                const BoutonId = event.target;
                const FindCart__item = BoutonId.closest('.cart__item');
                //on supprime l'élément 'supprimer" de l'eventlist
                this.removeEventListener('click',Delete);
                //on recherche l'elément quantité pour le supprimer de l'eventlist
                const EventQuantityButtonFind1 = BoutonId.closest('.cart__item__content__settings');
                const EventQuantityButtonFind2 = EventQuantityButtonFind1.childNodes
                const EventQuantityButtonFind3 = EventQuantityButtonFind2[0];
                const EventQuantityButtonFind4 = EventQuantityButtonFind3.childNodes
                const EventQuantityButton = EventQuantityButtonFind4[1];
                EventQuantityButton.removeEventListener('change', ModifyQuantity);
                //modification du panier
                let commande = localStorage.getItem("basket");
                let itemList = JSON.parse(commande);
                let NumberOfArticles = itemList.length
                itemList.splice(BoutonNumber,1);
                setBasket(itemList);
                //modification DOM
                FindCart__item.remove();
                NumberOfArticles--;
                TotalQuantity();
                })
            })
        }
/* **************************************************************** */
function ModifyQuantity()
    {
        const QuantityLevel = document.querySelectorAll('.itemQuantity');
        QuantityLevel.forEach((item,CaseNumber) =>
            {
            item.addEventListener('change', event =>
                {
                //lecture de la valeur
                const QuantityCase = event.target;
                const QuantityValue = QuantityCase.value;
                //modification du panier
                let commande = localStorage.getItem("basket");
                let itemList = JSON.parse(commande);
                DomItemQuantity = itemList[CaseNumber];
                DomItemQuantity.Quantity = QuantityValue;
                setBasket(itemList);

                //mise à jour du total
                TotalQuantity();
                })
            })
    }
/* **************************************************************** */
function OrderSend()
    {
        const OrderButton = document.getElementById('order');
        OrderButton.addEventListener('click',OrderTraitment);
    }
/* **************************************************************** */
function OrderTraitment()
    {
        const verify=FormVerify();
        if (verify)
            {setContact();}
            else 
            {alert('erreur dans la saisie');return 0};
    }
/* *************************************************************** */
// vérifie si les données fournies dans le formulaire sont valides //
// retourne true si la vérification a abouti. sinon false          //
/* *************************************************************** */
function FormVerify ()
    {
        const Prenom = document.getElementById('firstName').value;
        const Nom = document.getElementById('lastName').value;
        const Adresse = document.getElementById('address').value;
        const Ville = document.getElementById('city').value;
        const Email = document.getElementById('email').value;
        const Chiffres = /[^a-zA-Z]/;
        if (Chiffres.test(Prenom)){alert('Seules les lettres sont accéptées.');return false};
        if (Chiffres.test(Nom)){alert('Seules les lettres sont accéptées.');return false };
        if (Chiffres.test(Ville)){alert('Seules les lettres sont accéptées.');return false };
        const MailCaracters = /@+\./g
        if (MailCaracters.test(Email)==false){alert('Votre email doit contenir @ et un point');return false }
        return true;
    }
/* *************************************************************** */
// Génère l'objet contact                                          //
/* *************************************************************** */
function setContact()
    {
        const Prenom = document.getElementById('firstName').value;
        const Nom = document.getElementById('lastName').value;
        const Adresse = document.getElementById('address').value;
        const Ville = document.getElementById('city').value;
        const Email = document.getElementById('email').value;

        const contact = 
            {
            firstName: Prenom,
            lastName: Nom,
            address: Adresse,
            city: Ville,
            email: Email
            }
    }
/* **************************************************************** */
async function main()
    {
        await DomGeneration()
        TotalQuantity();
        Delete();
        ModifyQuantity();
        OrderSend();
    }

main();
