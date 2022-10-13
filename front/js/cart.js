function p(message) {console.log(JSON.parse(JSON.stringify(message)))}; // console log sans référence

// API
const apiUrl = "http://localhost:3000/api/products";
async function fetchData() 
    {
    return fetch(apiUrl)
        .then((data) => data.json())
        .catch((err) => console.log(err));
    }

/* *************************************************************
   *** Retourne les infos grace à l'ID                       ***
   *** CE = ID ; CS = bom,prix,imageurl,description,textealt ***
   ************************************************************* */ 
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

/* ******************************
   *** mise à jour du panier  ***
   *** CE = panier ; CS = nul ***
   ****************************** */
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

/* *****************************************
   *** Génere la dom pour chaque article ***
   *** CE = nul ; CS = nul               ***
   ***************************************** */
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
/* *************************************************
*** Retourne l'id d'un canape en fonction du nom ***
*** CE = nom ; CS = ID                           ***
************************************************* */
async function FindIdByName(name)
        {
            listeCanape = await fetchData()
            for (canape of listeCanape) 
                {
                idRead = canape._id;
                nameRead = canape.name;
                if (nameRead === name) 
                    {
                    return idRead;
                    }
                }
        }
/* ***************************************

*************************************** */
async function ModifyQuantity()
    {
        //lecture de la valeur
        const QuantityCase = event.target;
        const QuantityValue = QuantityCase.value;
        const CartItemContentFind = QuantityCase.closest('.cart__item__content')
        const CartItemContentDescriptionFind = CartItemContentFind.firstChild
        const NameProductQuantity = CartItemContentDescriptionFind.querySelector('h2').textContent
        // NameProductQuantity contient le nom du canapé, il nous faut son id, on va donc aller le chercher dans l'API
        const IdProductQuantity = await FindIdByName(NameProductQuantity);
        const ColorProductQuantity =CartItemContentDescriptionFind.querySelector('p').textContent

        let commande = localStorage.getItem("basket");
        let itemList = JSON.parse(commande);
        for (let i in itemList)
            {
                if (itemList[i].Id == IdProductQuantity && itemList[i].Color == ColorProductQuantity)
                {
                    //nous sommes dans le bon objet, nous pouvons lui changer sa quantité
                    itemList[i].Quantity = QuantityValue;
                    setBasket(itemList);
                    TotalQuantity();
                }
            }
    }
/* **************************************************************** */
function ModifyQuantityListener()
        {
            const QuantityLevel = document.querySelectorAll('.itemQuantity');
             QuantityLevel.forEach((item,CaseNumber) => 
                {
                item.addEventListener('change', event => ModifyQuantity())
                })               
        }

/* *************************************************************************
   *** module d'envoi du formulaire. On vérifie les données tout de même ***
   ************************************************************************* */
function OrderSend()
    {
        const OrderButton = document.getElementById('order');
        OrderButton.addEventListener('click',async function(e)
            {
                e.preventDefault();
                const VerificationFormulaire = VerifFinal(); // La fonction renverra True si tout est bon. Sinon False
                if (VerificationFormulaire == false)
                    {
                    //une erreur est survenue, on abandonne
                    return;
                    }
                else
                    {
                    //Tout est ok, on traite le formulaire
                    contact = constructContactObject(); // on récupère l'objet contact
                    product = constructProduitTab(); //on récupère le tableau de produit
                    //console.log('contact = ',contact)
                    //console.log('product = ',product)
                    reponse= await SendToApi(contact,product); //on envoi à l'api
                    console.log(reponse)
                    }
            })
    }

                    /* ********************************************************************************
                    *** Fonction de vérification finale. On regarde si tous les champs sont remplis ***
                    *** et si aucun message d'erreur n'est écrit en dessous pour être certain       ***
                    *** CE=Nul CS=True si pas d'erreur, sinon False                                 ***
                    *********************************************************************************** */
                    function VerifFinal()
                        {
                            // On commence par vérifier si les inputs sont vides
                            const InputIds = ['firstName','lastName','address','city','email']
                            let NumberError = 0;

                            InputIds.forEach(element => 
                                {
                                ReadInput = document.getElementById(element).value;
                                if (ReadInput == '') {NumberError ++}
                                });
                            // On vérifie qu'aucun message d'erreur n'est affiché
                            const ErrorIds = ['firstNameErrorMsg','lastNameErrorMsg','addressErrorMsg','cityErrorMsg','emailErrorMsg']
                            ErrorIds.forEach(element =>
                                {
                                ReadError = document.getElementById(element).textContent;
                                if (ReadError != '') {NumberError ++}
                                })
                            if (NumberError != 0){return false}
                            else {return true}
                        }

                    /* ******************************
                       *** Génère l'objet contact ***
                       *** CE = nul ; CS = objet  ***
                       ****************************** */
                        function constructContactObject()
                            {
                            class objContact
                                {
                                    constructor(firstName,lastName,address,city,email)
                                    {
                                        this.firstName = firstName;
                                        this.lastName = lastName;
                                        this.address = address;
                                        this.city = city;
                                        this.email = email;
                                    }
                                }
                                const InputIds = ['firstName','lastName','address','city','email']
                                let InputData = [];
                                InputIds.forEach(element => 
                                    {
                                    ReadInput = document.getElementById(element).value;
                                    InputData.push(ReadInput);
                                    });
                                const [firstName, lastName, address, city, email]=InputData
                                const contact = new objContact(firstName, lastName, address, city, email);
                                //p(contact)
                                return contact;
                            }
                    /* ************************************
                       *** Génère le tableau de produit ***
                       *** CE = nul ; CS = Tableau      ***
                       ************************************ */
                        function constructProduitTab()
                            {
                                let commande = localStorage.getItem("basket");
                                let itemList = JSON.parse(commande);
                                product = [];
                                itemList.forEach(element =>
                                    {
                                        Id = element.Id
                                        product.push(Id);
                                    })
                                return product;
                            }
                    /*  *************************************************
                        *** Envoi à l'api                             ***
                        *** CE = obj Contact, Tab Product             ***
                        *** CS = Retourne l'objet contact, le tableau ***
                        *** produits et orderId (string)              ***
                        ************************************************* */
                        async function SendToApi(contact,product)
                            {
                                let order = {contact: contact,products: product};
                                const apiUrlPost = "http://localhost:3000/api/products/order";
                                try
                                    {
                                    const response= await fetch(apiUrlPost, 
                                        {
                                            method: 'POST',
                                            headers: 
                                                { 
                                                'Accept': 'application/json', 
                                                'Content-Type': 'application/json' 
                                                },
                                            body: JSON.stringify(order)
                                        });
                                    if (response.ok) 
                                        {
                                            const reponse = await response.json();
                                            return reponse;
                                        }
                                    else
                                        {
                                            throw new Error("erreur :", response.status)
                                        }
                                    }
                                    
                                catch (error)
                                    {
                                        console.log('erreur dans le post: ',error);
                                    }
                            }
                        
                        





/* ***************************************************************************************
   *** génère l'eventListener pour la vérification du formulaire à partir d'un tableau ***
   *** CE = nul ; CS = nul                                                             ***
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


                /* *****************************************************************************
                *** Crée l'eventlistener pour le formulaire                                  ***
                *** CE = id de l'input, Mask Regex, Id du message d'erreur, message d'erreur ***
                *** CS = nul                                                                 ***
                ******************************************************************************** */
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

/* **************************************************************** 
   ********************* MAIN *************************************
   **************************************************************** */
async function main()
    {
        await DomGeneration()
        TotalQuantity();
        Delete();
        ModifyQuantityListener();
        Verifyform();
        OrderSend();
    }

main();
