const { execSync } = require('child_process');

// Cette fonction exécute une commande shell et retourne la sortie
function runCommand(command) {
    try {
        return execSync(command).toString().trim();
    } catch (error) {
        console.error(`Erreur lors de l'exécution de la commande : ${command}`);
        console.error(error.stderr.toString().trim());
        process.exit(1);
    }
}

// Fonction principale qui effectue le déploiement sur IPFS via Pinata
function deployToIPFS(pinName, path, pinataApiKey, pinataSecretApiKey, removeOld) {
    console.log('Déploiement sur IPFS via Pinata');

    // Logique pour épingler le fichier ou le répertoire à Pinata
    // Exemple : Utilisation de la commande `ipfs add` pour ajouter le contenu à IPFS
    const command = `ipfs add -r ${path}`;
    const result = runCommand(command);

    console.log('Résultat de l\'ajout sur IPFS :');
    console.log(result);

    // Vous pouvez également utiliser le SDK Pinata pour interagir avec l'API Pinata
    // Exemple :
    // const pinata = require('@pinata/sdk')(pinataApiKey, pinataSecretApiKey);
    // pinata.pin.addFsDirectory(path, { wrapWithDirectory: true })
    //     .then((result) => {
    //         console.log('Résultat de l\'ajout sur Pinata :');
    //         console.log(result);
    //     })
    //     .catch((error) => {
    //         console.error('Erreur lors de l\'ajout sur Pinata :', error);
    //         process.exit(1);
    //     });
}

// Exemple d'utilisation de la fonction de déploiement
deployToIPFS('Mon site', './build', 'votreApiKey', 'votreSecretApiKey', false);
