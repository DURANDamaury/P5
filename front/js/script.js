const apiUrl = "http://localhost:3000/api/products";
const htmlIdItems = document.querySelector('#items');

/** ***********************************************
 * Récupération de la liste de canapé via l'api ***
 * @returns {Promise<{_id: string, name: string , price: number, imageUrl: string, description: string, altTxt: string}[]>}                             ***
 *************************************************/
async function fetchData()
  {
    return fetch(apiUrl)
    .then(data => data.json())
    .catch(err => console.log(err))
  }

/** ************************************
 * Création de la Dom pour un canapé ***
 * @param {{_id: string, name: string , price: number, imageUrl: string, description: string, altTxt: string}} canape            ***
 **************************************/
function displayArticles(canape)
  {
    let newHtmlA = document.createElement('a'); //Je créé mon a   
    let idcanape = "product.html?id="+canape._id;
    newHtmlA.setAttribute('href',idcanape);


    let article = document.createElement('article');//Je crée mon article

    let img = document.createElement('img'); //Je créé mon img
    img.setAttribute('src', canape.imageUrl); //Je donne un attribut SRC a mon img
    img.setAttribute('alt', canape.altTxt); //j'ajoute le texte alternatif
    let title = document.createElement('h3'); //Je créé mon h3
    title.textContent = canape.name; //je remplis mon tirte avec du texte
    title.setAttribute('class', 'productName'); // j'ajoute la class au h3
    let description = document.createElement('p'); //Je créé mon p
    description.textContent = canape.description; // je remplis ma description avec du texte
    description.setAttribute('class','productDescription'); //j'ajoute la class sur le p

    article.append(img,title,description);
    newHtmlA.append(article); // Je met <article> dans <a>   
    htmlIdItems.appendChild(newHtmlA); //et je fourre mon a dans le conteneur principal
  }

/** **********************
 * Fonction principale ***
 ************************/
async function main()
{
  let listeCanape = await fetchData()
  // génération des balises <a>
  for(canape of listeCanape)
  {
    displayArticles(canape)
  }
}

main()

