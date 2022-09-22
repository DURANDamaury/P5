const apiUrl = "http://localhost:3000/api/products";

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

async function main()
    {
        canapeID = getid(); //recupère l'id dans l'url
        let canape = await searchID(canapeID); // récupère l'objet du canape
        DOMconstruct(canape);
    }

main();





