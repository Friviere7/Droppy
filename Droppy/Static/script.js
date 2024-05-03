// Fonction pour obtenir une description de la conformité
function getDescriptionConformite(valeur) {
    switch (valeur) {
        case "C":
            return "Conforme ✅";
        case "N":
            return "Non conforme ❌";
        case "D":
            return "Conforme avec dérogation 🆗";
        case "S":
            return "Non renseigné 💬";
        default:
            return "Vide";
    }
}

// Fonction pour envoyer la requête à l'API et afficher les résultats sur la page index.html
function sendRequestAndDisplayResults(nomCommune) {
    const apiUrl = `https://hubeau.eaufrance.fr/api/v1/qualite_eau_potable/resultats_dis?nom_commune=${nomCommune}&fields=conclusion_conformite_prelevement,conformite_limites_bact_prelevement,conformite_limites_pc_prelevement&sort=desc&page=1&size=1`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Vérifier si des données sont disponibles pour la commune spécifiée
            if (data && data.data && data.data.length > 0) {
                const communeData = data.data[0]; // Prendre le premier enregistrement
                const resultatsDiv = document.querySelector('.resultats');
                if (resultatsDiv) {
                    resultatsDiv.innerHTML = `
                        <div class="ligne">
                            <span class="cp">Conclusion:</span>
                            <span class="ville">${communeData.conclusion_conformite_prelevement}</span>
                        </div>
                        <div class="ligne">
                            <span class="cp">Conformité bactériologique:</span>
                            <span class="ville">${getDescriptionConformite(communeData.conformite_limites_bact_prelevement)}</span>
                        </div>
                        <div class="ligne">
                            <span class="cp">Conformité physique et chimique:</span>
                            <span class="ville">${getDescriptionConformite(communeData.conformite_limites_pc_prelevement)}</span>
                        </div>
                    `;
                }
            } else {
                console.log("Aucune donnée disponible pour la commune spécifiée.");
            }
        })
        .catch(error => console.error('Erreur lors de la récupération des données :', error));
}

// Attacher l'événement submit au formulaire de recherche dans index.html
const searchForm = document.getElementById("searchForm");
if (searchForm) {
    searchForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Empêcher le rechargement de la page
        const nomCommune = document.querySelector('input[name="q"]').value.trim();

        if (nomCommune === "") {
            alert("Veuillez saisir le nom d'une commune.");
            return; // Bloquer la soumission du formulaire si le champ est vide
        }

        console.log("Form submitted with commune name:", nomCommune);
        sendRequestAndDisplayResults(nomCommune); // Envoyer la requête à l'API et afficher les résultats
    });
}
