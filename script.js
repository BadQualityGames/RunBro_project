document.addEventListener('DOMContentLoaded', function() {
    const productsGrid = document.getElementById('products');
    const searchInput = document.getElementById('search');
    const categorySelect = document.getElementById('category');
    const brandSelect = document.getElementById('brand');
    const colorSelect = document.getElementById('color');
    const genderSelect = document.getElementById('gender');
    const modal = document.getElementById('productModal');
    const modalContent = document.getElementById('modalContent');
    const closeModal = document.querySelector('.close');

    let products = [];

    // Загрузка товаров
    fetch('http://localhost:8888/z/get_products.php') // Укажите правильный порт
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            products = data;
            displayProducts(products);
            populateFilters(products);
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });

    // Отображение товаров
    function displayProducts(products) {
        productsGrid.innerHTML = '';
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';

            // Используем image_url для загрузки изображения
            const imageUrl = product.image_url || 'default-image.jpg'; // Если image_url отсутствует, используем изображение по умолчанию

            productCard.innerHTML = `
                <img src="${imageUrl}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.price} руб.</p>
            `;
            productCard.addEventListener('click', () => openModal(product));
            productsGrid.appendChild(productCard);
        });
    }

    // Открытие модального окна с деталями товара
    function openModal(product) {
        const imageUrl = product.image_url || 'default-image.jpg'; // Если image_url отсутствует, используем изображение по умолчанию

        modalContent.innerHTML = `
            <h2>${product.name}</h2>
            <div class="images">
                <img src="${imageUrl}" alt="${product.name}">
            </div>
            <p>${product.description}</p>
            <p><strong>Цена:</strong> ${product.price} руб.</p>
            <a href="${product.referral_link}" target="_blank">Купить</a>
        `;
        modal.style.display = 'block';
    }

    // Закрытие модального окна
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Заполнение фильтров
    function populateFilters(products) {
        const categories = [...new Set(products.map(product => product.category))];
        const brands = [...new Set(products.map(product => product.brand))];
        const colors = [...new Set(products.map(product => product.color))];

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });

        brands.forEach(brand => {
            const option = document.createElement('option');
            option.value = brand;
            option.textContent = brand;
            brandSelect.appendChild(option);
        });

        colors.forEach(color => {
            const option = document.createElement('option');
            option.value = color;
            option.textContent = color;
            colorSelect.appendChild(option);
        });
    }

    // Фильтрация товаров
    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const category = categorySelect.value;
        const brand = brandSelect.value;
        const color = colorSelect.value;
        const gender = genderSelect.value;

        const filteredProducts = products.filter(product => {
            return (
                product.name.toLowerCase().includes(searchTerm) &&
                (category === '' || product.category === category) &&
                (brand === '' || product.brand === brand) &&
                (color === '' || product.color === color) &&
                (gender === '' || product.gender === gender)
            );
        });

        displayProducts(filteredProducts);
    }

    searchInput.addEventListener('input', filterProducts);
    categorySelect.addEventListener('change', filterProducts);
    brandSelect.addEventListener('change', filterProducts);
    colorSelect.addEventListener('change', filterProducts);
    genderSelect.addEventListener('change', filterProducts);
});