import { Flex, Text } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function LogoConnect() {
    return (
        <Flex height="15vh" justifyContent="space-between" alignItems="center" p="2rem">
            <Text>
                Logo todo
            </Text>
            <ConnectButton />
        </Flex>
   )
}