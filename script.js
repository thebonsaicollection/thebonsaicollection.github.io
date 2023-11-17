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

// Función para mostrar información de subtema en el chat con efecto de escritura
function displaySubcategoryContent(subtemaData) {
    const chatMessages = document.getElementById('chat-messages');

    // Limpia los mensajes anteriores en el chat
    chatMessages.innerHTML = '';

    const botMessage = document.createElement('div');
    botMessage.className = 'bot-message';

    // Muestra el título con efecto de escritura
    const titleParagraph = document.createElement('p');
    botMessage.appendChild(titleParagraph);
    chatMessages.appendChild(botMessage);
    typeWriterEffect(subtemaData.titulo, titleParagraph);

    // Muestra el contenido con efecto de escritura
    const contentParagraph = document.createElement('p');
    botMessage.appendChild(contentParagraph);
    chatMessages.appendChild(botMessage);
    typeWriterEffect(subtemaData.contenido, contentParagraph);

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

        // Muestra el título de la categoría con efecto de escritura
        const titleParagraph = document.createElement('p');
        botMessage.appendChild(titleParagraph);
        chatMessages.appendChild(botMessage);
        typeWriterEffect(data.titulo, titleParagraph);

        // Muestra el contenido de la categoría con efecto de escritura
        const contentParagraph = document.createElement('p');
        botMessage.appendChild(contentParagraph);
        chatMessages.appendChild(botMessage);
        typeWriterEffect(data.contenido, contentParagraph);

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

// Función para simular efecto de escritura tipo máquina de escribir
function typeWriterEffect(text, element) {
    let index = 0;
    const speed = 20; // Velocidad de escritura (en milisegundos)

    function type() {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }

    // Limpia el contenido previo antes de comenzar a escribir
    element.innerHTML = '';
    type();
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

// Configuración de particles.js
particlesJS("particles-js", {
    "particles": {
        // Configuraciones de partículas
        "number": {
            "value": 100, // Reducir la cantidad de partículas
            "density": {
                "enable": true,
                "value_area": 800
            }
        },
        "size": {
            "value": 1 // Reducir el tamaño de las partículas
        },
        "color": {
            "value": "#ffffff"
        },
        "shape": {
            "type": "circle"
        },
        "opacity": {
            "value": 0.2,
            "random": false,
            "anim": {
                "enable": false,
                "speed": 1,
                "opacity_min": 0.1,
                "sync": false
            }
        },
        "move": {
            "speed": 1 // Reducir la velocidad de movimiento de las partículas
        }
        // Otras configuraciones de partículas...
    },
    "interactivity": {
        // Configuraciones de interactividad
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": true,
                "mode": "grab"
            },
            "onclick": {
                "enable": true,
                "mode": "push"
            }
            // Otros eventos interactivos...
        }
        // Otras configuraciones de interactividad...
    }
    // Otras configuraciones globales de particles.js...
});
