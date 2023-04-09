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
                    < ActiveLink children="Accueil" href="/" />
                    < ActiveLink children="Quêtes" href="/quetes" />
                    < ActiveLink children="Mes JO" href="/MyJo2024" />
                    < ActiveLink children="Exchange" href="/ExchangeToken" />
                    < ActiveLink children="Transforme" href="/ExchangeToken" />
                </Flex>
            ) : (
                < ActiveLink children="Home" href="/" />
            ))}
            <ConnectButton label="Connexion JO2024" showBalance={false}/>
        </Flex>
   )
}