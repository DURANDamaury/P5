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
                    /* ************************************************************************************* */
                    /* ********          Tentative de résolution du bug par suppréssion des eventlist ****** */
                    /* ************************************************************************************* */
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
/* ***************************************************************************************
   *** génère l'eventListener pour la vérification du formulaire à partir d'un tableau ***
   *************************************************************************************** */ 
function Verifyform()
    {
        class InputTab
            {
                constructor(ElementTest,Mask,IdMsg,ErrorMsg)
                {
                    this.ElementTest = ElementTest;
                    this.Mask = Mask;
                    this.IdMsg = IdMsg;
                    this.ErrorMsg = ErrorMsg;
                }
            }

        const RegexNomPrenom = /(^.{1,}[a-zA-ZÀ-ÿ]+$)/ // /[^a-zA-Z]/
        const RegexAdresse = /\w+(\s\w+){2,}/
        const RegexMail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        // Données sous la forme suivante:
            // Id le l'input html
            // regex
            // Id html p pour l'affichage de l'erreur
            // Message d'erreur à afficher

        let Prenom = new InputTab('firstName',RegexNomPrenom,'firstNameErrorMsg','Le prenom doit contenir 2 lettres.')
        let Nom = new InputTab('lastName',RegexNomPrenom,'lastNameErrorMsg','Le nom doit contenir 2 lettres.')
        let Adresse = new InputTab('address',RegexAdresse,'addressErrorMsg',"l'adresse sous la forme: N°, rue.")
        let Ville = new InputTab('city',RegexNomPrenom,'cityErrorMsg','Nom de ville invalide')
        let Mail = new InputTab('email',RegexMail,'emailErrorMsg','Email invalide')
        
        const InputData = [Prenom,Nom,Adresse,Ville,Mail];

        InputData.forEach(element => 
            {
                ElementTest = element.ElementTest;
                Mask = element.Mask;
                IdMsg = element.IdMsg;
                ErrorMsg = element.ErrorMsg;

                VerifyInput(ElementTest,Mask,IdMsg,ErrorMsg);
            });
    }


    /* **************************************************************
       *** Cette fonction crée l'eventlistener pour le formulaire ***
       ************************************************************** */
    function VerifyInput(ElementTest,Mask,IdMsg,ErrorMsg)
    {
        document.getElementById(ElementTest).addEventListener('change', function()
        {
            const Input = document.getElementById(ElementTest).value;
            const Chiffres = Mask;
            if (Chiffres.test(Input))
            {
                const ErrorMessage = document.getElementById(IdMsg);
                ErrorMessage.textContent = '';
            }
            else           
            {
                const ErrorMessage = document.getElementById(IdMsg);
                ErrorMessage.textContent = ErrorMsg;
            }
        });
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
        Verifyform();
    }

main();
