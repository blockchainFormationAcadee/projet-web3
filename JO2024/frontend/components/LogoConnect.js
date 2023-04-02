import { Flex, Image } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function LogoConnect() {
    return (
        <Flex height="15vh" justifyContent="space-between" alignItems="center" p="2rem">
                <Image src='/logo.ico' boxSize='100px' alt='Logo' />
            <ConnectButton />
        </Flex>
   )
}