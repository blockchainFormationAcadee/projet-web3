import { Flex, Text, Button, useToast, Image, Box } from '@chakra-ui/react';
import { useAccount, useProvider, useSigner } from 'wagmi'
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';

export default function ExchangeToken() {
    const { address, isConnected } = useAccount();
    const provider = useProvider();
    const { data: signer } = useSigner();
    return (
        <Flex height="15vh" justifyContent="space-between" alignItems="center" p="2rem">

            
            {(isConnected ? (
                <Box boxSize='100%' margin="100">
                <Text align="center">Echange de jetons sportif.</Text>
                </Box>
            
            ) : (
                <Box boxSize='100%' margin="100">
                    <Text align="center">Pas connecté</Text>
                </Box>          
            ))}
        </Flex>
   )
}