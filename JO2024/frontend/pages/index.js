import { Flex, Text, Button, useToast, Image, Box } from '@chakra-ui/react';
import { useAccount, useProvider, useSigner } from 'wagmi'
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
// Dev : In production the ABI json will be stored into /config/JO2024.json
import Contract from '../../backend/artifacts/contracts/JO2024.sol/JO2024.json';
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

  const mint = async(type, amount) => {
    try {
      const contract = new ethers.Contract(contractAddress, Contract.abi, signer);
      // type : Athletisme = 0 Aviron = 1 Escrime = 2 Basketball = 3 Boxe = 4
      let transaction = await contract.mint(type, amount);
      transaction.wait();
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
      <Flex>
        {(isConnected ? (

          <Flex direction="row">
            <Text align="center">Mes quêtes</Text>
            <Flex mt="2rem">
              <Box boxSize='100%'>
                <Text align="center">Quel est le record du monde 100m</Text>
                <Button onClick={() => mint(0,50)}>8s58s</Button><br/><br/>
                <Button onClick={() => mint(0,50)}>9s58s</Button><br/><br/>
                <Button onClick={() => mint(0,50)}>10s58</Button><br/><br/>
              </Box>               
            </Flex>
          </Flex>
        ) : (
          <Box boxSize='100%' margin="100">
              <Text align="center">Plateform de collection NFTs des Jeux Olympiques Paris 2024.<br/><br/>
                                   Collectionne des JO d'un sport que tu aimes en complétant des quêtes.<br/>
                                   Echange tes JO d'un sport contre d'autres JO d'un autre sport.<br/>
                                   Transforme tes JO en NFT Unique et gagne des places pour aller voir les JO.<br/><br/>
                                   Merci de vous connecter avec le bouton 'Connexion JO2024'.</Text>
          </Box>          
        ))}
      </Flex>
    </>
  )
}
