const productos = [
    {
        id: 1,
        nombre: "Polo Básico Algodón",
        marca: "Tommy Hilfiger",
        categoria: "polos",
        precioOferta: 109,
        precioNormal: 239,
        imagen: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=500&q=80",
        tallas: ["S", "M", "L", "XL"],
        stockMensaje: "¡Pocas unidades!"
    },
    {
        id: 2,
        nombre: "Camisero Casual",
        marca: "Nautica",
        categoria: "camisas",
        precioOferta: 145,
        precioNormal: 299.90,
        imagen: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=500&q=80",
        tallas: ["S", "M", "L"],
        stockMensaje: "¡Última talla L!"
    },
    {
        id: 3,
        nombre: "Polo Logo Clásico",
        marca: "Calvin Klein",
        categoria: "polos",
        precioOferta: 99,
        precioNormal: 199,
        imagen: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=500&q=80",
        tallas: ["M", "L", "XL"],
        stockMensaje: "Alta demanda"
    },
    {
        id: 4,
        nombre: "Camisa de Lino PFG",
        marca: "Columbia",
        categoria: "camisas",
        precioOferta: 149,
        precioNormal: 289,
        imagen: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=500&q=80",
        tallas: ["S", "M", "L", "XL"],
        stockMensaje: "¡Pocas unidades!"
    }
];

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

window.onload = function() {
    if (document.getElementById('product-grid')) {
        mostrarProductos(productos);
    }
    actualizarCarritoUI();
    crearContenedorToast();

    // Loader configurado a exactamente 1.5 segundos (1500ms)
    const loader = document.getElementById('page-loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1500); 
    }
};

function crearContenedorToast() {
    if (!document.getElementById('toast')) {
        const toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast-notification';
        toast.innerText = '¡Producto añadido al carrito!';
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
    const catCheckboxes = document.querySelectorAll('#filter-categorias input:checked');
    let categoriasSeleccionadas = Array.from(catCheckboxes).map(cb => cb.value);

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
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:#777; padding: 20px;">No se encontraron productos con estos filtros.</p>`;
        return;
    }

    lista.forEach((prod, index) => {
        let opcionesTallas = prod.tallas.map(t => `<option value="${t}">${t}</option>`).join('');
        let delay = (index % 4) * 100;

        grid.innerHTML += `
            <div class="product-card" data-aos="fade-up" data-aos-duration="600" data-aos-delay="${delay}">
                <span class="stock-badge">${prod.stockMensaje}</span>
                <img src="${prod.imagen}" alt="${prod.nombre}" class="product-img" onclick="verDetalle(${prod.id})" style="cursor:pointer;">
                <div class="product-info">
                    <span class="product-brand">${prod.marca}</span>
                    <h3 class="product-name" onclick="verDetalle(${prod.id})" style="cursor:pointer;">${prod.nombre}</h3>
                    <div class="product-pricing">
                        <span class="price-offer">S/. ${prod.precioOferta.toFixed(2)}</span>
                        <span class="price-normal">S/. ${prod.precioNormal.toFixed(2)}</span>
                    </div>
                    <div class="size-selector">
                        <label>Selecciona Talla:</label>
                        <select id="talla-${prod.id}">
                            ${opcionesTallas}
                        </select>
                    </div>
                    <button class="add-to-cart" onclick="agregarAlCarrito(${prod.id})">Añadir al Carrito</button>
                </div>
            </div>
        `;
    });
}

function verDetalle(id) {
    window.location.href = `producto.html?id=${id}`;
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
        talla: tallaElegida
    });

    guardarYActualizar();
    mostrarToast(`✓ Añadido: ${productoEncontrado.nombre} (${tallaElegida})`);
}

function guardarYActualizar() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarritoUI();
}

function actualizarCarritoUI() {
    const container = document.getElementById('cartItemsContainer');
    const countBadge = document.getElementById('cart-count');
    const totalText = document.getElementById('cartTotalText');

    if (countBadge) countBadge.innerText = carrito.length;
    if (!container || !totalText) return;

    if (carrito.length === 0) {
        container.innerHTML = `<p style="color: #777; text-align: center; margin-top: 10px;">Tu carrito está vacío</p>`;
        totalText.innerText = "S/. 0.00";
        return;
    }

    container.innerHTML = '';
    let total = 0;

    carrito.forEach((item, index) => {
        total += item.precio;
        container.innerHTML += `
            <div class="cart-item">
                <div>
                    <strong>${item.marca} - ${item.nombre}</strong><br>
                    <small>Talla: ${item.talla}</small>
                </div>
                <div style="text-align: right;">
                    <span>S/. ${item.precio.toFixed(2)}</span><br>
                    <button onclick="eliminarItem(${index})" style="background:none; border:none; color:red; cursor:pointer; font-size:11px;">Eliminar</button>
                </div>
            </div>
        `;
    });

    totalText.innerText = `S/. ${total.toFixed(2)}`;
}

function eliminarItem(index) {
    carrito.splice(index, 1);
    guardarYActualizar();
}

function finalizarCompraWhatsApp() {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
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
        alert("Por favor completa todos los datos de envío para continuar.");
        return;
    }

    let mensaje = `Hola, quiero confirmar un pedido en la web:\n\n`;
    mensaje += `👤 *Cliente:* ${nombre}\n`;
    mensaje += `📱 *Teléfono:* ${telefono}\n`;
    mensaje += `🏙️ *Ciudad:* ${ciudad}\n`;
    mensaje += `📍 *Dirección/Agencia:* ${direccion}\n\n`;
    mensaje += `🛍️ *Productos:* \n`;

    let total = 0;
    carrito.forEach((item, index) => {
        mensaje += `${index + 1}. *${item.marca}* - ${item.nombre} (Talla: ${item.talla}) - S/. ${item.precio.toFixed(2)}\n`;
        total += item.precio;
    });

    mensaje += `\n💰 *Total a pagar:* S/. ${total.toFixed(2)}\n`;
    mensaje += `💳 *Método de pago:* Yape / Plin / Transferencia bancaria.\n\nPor favor envíeme los números de cuenta para realizar el pago y adjuntar mi voucher.`;

    let numeroWhatsApp = "51978225778"; 
    let url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, '_blank');
}