const tg = window.Telegram.WebApp;

// Получение текущей темы
const isDarkTheme = tg.colorScheme === 'dark';

// Настройка цветов
document.body.style.backgroundColor = isDarkTheme ? '#1e1e1e' : '#ffffff';
document.body.style.color = isDarkTheme ? '#ffffff' : '#000000';

// Пример данных о товарах
const products = [
    {
        id: 1,
        name: 'Толстовка Arch Hooded Sweat',
        category: 'men',
        price: 999,
        description: 'Мужская толстовка с свободным кроем и регулируемым капюшоном.',
        image: 'https://example.com/hoodie.jpg'
    },
    {
        id: 2,
        name: 'Кроссовки POP TRADING COMPANY',
        category: 'sneakers',
        price: 989,
        description: 'Стильные кроссовки для повседневной носки.',
        image: 'https://example.com/sneakers.jpg'
    }
];

// Отображение товаров
function renderProducts(category = 'all') {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = '';

    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);

    filteredProducts.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product';
        productElement.innerHTML = `
            <h3>${product.name}</h3>
            <p>${product.price} ₽</p>
            <p>${product.description}</p>
            <button onclick="addToCart(${product.id})">+ Добавить</button>
        `;
        productsContainer.appendChild(productElement);
    });
}

// Фильтрация по категориям
document.querySelectorAll('.category').forEach(button => {
    button.addEventListener('click', () => {
        const category = button.getAttribute('data-category');
        renderProducts(category);
    });
});

// Кнопка "Посмотреть"
document.getElementById('view').addEventListener('click', () => {
    tg.sendData(JSON.stringify({ action: 'view_cart' }));
});

// Инициализация
tg.ready();
renderProducts();