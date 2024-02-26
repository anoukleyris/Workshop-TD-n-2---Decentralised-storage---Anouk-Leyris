const core = require('@actions/core');
const pinataSDK = require('@pinata/sdk');
const fsPath = require('path');

// Récupération des entrées
const path = core.getInput('path');
const pinName = core.getInput('pin-name');
const pinataApiKey = core.getInput('pinata-api-key');
const pinataSecretApiKey = core.getInput('pinata-secret-api-key');
const verbose = core.getInput('verbose');
const removeOld = core.getInput('remove-old');

// Récupération du répertoire de travail
const workspace = process.env.GITHUB_WORKSPACE.toString();

// Si le chemin est absolu, l'utiliser tel quel
let sourcePath = path;
if(!fsPath.isAbsolute(path)) {
    // Sinon, combiner avec le répertoire de travail
    sourcePath = fsPath.join(workspace, path);
}

// Connexion à Pinata
const pinata = pinataSDK(pinataApiKey, pinataSecretApiKey);

// Options pour Pinata
const options = {
    pinataMetadata: {
        name: pinName,
    },
    pinataOptions: {
        cidVersion: 0,
        wrapWithDirectory: false
    }
};

// Fonction pour retirer un hash précédent
function unpinHash(hashToUnpin) {
	pinata.unpin(hashToUnpin).then((result) => {
        if(verbose) {
            console.log(result);
        }
    }).catch((err) => {
        console.log(err);
    });
}

// Fonction pour retirer les anciens pins
function removeOldPinsSaving(hash) {
	const metadataFilter = {
		name: pinName,
	};
	const filters = {
		status: "pinned",
		pageLimit: 1000,
		pageOffset: 0,
		metadata: metadataFilter,
	};
	pinata.pinList(filters).then((result) => {
        if(verbose) {
            console.log(result);
        }
		result.rows.forEach((element) => {
			if (element.ipfs_pin_hash != hash) {
				unpinHash(element.ipfs_pin_hash);
			}
		});
	}).catch((err) => {
        console.log(err);
    });
}

// Déploiement sur IPFS via Pinata
pinata.pinFromFS(sourcePath, options).then((result) => {
    if(verbose) {
        console.log(result);
        console.log("HASH: " + result.IpfsHash);
    }

    // Retirer les anciens pins si nécessaire
    if(removeOld) {
        removeOldPinsSaving(result.IpfsHash);
    }

    // Sortie du hash
    core.setOutput("hash", result.IpfsHash);
}).catch((err) => {
    console.log(err);
});
