// Fonction pour récupérer les paramètres de l'URL
function getUrlParams() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return {
        conclusion: urlParams.get('conclusion'),
        bact: urlParams.get('bact'),
        pc: urlParams.get('pc')
    };
}

// Fonction pour afficher les résultats sur la page results.html
function displayResults() {
    const params = getUrlParams();

    // Afficher les résultats si les paramètres sont disponibles
    const resultatsDiv = document.querySelector('.resultats');
    if (resultatsDiv) {
        resultatsDiv.innerHTML = `
            <div class="ligne">
                <span class="cp">Conclusion:</span>
                <span class="ville">${params.conclusion}</span>
            </div>
            <div class="ligne">
                <span class="cp">Conformité bactériologique:</span>
                <span class="ville">${params.bact}</span>
            </div>
            <div class="ligne">
                <span class="cp">Conformité physique et chimique:</span>
                <span class="ville">${params.pc}</span>
            </div>
        `;
    }
}

// Fonction pour envoyer la requête à l'API et rediriger vers la page results.html
function sendRequest(communeCode) {
    const apiUrl = `https://hubeau.eaufrance.fr/api/v1/qualite_eau_potable/resultats_dis?code_commune=${communeCode}&fields=conclusion_conformite_prelevement,conformite_limites_bact_prelevement,conformite_limites_pc_prelevement&sort=desc&page=1&size=1`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const queryString = `?conclusion=${data.conclusion_conformite_prelevement}&bact=${data.conformite_limites_bact_prelevement}&pc=${data.conformite_limites_pc_prelevement}`;
            window.location.href = `results.html${queryString}`;
        })
        .catch(error => console.error('Erreur lors de la récupération des données :', error));
}

// Attacher l'événement submit au formulaire de recherche
const searchForm = document.getElementById("searchForm");
if (searchForm && window.location.pathname !== "/results.html") {
    searchForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Empêcher le rechargement de la page
        const communeCode = document.querySelector('input[name="q"]').value;
        sendRequest(communeCode); // Envoyer la requête à l'API
    });
} else {
    displayResults(); // Afficher les résultats sur la page results.html
}
