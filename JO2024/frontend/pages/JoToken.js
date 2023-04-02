import { Flex, Text, Button, useToast, Image, Box } from '@chakra-ui/react';

export default function JoToken() {
    return (
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
   )
}