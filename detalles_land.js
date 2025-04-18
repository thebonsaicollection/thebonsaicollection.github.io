document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const landName = urlParams.get('Land');

    const detailsContainer = document.getElementById('details-container');

    if (landName) {
        fetchIslandDetails(landName)
            .then(html => {
                detailsContainer.innerHTML = html;
            })
            .catch(error => {
                console.error(`Error al cargar el contenido de la isla ${landName}:`, error);
                detailsContainer.innerHTML = `<p>No se pudo cargar la información de la isla ${landName}.</p>`;
            });
    } else {
        detailsContainer.innerHTML = '<p>No se proporcionó información de la isla.</p>';
    }
});

async function fetchIslandDetails(landName) {
    try {
        const response = await fetch(`islas/${encodeURIComponent(landName)}.html`);
        if (!response.ok) {
            throw new Error('File not found');
        }
        return await response.text();
    } catch (error) {
        throw error;
    }
}
