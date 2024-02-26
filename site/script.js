function updateDateTime() {
    const now = new Date();
    const dateString = now.toLocaleDateString('fr-FR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    const timeString = now.toLocaleTimeString('fr-FR');
    document.getElementById('date-time').textContent = `Nous sommes le ${dateString} et il est ${timeString}.`;
}

// Mise à jour de la date et de l'heure toutes les secondes
setInterval(updateDateTime, 1000);
