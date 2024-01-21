'use client';

import {
  Flex,
  Box,
  Text,
  HStack,
  NumberInput,
  NumberInputField,
  Button,
  SimpleGrid
} from '@chakra-ui/react';
import { useAccount, useNetwork } from 'wagmi';
import { useState } from 'react';

import { BalanceDisplay } from './BalanceDisplay';
import { useGeb } from '../hooks/useGeb';
import { tokenTickers, SYSTEM_COIN_ADDRESS } from '@/app/utils/contracts';
import { formatLargeNumber } from '../utils/helpers';

export const RedeemBox = () => {
  const [redeeemInput, setRedeemInput] = useState(0);

  const { address } = useAccount();
  const { chain } = useNetwork();

  const {
    proxiedRedeemSystemCoins,
    redeemableCoinBalance,
    collateralCashPrice,
    txReceiptPending
  } = useGeb();

  return (
    <Flex
      direction='column'
      borderRadius='10px'
      color='white'
      alignItems='center'
      w='100%'
    >
      <SimpleGrid columns='1' gap='5' mr='auto' w='50%' mb='2rem'>
        <BalanceDisplay
          amount={redeemableCoinBalance}
          label='Redeemable Coin Balance'
          symbol={tokenTickers[chain?.id]?.systemcoin}
          borderColor='#41c1d0'
        />
      </SimpleGrid>

      <Box border='2px solid white' borderRadius='5px' p='1rem'>
        <HStack mb='10px' alignItems='flex-end' justifyContent='space-between'>
          <Text fontSize='12px' opacity='0.8' textTransform='uppercase'>
            Redeem System Coins
          </Text>
          <Text fontSize='12px' opacity='0.8' textTransform='uppercase'>
            Redeemable Balance:{' '}
            {new Intl.NumberFormat('en-US', {
              style: 'decimal',
              minimumFractionDigits: 0
            }).format(Number(redeemableCoinBalance))}
          </Text>
        </HStack>
        <HStack>
          <NumberInput value={redeeemInput} defaultValue={0} min={0}>
            <NumberInputField
              bg='transparent'
              border='none'
              outline='none'
              fontSize='28px'
              onChange={(e) => setRedeemInput(e.target.value)}
            />
          </NumberInput>
          <Text textTransform='uppercase' fontWeight='bold'>
            {tokenTickers[chain?.id]?.systemcoin}
          </Text>
        </HStack>
      </Box>

      {chain?.id in SYSTEM_COIN_ADDRESS ? (
        <Button
          mt='1rem'
          bg='#41c1d0'
          loadingText={'Transaction pending..'}
          isLoading={txReceiptPending}
          isDisabled={
            Number(redeeemInput) <= 0 ||
            Number(redeeemInput) > Number(redeemableCoinBalance)
          }
          onClick={() => proxiedRedeemSystemCoins(redeeemInput)}
          _hover={{
            opacity: 0.7
          }}
        >
          Redeem
        </Button>
      ) : (
        <Text
          mt='10px'
          mx='auto'
          fontSize='12px'
          opacity='0.7'
          fontStyle='italic'
        >
          {address ? 'Unsupported network!' : 'Connect your wallet'}
        </Text>
      )}
    </Flex>
  );
};
