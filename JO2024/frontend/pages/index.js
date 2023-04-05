import { Flex, Text, Button, useToast, Image, Box } from '@chakra-ui/react';
import { useAccount, useProvider, useSigner } from 'wagmi'
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
// Dev : In production the ABI json will be stored into /config/JO2024.json
import Contract from '../../backend/artifacts/contracts/JO2024.sol/JO2024.json';
import LogoConnect from 'components/LogoConnect'
import { formAcadeeAddress, contractAddress } from 'config/constants';

export default function Home() {

  const { address, isConnected } = useAccount()
  const provider = useProvider()
  const { data: signer } = useSigner()
  const toast = useToast()
  const [nbMintedAthletisme, setNbMintedAthletisme] = useState(null)
  const [nbMintedAviron, setNbMintedAviron] = useState(null)
  const [nbMintedEscrime, setNbMintedEscrime] = useState(null)
  const [nbMintedBasketball, setNbMintedBasketball] = useState(null)
  const [nbMintedBoxe, setNbMintedBoxe] = useState(null)
  const [uniqueAthletisme, setUniqueAthletisme] = useState(null)
  const [uniqueAviron, setUniqueAviron] = useState(null)
  const [uniqueEscrime, setUniqueEscrime] = useState(null)
  const [uniqueBasketball, setUniqueBasketball] = useState(null)
  const [uniqueBoxe, setUniqueBoxe] = useState(null)
  const [exchangeStateToken, setExchangeStateToken] = useState(null)

  useEffect(() => {
    if(isConnected) {
      getDatas()
    }
  }, [address])

  const getDatas = async() => {
    const contract = new ethers.Contract(contractAddress, Contract.abi, provider);
    let nbMinted = await contract.balanceOf(address, 0);
    setNbMintedAthletisme(nbMinted.toString());
    nbMinted = await contract.balanceOf(address, 1);
    setNbMintedAviron(nbMinted.toString());
    nbMinted = await contract.balanceOf(address, 2);
    setNbMintedEscrime(nbMinted.toString());
    nbMinted = await contract.balanceOf(address, 3);
    setNbMintedBasketball(nbMinted.toString());
    nbMinted = await contract.balanceOf(address, 4);
    setNbMintedBoxe(nbMinted.toString());
    nbMinted = await contract.balanceOf(address, 5);
    setUniqueAthletisme(nbMinted.toString());
    nbMinted = await contract.balanceOf(address, 6);
    setUniqueAviron(nbMinted.toString());
    nbMinted = await contract.balanceOf(address, 7);
    setUniqueEscrime(nbMinted.toString());
    nbMinted = await contract.balanceOf(address, 8);
    setUniqueBasketball(nbMinted.toString());
    nbMinted = await contract.balanceOf(address, 9);
    setUniqueBoxe(nbMinted.toString());
    let stateToken = await contract.exchangeState();
    setExchangeStateToken(stateToken.toString());
  }

  const mint = async(type, amount) => {
    try {
      const contract = new ethers.Contract(contractAddress, Contract.abi, signer);
      // type : Athletisme = 0 Aviron = 1 Escrime = 2 Basketball = 3 Boxe = 4
      let transaction = await contract.mint(type, amount);
      transaction.wait();
      getDatas();
      toast({
        title: 'Félicitations !',
        description: "Vous avez bien minté votre NFT JO2024 !",
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    }
    catch {
      toast({
        title: 'Erreur !',
        description: "Une erreur est survenue",
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }
  const exchangeStart = async(typeFrom, typeTo, amount) => {
    try {
      console.log("exchangeStart typeFrom= "+typeFrom+" typeTo= "+typeTo+" typeTo= "+amount);
      const contract = new ethers.Contract(contractAddress, Contract.abi, signer);
      let transaction = await contract.exchangeStart(typeFrom, typeTo, amount);
      transaction.wait();
      let stateToken = await contract.exchangeState();
      setExchangeStateToken(stateToken.toString());
      toast({
        title: 'Félicitations !',
        description: "Vous avez bien demandé un échange de vos NFT JO2024 !",
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    }
    catch {
      toast({
        title: 'Erreur !',
        description: "Une erreur est survenue",
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }
  const exchangeFound = async() => {
    try {
      console.log("exchangeFound");
      const contract = new ethers.Contract(contractAddress, Contract.abi, signer);
      let transaction = await contract.exchangeFound(formAcadeeAddress);
      transaction.wait();
      getDatas();
      toast({
        title: 'Félicitations !',
        description: "Vous avez bien trouvé un échange de vos NFT JO2024 !",
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    }
    catch {
      toast({
        title: 'Erreur !',
        description: "Une erreur est survenue",
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }
  const exchangeClose = async() => {
    try {
      console.log("exchangeClose");
      const contract = new ethers.Contract(contractAddress, Contract.abi, signer);
      let transaction = await contract.exchangeClose();
      transaction.wait();
      let stateToken = await contract.exchangeState();
      setExchangeStateToken(stateToken.toString());
      toast({
        title: 'Félicitations !',
        description: "Vous avez bien fermé l'échange de vos NFT JO2024 !",
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    }
    catch {
      toast({
        title: 'Erreur !',
        description: "Une erreur est survenue",
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }
  const burn = async(type) => {
    try {
      console.log("burn type= "+type);
      const contract = new ethers.Contract(contractAddress, Contract.abi, signer);
      let transaction = await contract.burn(type);
      transaction.wait();
      getDatas();
      toast({
        title: 'Félicitations !',
        description: "Vous avez bien réalisé votre conversion !",
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    }
    catch {
      toast({
        title: 'Erreur !',
        description: "Une erreur est survenue",
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }
  return (
    <>
      < LogoConnect />
      <Flex>
        {(isConnected ? (
          <Flex direction="column">
            <Text align="center">Tu es connecté et tu peux collecter des NFTs JO2024</Text>
            <Flex mt="2rem">
              <Box boxSize='25%'>
                <Image src='https://bafybeib2qiimyx64cuopeceksxbzcejwctofni4s33zsgoqunrk22dczye.ipfs.nftstorage.link' alt='Athletisme' />
                <Button onClick={() => mint(0,50)}>Mint 50 Athletisme NFT ({nbMintedAthletisme})</Button><br/><br/>
                <Button onClick={() => exchangeStart(0,1,50)}>Start an exchange (50) State={exchangeStateToken}</Button><br/>
                <Button onClick={() => exchangeClose()}>Close an exchange</Button>
              </Box>
              <Box boxSize='25%'>
                <Image src='https://bafybeia73py6bbe6ixw2qb7pt7mh7xy7zglcsdf7onpa5pvtwbu7s2tmza.ipfs.nftstorage.link' alt='Aviron' />
                <Button onClick={() => mint(1,60)} ml="1rem">Mint 60 Aviron NFT ({nbMintedAviron})</Button><br/><br/>
                <Button onClick={() => exchangeFound()}>Exchange</Button><br/><br/><br/>
                <Button onClick={() => burn(1)}>Convertir 100 en Unique</Button>
                <Text align="center">{uniqueAviron} unique Aviron</Text>
              </Box>               
              <Box boxSize='25%'>
                <Image src='https://bafybeiaxyqpah4wudwsgn2stqx7bwo5pikqdwlvgjogul7eqzpfdz4thn4.ipfs.nftstorage.link' alt='Escrime' />
                <Button onClick={() => mint(2,70)} ml="1rem">Mint 70 Escrime NFT ({nbMintedEscrime})</Button>
              </Box>               
              <Box boxSize='25%'>
                <Image src='https://bafybeihmmfxyfmabv3y2xiiyixlmcwt7ypatplizjlv5zmqi5sfkltwiqm.ipfs.nftstorage.link' alt='Basketball' />
                <Button onClick={() => mint(3,80)} ml="1rem">Mint 80 Basketball NFT ({nbMintedBasketball})</Button>
              </Box>               
              <Box boxSize='25%'>
                <Image src='https://bafybeib52dpfcgb4lhi2ggnopx7ot7eah4zv3tw7zp4hv3ip5yvtqspzhq.ipfs.nftstorage.link' alt='Boxe' />
                <Button onClick={() => mint(4,100)} ml="1rem">Mint 100 Boxe NFT ({nbMintedBoxe})</Button>
              </Box>
            </Flex>
          </Flex>
        ) : (
          <Box boxSize='100%' margin="100">
              <Text align="center">Plateform de collection NFTs des Jeux Olympiques Paris 2024.<br/>
                                   Collectionne, échange et gagne des NFTs uniques.<br/>
                                   Merci de vous connecter avec le bouton 'Connect Wallet'.</Text>
          </Box>          
        ))}
      </Flex>
    </>
  )
}
