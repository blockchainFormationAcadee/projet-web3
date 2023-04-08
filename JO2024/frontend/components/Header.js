import { Flex, Image } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import ActiveLink from 'components/ActiveLink'
import { useAccount } from 'wagmi'

export default function Header() {
    const { isConnected } = useAccount()
    return (
        <Flex height="15vh" justifyContent="space-between" alignItems="center" p="2rem">
            <Image src='/logo.ico' boxSize='100px' alt='Logo' />
            {(isConnected ? (
                <Flex>
                    < ActiveLink children="Home" href="/" />
                    < ActiveLink children="My Collection" href="/ExchangeToken" />
                    < ActiveLink children="Mint" href="/ExchangeToken" />
                    < ActiveLink children="Exchange NFT" href="/ExchangeToken" />
                    < ActiveLink children="Transform NFT" href="/ExchangeToken" />
                </Flex>
            ) : (
                < ActiveLink children="Home" href="/" />
            ))}
            <ConnectButton label="Connexion JO2024" showBalance={false}/>
        </Flex>
   )
}