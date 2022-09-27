const apiUrl = "http://localhost:3000/api/products";

function printm(message)
    {
        console.log(message);
    }

async function fetchData()
    {
        return fetch(apiUrl)
        .then(data => data.json())
        .catch(err => console.log(err))
    }

function getid()
    {
        const url = new URLSearchParams(window.location.search)
        // On récupère l'url de la page courante
        var canapeID = url.get("id");
        // on récupère la valeur du paramètre id
        return canapeID;
    }

async function searchID(canapeID)
    {
        let listeCanape = await fetchData()
        for(canape of listeCanape)
        {
            idRead = canape._id;
            if (idRead === canapeID)
            {
                return canape;
            }
        }
    }

function DOMconstruct(canape)
    {
        //ajout de l'image
        const imgSelect = document.querySelector('.item__img');
        let img = document.createElement('img');
        img.setAttribute('src',canape.imageUrl);
        imgSelect.appendChild(img);
        //ajout du nom
        const titleSelect = document.querySelector('#title');
        titleSelect.textContent = canape.name;
        //ajout du prix
        const priceSelect = document.querySelector('#price');
        priceSelect.textContent = canape.price;
        //ajout de la description
        const descriptionSelect = document.querySelector('#description');
        descriptionSelect.textContent = canape.description;
        //ajout de la liste de couleur
        const colorSelect = document.querySelector('#colors');
        
        canape.colors.forEach(element => 
        {
            let colorADD = document.createElement('option');
            colorADD.setAttribute('value',element);
            colorADD.textContent = element;
            colorSelect.appendChild(colorADD);
        });
    }

function getBasket() 
    {
        // Récupération du storage.
        let basket = localStorage.getItem("basket");
        // Si le panier est vide.
        if (basket == null) {
            // Alors je renvoie un tableau vide
            return [];
        } else {
            // Si mon panier n'est pas vide, alors je renvoie le panier avec son contenu 
            // et bien je le parse pour pouvoir lire ses données.
            return JSON.parse(basket);
        }
    }


function verifyEntry(basket,panierAEnvoyer)
    {
        basketLongueur = basket.length;
        let IdAEnvoyer=panierAEnvoyer.Id;
        let ColorAEnvoyer=panierAEnvoyer.Color;
        let ObjetPresent = false;
        for (i=0; i<basketLongueur; i++)
        {
            let element=basket[i];
            printm(element);
            let IdBasket=element.Id;
            let ColorBasket=element.Color;


            printm("Id Read: "+IdBasket+" - Color Read: "+ColorBasket);
            printm("Id Send: "+IdAEnvoyer+" - Color Send: "+ColorAEnvoyer);

            if (IdBasket==IdAEnvoyer && ColorBasket==ColorAEnvoyer)
                {
                    // let QuantityBasket = parseInt(element.Quantity);
                    // let QuantityAEnvoyer = parseInt(panierAEnvoyer.Quantity);
                    // QuantityBasket += QuantityAEnvoyer;
                    // QuantityFinal = toString(QuantityBasket);
                    // QuantityBasket == QuantityFinal
                    // localStorage.setItem("basket",basket);
                    // printm(element)
                    // ObjetPresent=true;
                    // return ObjetPresent;
                    printm(panierAEnvoyer);
                    element.Quantity = panierAEnvoyer.quantity + element.quantity;
                    localStorage.setItem("basket", basket); 
                    return;
                }            
        }
        printm(ObjetPresent);
        return ObjetPresent;
    }

function setBasket (panierAEnvoyer)
    {
                let basket = getBasket(); //on récupère le localstorage
                // avant d'ajouter on va vérifier si l'objet est déjà présent
                verifyEntry(basket,panierAEnvoyer);

                basket.push(panierAEnvoyer); //on ajoute le nouveau panier
                let newbasket = JSON.stringify(basket); //on passe en string
                localStorage.setItem("basket",newbasket); //on envoie           
                printm('envoyé');  
                return;

    }

function buttonWatched() //mise en écoute du click sur le bouton panier
    {
        const buttonSelected = document.querySelector('#addToCart');
        buttonSelected.addEventListener('click', function()
        {
            //si click
            canapeID = getid(); //recupère l'id dans l'url
            //récupération de la couleur
            const colorsFind = document.querySelector('#colors');
            const ValueChecked = colorsFind.querySelector('option:checked');
            colorValue = ValueChecked.value;
            //récupération de la quantité
            const quantityFind = document.querySelector('.item__content__settings__quantity');
            const quantityInput = quantityFind.querySelector('input');
            quantityValue = quantityInput.value;

            //canapeID contient l'id du canape
            //colorvalue contient la couleur
            //quantityValue contient la quantité


            //Traitement des erreurs de valeurs
            if (quantityValue == 0)
                {
                    alert ('Merci de renseigner la quantité');
                    return;
                }
            else
            if (colorValue == "")
                {
                    alert ('Merci de choisir une couleur');
                    return;
                }
        //envoi à la page panier
            let panierAEnvoyer = 
                {
                    Id: canapeID,
                    Color: colorValue,
                    Quantity: quantityValue
                };
            setBasket(panierAEnvoyer);

        });
    }





async function main()
    {
        canapeID = getid(); //recupère l'id dans l'url
        let canape = await searchID(canapeID); // récupère l'objet du canape
        DOMconstruct(canape); //ajout à la dom

        //localStorage.clear(); //a effacer vide le storage pour test
        buttonWatched(); // fonction de click au panier

    }

main();





