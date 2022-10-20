function getorderId() 
    {
    const url = new URLSearchParams(window.location.search);
    // On récupère l'url de la page courante
    var orderId = url.get("orderId");
    // on récupère la valeur du paramètre id
    return orderId;
    }

function setDomOrderId(orderId)
    {
        DomOrderMessage = document.getElementById('orderId')
        DomOrderMessage.textContent=orderId
    }


function main()
    {
        const orderId = getorderId();
        setDomOrderId(orderId);
    }

main();