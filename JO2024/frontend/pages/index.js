import { Flex, Text, Button, useToast, Image, Box } from '@chakra-ui/react';
import { useAccount, useProvider, useSigner } from 'wagmi'
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import Contract from '../../backend/artifacts/contracts/JO2024.sol/JO2024.json';
import LogoConnect from 'pages/components/LogoConnect'

export default function Home() {

  const { address, isConnected } = useAccount()
  const provider = useProvider()
  const { data: signer } = useSigner()
  // Mumbai const contractAddress = "0xf1af432A1dF4B56e0BB40335512BD58E7cCF58E0"
  const contractAddress = "0xa38B2C7EA4E6B8fF62b95bB7C13E69252777fccB"
  //const contractAddress = "0xA209366aee22F05D3CB386dB52eCcB36b5AC571E"
  // FormAcadee 2
  // const ownerAddress = "0x7Cd33a833dC720Acc8d17bC17edC41cc526FebB2"
  // FormAcadee
  const ownerAddress = "0x005D71CA579843a1C3EeFEd02E5909CF77976761"
  const toast = useToast()
  const [nbMintedAthletisme, setNbMintedAthletisme] = useState(null)
  const [nbMintedAviron, setNbMintedAviron] = useState(null)
  const [nbMintedEscrime, setNbMintedEscrime] = useState(null)
  const [nbMintedBasketball, setNbMintedBasketball] = useState(null)
  const [nbMintedBoxe, setNbMintedBoxe] = useState(null)

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
  }

  const mintJeton = async(type, number) => {
    try {
      const contract = new ethers.Contract(contractAddress, Contract.abi, signer);
      // type : Athletisme = 0 Aviron = 1 Escrime = 2 Basketball = 3 Boxe = 4
      let transaction = await contract.mintJeton(type, number);
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
      let transaction = await contract.exchangeFound(ownerAddress);
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
      let transaction = await contract.exchangeClose(ownerAddress);
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
  return (
    <>
      < LogoConnect />
      <Flex justifyContent="center" alignItems="center" height="85vh">
        {(isConnected ? (
          <Flex direction="column">
            <Text align="center">Tu es connecté et tu peux minter un NFT JO2024</Text>
            <Flex mt="2rem">
              <Box boxSize='215px'>
                <Image src='https://bafybeib2qiimyx64cuopeceksxbzcejwctofni4s33zsgoqunrk22dczye.ipfs.nftstorage.link' alt='Athletisme' />
                <Button onClick={() => mintJeton(0,1)}>Mint 1 Athletisme NFT ({nbMintedAthletisme})</Button>
                <Button onClick={() => exchangeStart(0,1,1)}>Start a exchange Athletisme token </Button>
                <Button onClick={() => exchangeFound()}>Found a exchange Athletisme token </Button>
                <Button onClick={() => exchange()}>Validate a exchange Athletisme token </Button>
                <Button onClick={() => exchangeClose()}>Validate a exchange Athletisme token </Button>
              </Box>
              <Box boxSize='215px'>
                <Image src='https://bafybeia73py6bbe6ixw2qb7pt7mh7xy7zglcsdf7onpa5pvtwbu7s2tmza.ipfs.nftstorage.link' alt='Aviron' />
                <Button onClick={() => mintJeton(1,1)} ml="1rem">Mint 1 Aviron NFT ({nbMintedAviron})</Button>
                <Button onClick={() => exchangeStart(1,0,1)}>Start a exchange Aviron token </Button>
                <Button onClick={() => exchangeFound()}>Found a exchange Aviron token </Button>
                <Button onClick={() => exchange()}>Validate a exchange Aviron token </Button>
                <Button onClick={() => exchangeClose()}>Validate a exchange Aviron token </Button>
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
