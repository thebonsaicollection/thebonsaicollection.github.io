// Función para cargar datos desde el archivo JSON
function loadData(category, callback) {
    return fetch('data.json')
        .then(response => response.json())
        .then(data => callback(data[category]))
        .catch(error => {
            console.error(error);
            // Muestra un mensaje de error al usuario si falla la carga de datos
            displayErrorMessage('Error al cargar datos.');
        });
}

// Función para mostrar información de subtema en el chat
function displaySubcategoryContent(subtemaData) {
    const chatMessages = document.getElementById('chat-messages');

    // Limpia los mensajes anteriores en el chat
    chatMessages.innerHTML = '';

    const botMessage = document.createElement('div');
    botMessage.className = 'bot-message';
    botMessage.innerHTML = `<p>${subtemaData.titulo}</p><p>${subtemaData.contenido}</p>`;

    chatMessages.appendChild(botMessage);

    // Enfoca automáticamente el chat en el nuevo mensaje
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Función para cargar datos en la página
function loadCategoryData(category) {
    const chatMessages = document.getElementById('chat-messages');
    const subcategoriesContainer = document.getElementById('subcategories-container');
    const backToCategoriesButton = document.getElementById('back-to-categories-button');

    // Limpia los mensajes anteriores en el chat y las subcategorías
    chatMessages.innerHTML = '';
    subcategoriesContainer.innerHTML = '';

    loadData(category, data => {
        const botMessage = document.createElement('div');
        botMessage.className = 'bot-message';
        botMessage.innerHTML = `<p>${data.titulo}</p><p>${data.contenido}</p>`;

        chatMessages.appendChild(botMessage);

        if (data.subtemas) {
            // Muestra las subcategorías como botones
            data.subtemas.forEach(subtema => {
                const subcategoryButton = document.createElement('button');
                subcategoryButton.className = 'subcategory-button';
                subcategoryButton.textContent = subtema;

                // Agrega un evento de clic a las subcategorías para mostrar el contenido
                subcategoryButton.addEventListener('click', function () {
                    const subcategory = this.textContent;
                    const subcategoryData = data.subtemasData[subcategory];
                    displaySubcategoryContent(subcategoryData);
                });

                subcategoriesContainer.appendChild(subcategoryButton);
            });

            // Muestra el botón "Volver al Inicio"
            backToCategoriesButton.style.display = 'block';
        } else {
            // Oculta el botón "Volver al Inicio" si no hay subcategorías
            backToCategoriesButton.style.display = 'none';
        }

        // Enfoca automáticamente el chat en el nuevo mensaje
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
}

// Función para mostrar un mensaje de error al usuario
function displayErrorMessage(message) {
    const chatMessages = document.getElementById('chat-messages');
    const errorMessage = document.createElement('div');
    errorMessage.className = 'bot-message';
    errorMessage.innerHTML = `<p>${message}</p>`;
    chatMessages.appendChild(errorMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Enfoca en el mensaje de error
}

// Agregar eventos de clic a los botones de categoría
const categoryButtons = document.querySelectorAll('.category-button');
categoryButtons.forEach(button => {
    button.addEventListener('click', function () {
        const category = this.getAttribute('data-category');
        loadCategoryData(category);
    });
});

// Agregar evento de clic al botón "Volver al Inicio"
const backToCategoriesButton = document.getElementById('back-to-categories-button');
backToCategoriesButton.addEventListener('click', function () {
    loadCategoryData('problema_global'); // Cambia 'problema_global' por la categoría de inicio
});

// Iniciar con la categoría por defecto al cargar la página
loadCategoryData('problema_global');
