// URL inicial
const url_api = "https://rickandmortyapi.com/api/character";

// Control de requests simultáneos
let isLoading = false;

// Guardar personajes originales
let originalCharacters = [];

/**
 * requestData
 * Hace petición al API
 * @param {string} url
 */
async function requestData(url) {

    // Evitar múltiples requests
    if (isLoading) {
        return;
    }

    // Bloquear requests
    isLoading = true;

    const response = await axios.get(url);

    // Axios guarda la data en response.data
    let data = response.data;

    // Guardar personajes originales
    originalCharacters = data.results;

    // Reiniciar filtro
    document.getElementById("genderFilter").value = "all";

    // Actualizar número de página
    updatePageNumber(url);

    // Actualizar botones
    updateButtons(data.info);

    // Renderizar personajes
    renderHtml(originalCharacters);

    // Liberar bloqueo
    isLoading = false;
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

    // Deshabilitar botones
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
 * filterCharacters
 * Filtra personajes por género
 */
function filterCharacters() {

    const filterValue =
        document.getElementById("genderFilter").value;

    // Mostrar todos
    if (filterValue == "all") {

        renderHtml(originalCharacters);

        return;
    }

    // Filtrar personajes
    let filteredCharacters =
        originalCharacters.filter(function(character) {

            return character.gender == filterValue;
        });

    renderHtml(filteredCharacters);
}

/**
 * renderHtml
 * Renderiza personajes
 * @param {array} characters
 */
function renderHtml(characters) {

    let element = document.getElementById("character");

    // Variable para guardar HTML
    let template = "";

    let resultCount = characters.length;

    for (let index = 0; index < resultCount; index++) {

        let character = characters[index];

        template += `
            <li>
                <img src="${character.image}" alt="${character.name}">
                <h2>${character.name}</h2>
                <span>${character.gender}</span>
            </li>
        `;
    }

    // Reemplazar contenido completo
    element.innerHTML = template;
}

// Primera carga
requestData(url_api);