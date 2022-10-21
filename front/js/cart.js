function p(message) {console.log(JSON.parse(JSON.stringify(message)))}; // console log sans référence
// Local storage


/** **********************************************************
 *  *** API - Récupération du tableau de tous les éléments ***
 * @returns {Promise<{_id: string, name: string , price: number, imageUrl: string, description: string, altTxt: string}[]>}
 ********************************************************** */
async function fetchData() 
    {
    return fetch(apiUrl)
        .then((data) => data.json())
        .catch((err) => console.log(err));
    }

/** *************************************************************
 *  *** Retourne les infos grace à l'ID                       ***
 * @param {string} canapeID 
 * @returns {{_id: string, name: string , price: number, imageUrl: string, description: string, altTxt: string}}
*************************************************************  */
async function searchInfos(canapeID) 
    {
        return fetch(`http://localhost:3000/api/products/${canapeID}`)
            .then((data) => data.json())
            .catch((err) => console.log(err));
    }

/* ******************************
   *** mise à jour du panier  ***
   *** CE = panier ; CS = nul ***
   ****************************** */
function setBasket(basket) 
    {
    localStorage.setItem("basket", JSON.stringify(basket));
    }

/** *********************************************
 *  *** Construction de la Dom pour 1 canapé  ***
 * @param {{Id: string, Color: string, Quantity: number}} canape 
 ********************************************* */
async function DisplayArticle (canape)
    {

        // récupération des infos du produit
        let infos = await searchInfos(canape.Id);
        let name = infos.name;
        let price = infos.price;
        let imgUrl = infos.imageUrl;
        //let description = infos[3];
        let altTxt = infos.altTxt;
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

        // Construction
        DomDelete.append(DomDeleteItem);
        DomQuantity.append(DomQte,DomInputQuantity);
        DomSettings.append(DomQuantity,DomDelete);
        DomDescription.append(DomNom,DomColor,DomPrice);
        DomDivContent.append(DomDescription,DomSettings);        
        DomDivImg.append(DomImg);
        DomAddArticle.append(DomDivImg,DomDivContent);
        DomIdItem.appendChild(DomAddArticle);
    }

/*  *****************************************************
    *** Calcul et affichage du nombre total d'article ***
    *** CE = null ; CS = null                         ***
    ***************************************************** */    
function TotalQuantity()
    {
        let commande = localStorage.getItem("basket");
        let itemList = JSON.parse(commande);
        let NumberOfArticles = itemList.length

        let Total = 0;
        for (let i=0; i<NumberOfArticles ; i++)
        {
            let canape = itemList[i];
            let NewValue = JSON.parse(canape.Quantity)
            Total += NewValue;
        }
        document.querySelector('#totalQuantity').textContent = Total;
    }

/*  *****************************************
    *** Calcul et affichage du prix total ***
    *** CE = null ; CS = null             ***
    ***************************************** */
async function TotalPrice()
    {
        let commande = localStorage.getItem("basket");
        let itemList = JSON.parse(commande);
        let NumberOfArticles = itemList.length;

        let Total = 0;
        for (let i=0; i<NumberOfArticles ; i++)
            {
                let canape = itemList[i];
                let canapeId = canape.Id
                let canapeQuantity = parseInt(canape.Quantity);
                let Infos = await searchInfos(canapeId);
                let price = parseInt(Infos.price);
                let TotalElementPrice = price*=canapeQuantity;
                Total += TotalElementPrice;
            }
        document.querySelector('#totalPrice').textContent = Total;
        }

/* *****************************************
   *** Génere la dom pour chaque article ***
   *** CE = nul ; CS = nul               ***
   ***************************************** */
async function DomGeneration()
    {
        let commande = localStorage.getItem("basket");
        let itemList = JSON.parse(commande);
        let NumberOfArticles = itemList.length;
        for (let i=0 ; i<NumberOfArticles ; i++)
            {
                let canape = itemList[i];
                await DisplayArticle(canape);
            }
        return;
    }
/*  ************************************************************ 
    *** Suppression d'un article du panier et de la Dom      ***
    *** CE = null ; CS= null                                 ***
    ************************************************************ */
function Delete()
    {
        const boutonDelete = document.querySelectorAll('.deleteItem');
        boutonDelete.forEach((item,BoutonNumber) => 
            {
            item.addEventListener('click', event => 
                {
                const BoutonId = event.target;
                const FindCart__item = BoutonId.closest('.cart__item');
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
                TotalPrice()
                if (NumberOfArticles == 0)
                    {
                        EmptyBasket()
                    }
                })
            })
        }

/*  **********************************************
*** Modification de la quantité pour le canapé ***
*********************************************** */
async function ModifyQuantity()
    {
        //lecture de la valeur
        const QuantityCase = event.target;
        const QuantityValue = QuantityCase.value;

        const CartItem = QuantityCase.closest('.cart__item')
        const IdProductQuantity = CartItem.dataset.id;
        const ColorProductQuantity = CartItem.dataset.color;

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
                    TotalPrice();
                }
            }
    }
//  ***************************************************
//  *** crée le listener pour chaque input quantity ***
// ***************************************************
function ModifyQuantityListener()
        {
            const QuantityLevel = document.querySelectorAll('.itemQuantity');
            QuantityLevel.forEach((item) => 
                {
                item.addEventListener('change', event => ModifyQuantity())
                })               
        }

//  *************************************************************************
//  *** module d'envoi du formulaire. On vérifie les données tout de même ***
//  *************************************************************************
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
                    commande= await SendToApi(contact,product); //on envoi à l'api
                    const link = 'confirmation.html?orderId='
                    document.location.href = link+commande.orderId
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

        let Prenom = new InputTab('firstName',RegexNomPrenom,'firstNameErrorMsg','Prenom invalide.')
        let Nom = new InputTab('lastName',RegexNomPrenom,'lastNameErrorMsg','Nom invalide.')
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
async function ObjectsInBasket()
    {
        await DomGeneration()
        TotalQuantity();
        TotalPrice();
        Delete();
        ModifyQuantityListener();
        Verifyform();
        OrderSend();
    }

function EmptyBasket ()
    {
        const PanierVideMessage = document.getElementById('cartAndFormContainer').querySelector('h1');
        PanierVideMessage.textContent= 'Votre panier est vide'
        const PriceSelect = document.querySelector('.cart')
        PriceSelect.remove()
    }

function main()
    {
       
        let commande = localStorage.getItem("basket");
        if (commande !== null && commande != '[]')
            {
                //le panier existe
                let commande = localStorage.getItem("basket");
                let itemList = JSON.parse(commande);
                let NumberOfArticles = itemList.length;
                const apiUrl = "http://localhost:3000/api/products";
                ObjectsInBasket(NumberOfArticles);
            }
        else
            {
                //le panier n'existe pas ou est vide
                EmptyBasket()
            }
    }

// **************************************************
// ***                    START                   ***

main();
