document.addEventListener('DOMContentLoaded', function () {
    
    const urlParams = new URLSearchParams(window.location.search);
    const isla = urlParams.get('isla');

    const detailsContainer = document.getElementById('details-container');

    if (isla) {

        detailsContainer.innerHTML = `
            <h1>Detalles de ${isla}</h1>
            <p>Bienvenido a los detalles de ${isla}. Aquí encontrarás información específica sobre esta tierra.</p>
            <!-- Agrega más contenido según sea necesario -->
        `;
    } else {

        detailsContainer.innerHTML = '<p>No se proporcionó información de la isla.</p>';
    }
});
