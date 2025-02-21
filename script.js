document.addEventListener('DOMContentLoaded', function() {
    const productsGrid = document.getElementById('products');
    const searchInput = document.getElementById('search');
    const categorySelect = document.getElementById('category');
    const brandSelect = document.getElementById('brand');
    const colorSelect = document.getElementById('color');
    const genderSelect = document.getElementById('gender');
    const sortPriceAsc = document.getElementById('sortPriceAsc');
    const sortPriceDesc = document.getElementById('sortPriceDesc');
    const modal = document.getElementById('productModal');
    const modalContent = document.getElementById('modalContent');
    const closeModal = document.querySelector('.close');

    // Проверка, что все элементы существуют
    if (!productsGrid || !searchInput || !categorySelect || !brandSelect || !colorSelect || !genderSelect || !sortPriceAsc || !sortPriceDesc || !modal || !modalContent || !closeModal) {
        console.error('Один или несколько элементов не найдены в DOM.');
        return;
    }

    let products = [];

    // Загрузка товаров
    fetch('http://localhost:8888/z/get_products.php') // Замените на ваш API
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
        if (!productsGrid) {
            console.error('Элемент productsGrid не найден.');
            return;
        }
        productsGrid.innerHTML = '';
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';

            const imageUrl = product.image_url || 'default-image.jpg';

            productCard.innerHTML = `
                <img src="${imageUrl}" alt="${product.name}" onerror="this.src='default-image.jpg'">
                <h3>${product.name}</h3>
                <p>${product.price} руб.</p>
            `;
            productCard.addEventListener('click', () => openModal(product));
            productsGrid.appendChild(productCard);
        });
    }

    // Открытие модального окна с деталями товара
    function openModal(product) {
        if (!modalContent) {
            console.error('Элемент modalContent не найден.');
            return;
        }
        const imageUrl = product.image_url || 'default-image.jpg';

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
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            if (modal) modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === modal && modal) {
            modal.style.display = 'none';
        }
    });

    // Заполнение фильтров
    function populateFilters(products) {
        const categories = [...new Set(products.map(product => product.category))];
        const brands = [...new Set(products.map(product => product.brand))];
        const colors = [...new Set(products.map(product => product.color))];

        updateSelectOptions(categorySelect, categories);
        updateSelectOptions(brandSelect, brands);
        updateSelectOptions(colorSelect, colors);
    }

    // Обновление опций в выпадающих списках
    function updateSelectOptions(selectElement, options) {
        if (!selectElement) {
            console.error('Элемент selectElement не найден.');
            return;
        }
        selectElement.innerHTML = '<option value="">Все</option>';
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            selectElement.appendChild(optionElement);
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

    // Обновление фильтров на основе отфильтрованных товаров
    function updateFiltersBasedOnProducts(filteredProducts) {
        const categories = [...new Set(filteredProducts.map(product => product.category))];
        const brands = [...new Set(filteredProducts.map(product => product.brand))];
        const colors = [...new Set(filteredProducts.map(product => product.color))];

        updateSelectOptions(categorySelect, categories);
        updateSelectOptions(brandSelect, brands);
        updateSelectOptions(colorSelect, colors);
    }

    // Сортировка по цене (по возрастанию)
    if (sortPriceAsc) {
        sortPriceAsc.addEventListener('click', () => {
            const sortedProducts = [...products].sort((a, b) => a.price - b.price);
            displayProducts(sortedProducts);
        });
    }

    // Сортировка по цене (по убыванию)
    if (sortPriceDesc) {
        sortPriceDesc.addEventListener('click', () => {
            const sortedProducts = [...products].sort((a, b) => b.price - a.price);
            displayProducts(sortedProducts);
        });
    }

    // Применение фильтров при изменении значений
    if (searchInput) searchInput.addEventListener('input', filterProducts);
    if (categorySelect) categorySelect.addEventListener('change', filterProducts);
    if (brandSelect) brandSelect.addEventListener('change', filterProducts);
    if (colorSelect) colorSelect.addEventListener('change', filterProducts);
    if (genderSelect) genderSelect.addEventListener('change', filterProducts);
});