import Head from 'next/head'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Flex, Text, Button, useToast } from '@chakra-ui/react';
import { useAccount, useProvider, useSigner } from 'wagmi'
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import Contract from '../../backend/artifacts/contracts/JO2024.sol/JO2024.json'

export default function Home() {

  const { address, isConnected } = useAccount()
  const provider = useProvider()
  const { data: signer } = useSigner()
  const contractAddress = "0x4f9B3c7726AAE585102df59dA2FDAB17EDbB81eB"
  const ownerAddress = "0x005D71CA579843a1C3EeFEd02E5909CF77976761"
  const toast = useToast()
  const [nbMintedAthletisme, setNbMintedAthletisme] = useState(null)
  const [nbMintedAviron, setNbMintedAviron] = useState(null)
  const [nbMintedEscrime, setNbMintedEscrime] = useState(null)
  const [nbMintedBasketball, setNbMintedBasketball] = useState(null)
  const [nbMintedBoxe, setNbMintedBoxe] = useState(null)
  var tabNbMinted = [];
  useEffect(() => {
    if(isConnected) {
      getDatas()
    }
  }, [address])

  const getDatas = async() => {
    const contract = new ethers.Contract(contractAddress, Contract.abi, provider);
    let nbMinted = await contract.balanceOf(ownerAddress, 0)
    setNbMintedAthletisme(nbMinted.toString())
    nbMinted = await contract.balanceOf(ownerAddress, 1)
    setNbMintedAviron(nbMinted.toString())

    for(var i= 0; i < 5; i++)
    {
      tabNbMinted[i] = await contract.balanceOf(ownerAddress, i);
    }
  }

  const mintNFT = async(type, number) => {
    try {
      const contract = new ethers.Contract(contractAddress, Contract.abi, signer);
      // type : Athletisme = 0 Aviron = 1 Escrime = 2 Basketball = 3 Boxe = 4
      let transaction = await contract.mintNFT(type, number);
      transaction.wait()
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

  return (
    <>
      <Head>
        <title>JO2024 NFT App</title>
        <meta name="description" content="JO2024 NFT Application FrontEnd" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex height="15vh" justifyContent="space-between" alignItems="center" p="2rem">
        <Text>
          Logo todo
        </Text>
        <ConnectButton />
      </Flex>
      <Flex justifyContent="center" alignItems="center" height="85vh">
        {(isConnected ? (
          <Flex direction="column">
            <Text align="center">Tu es connecté et tu peux minter un NFT JO2024</Text>
            <Flex mt="2rem">
              <Button onClick={() => mintNFT(0,1)}>Mint 1 Athletisme NFT ({nbMintedAthletisme})</Button>
              <Button onClick={() => mintNFT(1,1)} ml="1rem">Mint 1 Aviron NFT ({nbMintedAviron})</Button>
              <Button onClick={() => mintNFT(2,1)} ml="1rem">Mint 1 Escrime NFT ({nbMintedAthletisme})</Button>
              <Button onClick={() => mintNFT(3,1)} ml="1rem">Mint 1 Basketball NFT ({nbMintedAthletisme})</Button>
              <Button onClick={() => mintNFT(4,1)} ml="1rem">Mint 1 Boxe NFT ({tabNbMinted[4]})</Button>
            </Flex>
          </Flex>
        ) : (
          <Text>Merci de vous connecter avec votre Wallet sur votre navigateur.</Text>
        ))}
      </Flex>
    </>
  )
}
