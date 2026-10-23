let listaProductos = [];
let listaFiltrada = [];
let ordenAscendente = true;

// 1. Función para obtener los productos desde la WebAPI REST
function obtenerProductos() {
    const url = 'https://fakestoreapi.com/products';

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la petición de la API');
            }
            return response.json();
        })
        .then(data => {
            listaProductos = data;
            filtrarCat(); // Aplica filtros e imprime la tabla
        })
        .catch(error => {
            console.error('Error al obtener datos:', error);
            document.getElementById('cuerpoTabla').innerHTML = 
                `<tr><td colspan="6" style="color:red;">Error al cargar productos desde la API.</td></tr>`;
        });
}

// 2. Función para renderizar la tabla con las columnas Description y Rating
function renderizarTabla(productos) {
    const cuerpo = document.getElementById('cuerpoTabla');
    
    if (productos.length === 0) {
        cuerpo.innerHTML = `<tr><td colspan="6" class="empty-msg">No hay productos para mostrar en las categorías seleccionadas.</td></tr>`;
        return;
    }

    let filasHTML = '';

    productos.forEach(prod => {
        // Extracción de rate y count desde la propiedad rating de la API
        const rate = prod.rating ? prod.rating.rate : 'N/A';
        const count = prod.rating ? prod.rating.count : 0;

        filasHTML += `
            <tr>
                <td>${prod.id}</td>
                <td>
                    <img src="${prod.image}" alt="${prod.title}" class="product-img" onclick="abrirModal('${prod.image}')">
                </td>
                <td class="price-cell">$${prod.price.toFixed(2)}</td>
                <td class="title-cell">${prod.title}</td>
                <td class="desc-cell">${prod.description}</td>
                <td>
                    <span class="rating-badge">
                        ⭐ ${rate} <small style="color:#666;">(${count} disp.)</small>
                    </span>
                </td>
            </tr>
        `;
    });

    cuerpo.innerHTML = filasHTML;
}

// 3. Función para filtrar por Categoría
function filtrarCat() {
    const catElect = document.getElementById('catElectronics').checked;
    const catJewel = document.getElementById('catJewelery').checked;
    const catMen = document.getElementById('catMen').checked;
    const catWomen = document.getElementById('catWomen').checked;

    listaFiltrada = listaProductos.filter(prod => {
        if (prod.category === "electronics" && catElect) return true;
        if (prod.category === "jewelery" && catJewel) return true;
        if (prod.category === "men's clothing" && catMen) return true;
        if (prod.category === "women's clothing" && catWomen) return true;
        return false;
    });

    renderizarTabla(listaFiltrada);
}

// 4. Función para ordenar por Precio (Ascendente / Descendente)
function ordenarPrecio() {
    if (listaFiltrada.length === 0) return;

    listaFiltrada.sort((a, b) => {
        return ordenAscendente ? a.price - b.price : b.price - a.price;
    });

    ordenAscendente = !ordenAscendente; // Alterna el sentido del ordenamiento
    renderizarTabla(listaFiltrada);
}

// 5. Funciones para ver la imagen ampliada en un Modal
function abrirModal(urlImagen) {
    const modal = document.getElementById('modalImagen');
    const imgModal = document.getElementById('imgModal');
    modal.style.display = 'flex';
    imgModal.src = urlImagen;
}

function cerrarModal() {
    document.getElementById('modalImagen').style.display = 'none';
}