function loadData(category, callback) {
    return fetch('data.json')
        .then(response => response.json())
        .then(data => callback(data[category]))
        .catch(error => {
            console.error(error);
            displayErrorMessage('Error al cargar datos.');
        });
}

function displaySubcategoryContent(subtemaData) {
    const chatMessages = document.getElementById('chat-messages');

    chatMessages.innerHTML = '';

    const botMessage = document.createElement('div');
    botMessage.className = 'bot-message';

    const titleParagraph = document.createElement('p');
    botMessage.appendChild(titleParagraph);
    chatMessages.appendChild(botMessage);
    typeWriterEffect(subtemaData.titulo, titleParagraph);

    const contentParagraph = document.createElement('p');
    botMessage.appendChild(contentParagraph);
    chatMessages.appendChild(botMessage);
    typeWriterEffect(subtemaData.contenido, contentParagraph);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function loadCategoryData(category) {
    const chatMessages = document.getElementById('chat-messages');
    const subcategoriesContainer = document.getElementById('subcategories-container');
    const backToCategoriesButton = document.getElementById('back-to-categories-button');

    chatMessages.innerHTML = '';
    subcategoriesContainer.innerHTML = '';

    loadData(category, data => {
        const botMessage = document.createElement('div');
        botMessage.className = 'bot-message';

        const titleParagraph = document.createElement('p');
        botMessage.appendChild(titleParagraph);
        chatMessages.appendChild(botMessage);
        typeWriterEffect(data.titulo, titleParagraph);

        const contentParagraph = document.createElement('p');
        botMessage.appendChild(contentParagraph);
        chatMessages.appendChild(botMessage);
        typeWriterEffect(data.contenido, contentParagraph);

        if (data.subtemas) {
            data.subtemas.forEach(subtema => {
                const subcategoryButton = document.createElement('button');
                subcategoryButton.className = 'subcategory-button';
                subcategoryButton.textContent = subtema;
                subcategoryButton.addEventListener('click', function () {
                    const subcategory = this.textContent;
                    const subcategoryData = data.subtemasData[subcategory];
                    displaySubcategoryContent(subcategoryData);
                });

                subcategoriesContainer.appendChild(subcategoryButton);
            });

            backToCategoriesButton.style.display = 'block';
        } else {

            backToCategoriesButton.style.display = 'none';
        }

        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
}

function displayErrorMessage(message) {
    const chatMessages = document.getElementById('chat-messages');
    const errorMessage = document.createElement('div');
    errorMessage.className = 'bot-message';
    errorMessage.innerHTML = `<p>${message}</p>`;
    chatMessages.appendChild(errorMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight; 
}

function typeWriterEffect(text, element) {
    let index = 0;
    const speed = 20;

    function type() {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }

    element.innerHTML = '';
    type();
}

const categoryButtons = document.querySelectorAll('.category-button');
categoryButtons.forEach(button => {
    button.addEventListener('click', function () {
        const category = this.getAttribute('data-category');
        loadCategoryData(category);
    });
});

const backToCategoriesButton = document.getElementById('back-to-categories-button');
backToCategoriesButton.addEventListener('click', function () {
    loadCategoryData('tbc_inicio');
});


loadCategoryData('tbc_inicio');

particlesJS("particles-js", {
    "particles": {
        "number": {
            "value": 72,
            "density": {
                "enable": true,
                "value_area": 800
            }
        },
        "color": {
            "value": "#ffffff",
        },
        "shape": {
            "type": "circle"
        },
        "opacity": {
            "value": 1,
            "random": true,
            "anim": {
                "enable": true,
                "speed": 0.5,
                "opacity_min": 0.1,
                "sync": false
            }
        },
        "size": {
            "value": 2,
            "random": true,
            "anim": {
                "enable": true,
                "speed": 2,
                "size_min": 0.1,
                "sync": false
            }
        },
        "move": {
            "enable": true,
            "speed": 0.2,
            "direction": "none",
            "random": true,
            "straight": false,
            "out_mode": "out"
        }
    },
     "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": true,
                "mode": "connect"
            },
            "onclick": {
                "enable": true,
                "mode": "push"
            },
            "resize": true
        },
        "modes": {
            "connect": {
                "distance": 75,
                "line_linked": {
                    "opacity": 0.1,
                    "color": "#ffffff"
                }
            },
            "push": {
                "particles_nb": 2
            }
        }
    }
});

