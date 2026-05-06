// URL inicial
const url_api = "https://rickandmortyapi.com/api/character";

/**
 * requestData
 * Hace petición al API
 * @param {string} url
 */
async function requestData(url) {

    const response = await axios.get(url);

    // Axios guarda los datos en response.data
    let data = response.data;

    // Actualizar número de página
    updatePageNumber(url);

    // Guardar URLs en botones
    updateButtons(data.info);

    // Renderizar personajes
    renderHtml(data);
}

/**
 * updatePageNumber
 * Actualiza número de página
 * @param {string} url
 */
function updatePageNumber(url) {

    let page = 1;

    // Buscar parámetro ?page=
    if (url.includes("page=")) {

        let params = new URLSearchParams(url.split("?")[1]);

        page = params.get("page");
    }

    document.getElementById("pageNumber").innerText =
        `Página ${page}`;
}

/**
 * updateButtons
 * Actualiza data-next y data-prev
 * @param {object} info
 */
function updateButtons(info) {

    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");

    // Guardar siguiente página
    nextBtn.setAttribute(
        "data-next",
        (info.next == null) ? "" : info.next
    );

    // Guardar página anterior
    prevBtn.setAttribute(
        "data-prev",
        (info.prev == null) ? "" : info.prev
    );

    // Deshabilitar si no hay páginas
    nextBtn.disabled = (info.next == null);
    prevBtn.disabled = (info.prev == null);
}

/**
 * nextPage
 * Ir a siguiente página
 */
function nextPage() {

    const nextBtn = document.getElementById("nextBtn");

    const next = nextBtn.getAttribute("data-next");

    if (next != "") {
        requestData(next);
    }
}

/**
 * prevPage
 * Ir a página anterior
 */
function prevPage() {

    const prevBtn = document.getElementById("prevBtn");

    const prev = prevBtn.getAttribute("data-prev");

    if (prev != "") {
        requestData(prev);
    }
}

/**
 * renderHtml
 * Renderiza personajes
 * @param {object} data
 */
function renderHtml(data) {

    let element = document.getElementById("character");

    // Limpiar contenido anterior
    element.innerHTML = "";

    let resultCount = data.results.length;

    for (let index = 0; index < resultCount; index++) {

        let character = data.results[index];

        element.innerHTML += `
            <li>
                <img src="${character.image}" alt="${character.name}">
                <h2>${character.name}</h2>
                <span>${character.gender}</span>
            </li>
        `;
    }
}

// Primera carga
requestData(url_api);