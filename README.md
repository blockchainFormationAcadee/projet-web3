# Projet Web3

Dans ce repository vous trouverez tout d'abord une première partie pour la création d'une collection NFT ERC-1155.\
Par la suite vous allez découvrir le projet à travers un smart contrat d'échange de jeton.

## Partie 1

Création d'une collection NFT ERC-1155 dédiée au JO 2024 :

- Créarion d'un smart contrat spécifique.
- Utilisation de l'IA Midjourney pour créér des images.
- Utilisation de https://nft.storage pour héberger les images.
- Utilisation de https://nft.storage pour héberger les metadatas json.
- "mint" de la collection NFTs.

## Partie 2

Mise en place de l'échange de jetons

## Installation - pré-requis
- npm 8.1.0
- node v16.13.0
- yarn 1.22.19
  npm install --global yarn
- hardhat v2.13.0 
  yarn add --dev hardhat
- plugins : 
    - hardhat-etherscan : pour valider le contrat sur etherscan
      npm install --save-dev hardhat-etherscan
    - hardhat-gas-reporter : pour connaitre le montant des gaz lors de la création du contrat et des appels des fonctions
      npm install --save-dev hardhat-gas-reporter
    - solidity-coverage : pour connaitre la couverture de code par les tests
      npm install --save-dev solidity-coverage
    - hardhat-deploy : pour déployer facilement des contrats sur différents réseaux
      npm install --save-dev hardhat-deploy
- compilation
  npx hardhat compile
- lancement des tests + rapport gaz
  npx hardhat compile
- couverture de code (=> ./coverage/index.html)
  npx hardhat coverage

- Ajouter un fichier .env avec les paramètres renseignés :
    MUMBAI_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/[TODO]
    SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/[TODO]
    MAINNET_RPC_URL=https://[TODO]
    PRIVATE_KEY=[TODO]
    COINMARKETCAP_API_KEY=[TODO]
    ETHERSCAN_API_KEY=[TODO]

## Déploiement

- Déploiement sur le réseau Mumbai
  npx hardhat run --network mumbai
- Vérification Etherscan
  npx hardhat verify --network mumbai [adresse contrat sur Mumbai]
