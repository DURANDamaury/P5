const apiUrl = "http://localhost:3000/api/products";

/*  ************************************************ 
    *** API Récupération du tableau des éléments ***
    *** CE = null ; CS = []                      ***
    ************************************************ */
async function fetchData() 
    {
    return fetch(apiUrl)
        .then((data) => data.json())
        .catch((err) => console.log(err));
    }

/*  ************************************
    *** Récupération de l'Id via URL ***
    *** CE = null ; CS = ID          ***
    ************************************ */
function getid() 
    {
    const url = new URLSearchParams(window.location.search);
    // On récupère l'url de la page courante
    var canapeID = url.get("id");
    // on récupère la valeur du paramètre id
    return canapeID;
    }

/*  **********************************************
    *** API Récupération d'un produit via l'ID ***
    *** CE = ID ; CS = {canape}                *** 
    ********************************************** */
async function searchID(canapeID) 
    {
        return fetch(`http://localhost:3000/api/products/${canapeID}`)
            .then((data) => data.json())
            .catch((err) => console.log(err));
    }

/*  *********************************************
    *** Construction de la dom pour le canape ***
    *** CE = {canape} ; CS = null             ***
    ********************************************* */
function DOMconstruct(canape) 
    {
    //ajout de l'image
    const imgSelect = document.querySelector(".item__img");
    let img = document.createElement("img");
    img.setAttribute("src", canape.imageUrl);
    imgSelect.appendChild(img);
    //ajout du nom
    const titleSelect = document.querySelector("#title");
    titleSelect.textContent = canape.name;
    //ajout du prix
    const priceSelect = document.querySelector("#price");
    priceSelect.textContent = canape.price;
    //ajout de la description
    const descriptionSelect = document.querySelector("#description");
    descriptionSelect.textContent = canape.description;
    //ajout de la liste de couleur
    const colorSelect = document.querySelector("#colors");

    canape.colors.forEach((element) => 
        {
            let colorADD = document.createElement("option");
            colorADD.setAttribute("value", element);
            colorADD.textContent = element;
            colorSelect.appendChild(colorADD);
        });
    }

/*  ***********************************************
    *** Récupération du panier du local storage ***
    *** CE = null ; CS = [panier]               ***
    *********************************************** */
function getBasket() 
    {
    // Récupération du storage.
    let basket = localStorage.getItem("basket");
    // Si le panier est vide.
    if (basket == null) 
        {
            // Alors je renvoie un tableau vide
            return [];
        } 
    else 
        {
            // Si mon panier n'est pas vide, alors je renvoie le panier avec son contenu
            // et je le parse pour pouvoir lire ses données.
            return JSON.parse(basket);
        }
    }

/*  ********************************************
    *** Envoi du panier dans le localStorage ***
    *** CE = panier ; CS = null              ***
    ******************************************** */
function setBasket(basket) 
    {
        //tri
        console.log('panier avant tri = ',basket)
        basket.sort(function triage(a, b) 
            {
            if (a.Id < b.Id) return -1;   //le deuxième id devrait être en premier
            if (a.Id > b.Id) return 1;    //le deuxième id devrait être en deuxième
            if (a.Id = b.Id)              //les deux id sont identiques, on va réorganiser par couleur
                {
                if (a.Color < b.Color) return -1;   //la
                if (a.Color > b.Color) return 1;
                }
            return 0;                       //on ne change plus rien
            });

        console.log('panier après tri = ',basket)
    localStorage.setItem("basket", JSON.stringify(basket));
    }

/*  *********************************************
    *** Verification et mise à jour du panier ***
    *** CE = {panier} ; CS = null             ***
    ********************************************* */
function verifyEntry(panierAEnvoyer) 
    {
    let basket = getBasket();
    for (let i in basket) 
        {
            const element = basket[i];

            if (panierAEnvoyer.Id === element.Id && panierAEnvoyer.Color === element.Color) 
                {
                element.Quantity = panierAEnvoyer.Quantity + element.Quantity;
                setBasket(basket);
                return;
                }
        }
    basket.push(panierAEnvoyer);
    setBasket(basket);
    return;
    }
/**
 * Test si la couleur a été changée.
 * si c'est le cas, le texte du bouton passe à 'ajouter au panier'
 */
function ColorChange()
    {
        const color = document.querySelector('#colors')
        color.onchange = function()
        {
            const Bouton = document.querySelector('#addToCart')
            Bouton.textContent = 'Ajouter au panier'
        }
    }
/**
 * Teste sir la quantité change
 * si c'est le cas, le texte du bouton passe à 'ajouter au panier'
 */
function QuantityChange()
    {
        const color = document.querySelector('#quantity')
        color.onchange = function()
        {
            const Bouton = document.querySelector('#addToCart')
            Bouton.textContent = 'Ajouter au panier'
        }
    }


/*  **********************************************
    *** Test du bouton commander et traitement ***
    *** CE = null ; CS = nul                   ***
    ********************************************** */
function buttonWatched() 
{
  //mise en écoute du click sur le bouton panier
    const buttonSelected = document.querySelector("#addToCart");
    buttonSelected.addEventListener("click", function () 
        {
        //si click
        canapeID = getid(); //recupère l'id dans l'url
        //récupération de la couleur
        const colorsFind = document.querySelector("#colors");
        const ValueChecked = colorsFind.querySelector("option:checked");
        colorValue = ValueChecked.value;
        //récupération de la quantité
        const quantityFind = document.querySelector(
        ".item__content__settings__quantity"
        );
        let quantityInput = quantityFind.querySelector("input");
        let quantityValue = quantityInput.value;

        //canapeID contient l'id du canape
        //colorvalue contient la couleur
        //quantityValue contient la quantité

        //Traitement des erreurs de valeurs
        if (colorValue == "") 
            {
                const Bouton = document.querySelector('#addToCart')
                Bouton.textContent = 'Merci de choisir une couleur'
                return;
            }
        else if(quantityValue == 0) 
            {
                const Bouton = document.querySelector('#addToCart')
                Bouton.textContent = 'Merci de renseigner la quantité'
                return;
            } 
        //envoi à la page panier
        let panierAEnvoyer = 
            {
            Id: canapeID,
            Color: colorValue,
            Quantity: parseInt(quantityValue),
            };

        verifyEntry(panierAEnvoyer);
        const Bouton = document.querySelector('#addToCart')
        Bouton.textContent = 'Le produit a bien été ajouté.'
        document.getElementById('quantity').value = 0;
        document.getElementById('colors').value = '';
        });
}
/*  ****************************
    *** Fonction principale  ***
    **************************** */
async function main() 
    {
    canapeID = getid(); //recupère l'id dans l'url
    let canape = await searchID(canapeID); // récupère l'objet du canape
    DOMconstruct(canape); //ajout à la dom

    //localStorage.clear(); //a effacer vide le storage pour test
    buttonWatched(); // fonction de click au panier
    ColorChange();
    QuantityChange();
    }
    
// Execution du script
main();
