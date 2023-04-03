import { Flex, Text, Button, useToast, Image, Box } from '@chakra-ui/react';
import { useAccount, useProvider, useSigner } from 'wagmi'
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
// Dev : The ABI json will be stored into /config/JO2024.json
import Contract from '../../backend/artifacts/contracts/JO2024.sol/JO2024.json';
import LogoConnect from 'components/LogoConnect'
import { contractAddress } from 'config/constants';

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
    setExchangeStateToken(await contract.exchangeState());
  }

  const mintJeton = async(type, number) => {
    try {
      const contract = new ethers.Contract(contractAddress, Contract.abi, signer);
      // type : Athletisme = 0 Aviron = 1 Escrime = 2 Basketball = 3 Boxe = 4
      let transaction = await contract.mint(type, number);
      transaction.wait();
      getDatas();
      toast({
        title: 'Félicitations !',
        description: "Vous avez bien minté votre jeton JO2024 !",
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
      toast({
        title: 'Félicitations !',
        description: "Vous avez bien demandé un échange de vos jeton JO2024 !",
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
      console.log("transaction : "+transaction);
      transaction.wait();
      toast({
        title: 'Félicitations !',
        description: "Vous avez bien trouvé un échange de vos jeton JO2024 !",
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
  const exchange = async() => {
    try {
      console.log("exchange");
      const contract = new ethers.Contract(contractAddress, Contract.abi, signer);
      let transaction = await contract.exchange();
      transaction.wait();
      toast({
        title: 'Félicitations !',
        description: "Vous avez bien echangé un échange de vos jeton JO2024 !",
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
      let transaction = await contract.exchangeClose(formAcadeeAddress);
      transaction.wait();
      toast({
        title: 'Félicitations !',
        description: "Vous avez bien fermé l'échange de vos jeton JO2024 !",
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
  const exchangeState = async() => {
    try {
      console.log("exchangeState");
      const contract = new ethers.Contract(contractAddress, Contract.abi, signer);
      let transaction = await contract.exchangeState();
      transaction.wait();
      toast({
        title: 'Félicitations !',
        description: "Vous avez bien recupéré l'état de l'échange!",
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
      <Flex justifyContent="center" alignItems="center" height="50vh">
        {(isConnected ? (
          <Flex direction="column">
            <Text align="center">Tu es connecté et tu peux collecter des jetons JO2024</Text>
            <Flex mt="2rem">
              <Box boxSize='215px'>
                <Image src='https://bafybeib2qiimyx64cuopeceksxbzcejwctofni4s33zsgoqunrk22dczye.ipfs.nftstorage.link' alt='Athletisme' />
                <Button onClick={() => mintJeton(0,1)}>Mint 1 Athletisme NFT ({nbMintedAthletisme})</Button>
                <Button onClick={() => exchangeStart(0,1,1)}>Start an exchange ({exchangeStateToken})</Button>
                <Button onClick={() => exchangeFound()}>Found an exchange</Button>
                <Button onClick={() => exchange()}>Validate an exchange</Button>
                <Button onClick={() => exchangeClose()}>Validate an exchange</Button>
              </Box>
              <Box boxSize='215px'>
                <Image src='https://bafybeia73py6bbe6ixw2qb7pt7mh7xy7zglcsdf7onpa5pvtwbu7s2tmza.ipfs.nftstorage.link' alt='Aviron' />
                <Button onClick={() => mintJeton(1,1)} ml="1rem">Mint 1 Aviron NFT ({nbMintedAviron})</Button>
                <Button onClick={() => exchangeStart(1,0,1)}>Start an exchange</Button>
                <Button onClick={() => exchangeFound()}>Found an exchange</Button>
                <Button onClick={() => exchange()}>Validate an exchange</Button>
                <Button onClick={() => exchangeClose()}>Validate an exchange</Button>
              </Box>               
              <Box boxSize='215px'>
                <Image src='https://bafybeiaxyqpah4wudwsgn2stqx7bwo5pikqdwlvgjogul7eqzpfdz4thn4.ipfs.nftstorage.link' alt='Escrime' />
                <Button onClick={() => mintJeton(2,1)} ml="1rem">Mint 1 Escrime NFT ({nbMintedEscrime})</Button>
              </Box>               
              <Box boxSize='215px'>
                <Image src='https://bafybeihmmfxyfmabv3y2xiiyixlmcwt7ypatplizjlv5zmqi5sfkltwiqm.ipfs.nftstorage.link' alt='Basketball' />
                <Button onClick={() => mintJeton(3,1)} ml="1rem">Mint 1 Basketball NFT ({nbMintedBasketball})</Button>
              </Box>               
              <Box boxSize='215px'>
                <Image src='https://bafybeib52dpfcgb4lhi2ggnopx7ot7eah4zv3tw7zp4hv3ip5yvtqspzhq.ipfs.nftstorage.link' alt='Boxe' />
                <Button onClick={() => mintJeton(4,1)} ml="1rem">Mint 1 Boxe NFT ({nbMintedBoxe})</Button>
              </Box>
            </Flex>
          </Flex>
        ) : (
          <Text>Merci de vous connecter avec votre Wallet sur votre navigateur.</Text>
        ))}
      </Flex>
    </>
  )
}
