const productos = [
    {
        id: 1,
        nombre: "Ambo Quirúrgico Antifluido Blanco",
        marca: "Clínica Pro",
        categoria: "ambos",
        precioOferta: 119,
        precioNormal: 159,
        imagen: "img/polo1.jpg",
        tallas: ["S", "M", "L", "XL"],
        stockMensaje: "Alta Demanda"
    },
    {
        id: 2,
        nombre: "Ambo Quirúrgico Negro Elegante",
        marca: "Stretch Shield",
        categoria: "ambos",
        precioOferta: 129,
        precioNormal: 169,
        imagen: "img/polo2.jpg",
        tallas: ["S", "M", "L", "XL"],
        stockMensaje: "Exclusivo"
    },
    {
        id: 3,
        nombre: "Ambo Quirúrgico Celeste Clínico",
        marca: "Clínica Pro",
        categoria: "ambos",
        precioOferta: 119,
        precioNormal: 159,
        imagen: "img/polo3.jpg",
        tallas: ["S", "M", "L"],
        stockMensaje: "Nuevo Ingreso"
    },
    {
        id: 4,
        nombre: "Ambo Quirúrgico Verde Quirófano",
        marca: "Stretch Shield",
        categoria: "ambos",
        precioOferta: 129,
        precioNormal: 169,
        imagen: "img/polo4.jpg",
        tallas: ["S", "M", "L", "XL"],
        stockMensaje: "Más Vendido"
    },
    {
        id: 5,
        nombre: "Ambo Quirúrgico Palo Rosa",
        marca: "Clínica Pro",
        categoria: "ambos",
        precioOferta: 119,
        precioNormal: 159,
        imagen: "img/polo5.jpg",
        tallas: ["XS", "S", "M", "L"],
        stockMensaje: "Últimas Tallas"
    },
    {
        id: 6,
        nombre: "Pantalón Clínico Blanco",
        marca: "Clínica Pro",
        categoria: "pantalones",
        precioOferta: 69,
        precioNormal: 95,
        imagen: "img/pan1.jpg",
        tallas: ["S", "M", "L", "XL"],
        stockMensaje: "Esencial"
    },
    {
        id: 7,
        nombre: "Pantalón Clínico Rosado",
        marca: "Stretch Shield",
        categoria: "pantalones",
        precioOferta: 75,
        precioNormal: 99,
        imagen: "img/pan2.jpg",
        tallas: ["S", "M", "L"],
        stockMensaje: "Stock Limitado"
    },
    {
        id: 8,
        nombre: "Pantalón Clínico Negro",
        marca: "Clínica Pro",
        categoria: "pantalones",
        precioOferta: 69,
        precioNormal: 95,
        imagen: "img/pan3.jpg",
        tallas: ["S", "M", "L", "XL"],
        stockMensaje: "Alta Calidad"
    },
    {
        id: 9,
        nombre: "Pantalón Clínico Verde",
        marca: "Stretch Shield",
        categoria: "pantalones",
        precioOferta: 75,
        precioNormal: 99,
        imagen: "img/pan4.jpg",
        tallas: ["S", "M", "L"],
        stockMensaje: "Disponible"
    },
    {
        id: 10,
        nombre: "Pantalón Clínico Azul Marino",
        marca: "Clínica Pro",
        categoria: "pantalones",
        precioOferta: 69,
        precioNormal: 95,
        imagen: "img/pan5.jpg",
        tallas: ["S", "M", "L", "XL"],
        stockMensaje: "Clásico"
    }
];

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let currentSlide = 0;
let slideInterval;

window.onload = function() {
    if (document.getElementById('product-grid')) {
        mostrarProductos(productos);
    }
    actualizarCarritoUI();
    crearContenedorToast();
    iniciarSlider();

    // Cargar detalle si estamos en producto.html
    inicializarPaginaDetalle();

    const loader = document.getElementById('page-loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1500); 
    }
};

function iniciarSlider() {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;

    slideInterval = setInterval(() => {
        cambiarSlide(1);
    }, 4500);
}

function cambiarSlide(n) {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;

    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
}

function crearContenedorToast() {
    if (!document.getElementById('toast')) {
        const toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast-notification';
        toast.innerText = '¡Producto añadido a la bolsa!';
        document.body.appendChild(toast);
    }
}

function mostrarToast(mensaje) {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.innerText = mensaje;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }
}

function filtrarYRenderizar() {
    const catTodos = document.querySelector('#filter-categorias input[value="todos"]');
    const catCheckboxes = document.querySelectorAll('#filter-categorias input:not([value="todos"]):checked');
    
    // Comportamiento inteligente de filtros de categoría
    if (catCheckboxes.length > 0 && catTodos && catTodos.checked) {
        catTodos.checked = false;
    } else if (catCheckboxes.length === 0 && catTodos && !catTodos.checked) {
        catTodos.checked = true;
    }

    let categoriasSeleccionadas = Array.from(document.querySelectorAll('#filter-categorias input:checked')).map(cb => cb.value);

    const marcaCheckboxes = document.querySelectorAll('#filter-marcas input:checked');
    let marcasSeleccionadas = Array.from(marcaCheckboxes).map(cb => cb.value);

    const tallaCheckboxes = document.querySelectorAll('#filter-tallas input:checked');
    let tallasSeleccionadas = Array.from(tallaCheckboxes).map(cb => cb.value);

    const searchInput = document.getElementById('searchInput');
    let textoBusqueda = searchInput ? searchInput.value.toLowerCase() : "";

    let filtrados = productos.filter(prod => {
        let cumpleCat = categoriasSeleccionadas.includes('todos') || categoriasSeleccionadas.length === 0 || categoriasSeleccionadas.includes(prod.categoria);
        let cumpleMarca = marcasSeleccionadas.length === 0 || marcasSeleccionadas.includes(prod.marca);
        let cumpleTalla = tallasSeleccionadas.length === 0 || prod.tallas.some(t => tallasSeleccionadas.includes(t));
        let cumpleBusqueda = prod.nombre.toLowerCase().includes(textoBusqueda) || prod.marca.toLowerCase().includes(textoBusqueda);

        return cumpleCat && cumpleMarca && cumpleTalla && cumpleBusqueda;
    });

    const titulo = document.getElementById('titulo-categoria');
    if (titulo) {
        titulo.innerText = textoBusqueda ? "Resultados de búsqueda" : "Catálogo General";
    }

    mostrarProductos(filtrados);
}

function resetFiltros() {
    document.querySelectorAll('.filters-sidebar input[type="checkbox"]').forEach(cb => cb.value === 'todos' ? cb.checked = true : cb.checked = false);
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = "";
    filtrarYRenderizar();
}

function mostrarProductos(lista) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    grid.innerHTML = "";

    if (lista.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:#64748b; padding: 40px; font-size: 14px;">No se encontraron prendas con los filtros seleccionados.</p>`;
        return;
    }

    lista.forEach((prod, index) => {
        let opcionesTallas = prod.tallas.map(t => `<option value="${t}">${t}</option>`).join('');
        let delay = (index % 4) * 80;

        grid.innerHTML += `
            <div class="product-card" data-aos="fade-up" data-aos-duration="600" data-aos-delay="${delay}">
                <span class="stock-badge">${prod.stockMensaje}</span>
                <img src="${prod.imagen}" alt="${prod.nombre}" class="product-img" onclick="verDetalle(${prod.id})">
                <div class="product-info">
                    <span class="product-brand">${prod.marca}</span>
                    <h3 class="product-name" onclick="verDetalle(${prod.id})">${prod.nombre}</h3>
                    <div class="product-pricing">
                        <span class="price-offer">S/. ${prod.precioOferta.toFixed(2)}</span>
                        <span class="price-normal">S/. ${prod.precioNormal.toFixed(2)}</span>
                    </div>
                    <div class="size-selector">
                        <label>Talla:</label>
                        <select id="talla-${prod.id}">
                            ${opcionesTallas}
                        </select>
                    </div>
                    <button class="add-to-cart" onclick="agregarAlCarrito(${prod.id})">Agregar a la Bolsa</button>
                </div>
            </div>
        `;
    });
}

function verDetalle(id) {
    window.location.href = `producto.html?id=${id}`;
}

function inicializarPaginaDetalle() {
    const detailContainer = document.getElementById('productDetailContainer');
    if (!detailContainer) return;

    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id'));
    const producto = productos.find(p => p.id === productId);

    if (!producto) {
        detailContainer.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding: 40px;">Producto no encontrado.</p>`;
        return;
    }

    let opcionesTallas = producto.tallas.map(t => `<option value="${t}">${t}</option>`).join('');

    detailContainer.innerHTML = `
        <div class="detail-img-container">
            <img src="${producto.imagen}" alt="${producto.nombre}">
        </div>
        <div class="detail-info-container">
            <span class="detail-brand">${producto.marca} • ${producto.stockMensaje}</span>
            <h1 class="detail-title">${producto.nombre}</h1>
            <div class="detail-pricing">
                <span class="detail-price-offer">S/. ${producto.precioOferta.toFixed(2)}</span>
                <span class="detail-price-normal">S/. ${producto.precioNormal.toFixed(2)}</span>
            </div>
            <div class="detail-description">
                Prenda de indumentaria clínica diseñada bajo estrictos estándares de calidad. Confeccionada con textil inteligente que garantiza máxima comodidad, durabilidad y transpirabilidad en turnos prolongados.
            </div>
            <ul class="detail-features-list">
                <li>✔️ <strong>Tecnología Antifluido:</strong> Repela líquidos y manchas accidentales.</li>
                <li>✔️ <strong>Tejido Stretch:</strong> Elasticidad superior para total libertad de movimiento.</li>
                <li>✔️ <strong>Fácil Mantenimiento:</strong> No encoge, no requiere planchado complejo.</li>
            </ul>
            <div class="detail-size-box">
                <label>Selecciona tu Talla:</label>
                <select id="talla-${producto.id}">
                    ${opcionesTallas}
                </select>
            </div>
            <button class="detail-add-btn" onclick="agregarAlCarrito(${producto.id})">Agregar a la Bolsa de Compras</button>
        </div>
    `;
}

function toggleCart() {
    const modal = document.getElementById('cartModal');
    const overlay = document.getElementById('overlay');
    if (modal) modal.classList.toggle('open');
    if (overlay) overlay.classList.toggle('active');
}

function agregarAlCarrito(idProducto) {
    const productoEncontrado = productos.find(p => p.id === idProducto);
    const selectTalla = document.getElementById(`talla-${idProducto}`);
    
    if (!selectTalla) return;
    const tallaElegida = selectTalla.value;

    carrito.push({
        nombre: productoEncontrado.nombre,
        marca: productoEncontrado.marca,
        precio: productoEncontrado.precioOferta,
        imagen: productoEncontrado.imagen,
        talla: tallaElegida
    });

    guardarYActualizar();
    mostrarToast(`✓ Agregado: ${productoEncontrado.nombre} (Talla ${tallaElegida})`);
}

function guardarYActualizar() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarritoUI();
}

function actualizarCarritoUI() {
    const container = document.getElementById('cartItemsContainer');
    const countBadge = document.getElementById('cart-count');
    const subtotalText = document.getElementById('cartSubtotalText');
    const totalText = document.getElementById('cartTotalText');

    if (countBadge) countBadge.innerText = carrito.length;
    if (!container || !totalText) return;

    if (carrito.length === 0) {
        container.innerHTML = `
            <div class="empty-cart-state">
                <span class="empty-cart-emoji">🛒</span>
                <p>Tu bolsa está vacía</p>
                <small>Explora nuestro catálogo y añade tus prendas clínicas.</small>
            </div>
        `;
        if (subtotalText) subtotalText.innerText = "S/. 0.00";
        totalText.innerText = "S/. 0.00";
        return;
    }

    container.innerHTML = '';
    let total = 0;

    carrito.forEach((item, index) => {
        total += item.precio;
        container.innerHTML += `
            <div class="cart-item-card">
                <img src="${item.imagen}" alt="${item.nombre}" class="cart-item-img">
                <div class="cart-item-details">
                    <span class="cart-item-brand">${item.marca}</span>
                    <h5 class="cart-item-name">${item.nombre}</h5>
                    <div class="cart-item-meta">Talla: <strong>${item.talla}</strong></div>
                </div>
                <div class="cart-item-price-action">
                    <span class="cart-item-price">S/. ${item.precio.toFixed(2)}</span>
                    <button class="cart-item-remove" onclick="eliminarItem(${index})">Eliminar</button>
                </div>
            </div>
        `;
    });

    if (subtotalText) subtotalText.innerText = `S/. ${total.toFixed(2)}`;
    totalText.innerText = `S/. ${total.toFixed(2)}`;
}

function eliminarItem(index) {
    carrito.splice(index, 1);
    guardarYActualizar();
}

function finalizarCompraWhatsApp() {
    if (carrito.length === 0) {
        alert("Tu bolsa de compras está vacía.");
        return;
    }

    const inputNombre = document.getElementById('nombreCliente');
    const inputTelefono = document.getElementById('telefonoCliente');
    const inputCiudad = document.getElementById('ciudadCliente');
    const inputDireccion = document.getElementById('direccionCliente');

    if (!inputNombre || !inputTelefono || !inputCiudad || !inputDireccion) return;

    let nombre = inputNombre.value.trim();
    let telefono = inputTelefono.value.trim();
    let ciudad = inputCiudad.value.trim();
    let direccion = inputDireccion.value.trim();

    if (!nombre || !telefono || !ciudad || !direccion) {
        alert("Por favor complete todos los datos de envío y facturación.");
        return;
    }

    let mensaje = `Hola MedStyle, deseo confirmar el siguiente pedido institucional:\n\n`;
    mensaje += `👤 *Cliente/Doctor(a):* ${nombre}\n`;
    mensaje += `📱 *Teléfono:* ${telefono}\n`;
    mensaje += `🏙️ *Ciudad:* ${ciudad}\n`;
    mensaje += `📍 *Dirección/Agencia:* ${direccion}\n\n`;
    mensaje += `🛍️ *Detalle de Prendas:* \n`;

    let total = 0;
    carrito.forEach((item, index) => {
        mensaje += `${index + 1}. *${item.marca}* - ${item.nombre} (Talla: ${item.talla}) - S/. ${item.precio.toFixed(2)}\n`;
        total += item.precio;
    });

    mensaje += `\n💰 *Total Estimado:* S/. ${total.toFixed(2)}\n`;
    mensaje += `💳 *Método de pago:* Yape / Plin / Transferencia.\n\nPor favor envíeme los números de cuenta institucionales para realizar el pago y adjuntar mi comprobante.`;

    let numeroWhatsApp = "51978225778"; 
    let url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, '_blank');
}