document.addEventListener('DOMContentLoaded', function () {
    // Obtiene el parámetro de consulta "isla"
    const urlParams = new URLSearchParams(window.location.search);
    const isla = urlParams.get('isla');

    // Elemento HTML donde se mostrará la información de la isla
    const detailsContainer = document.getElementById('details-container');

    // Verifica si se proporcionó un nombre de isla
    if (isla) {
        // Muestra información específica para la isla
        detailsContainer.innerHTML = `
            <h1>Detalles de ${isla}</h1>
            <p>Bienvenido a los detalles de ${isla}. Aquí encontrarás información específica sobre esta tierra.</p>
            <!-- Agrega más contenido según sea necesario -->
        `;
    } else {
        // Maneja la situación en la que no se proporcionó el nombre de la isla
        detailsContainer.innerHTML = '<p>No se proporcionó información de la isla.</p>';
    }
});
