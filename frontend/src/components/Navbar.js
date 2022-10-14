import {
    Box,
    Button,
    ButtonGroup,
    Flex,
    HStack,
    Text,
    Spacer,
    useColorModeValue,
} from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import * as React from 'react'

const Navbar = () => {
    return (
        <Box position='absolute' zIndex={10} bg='gray.100' minWidth='100%' boxShadow={useColorModeValue('sm', 'sm-dark')} py={5}>
            <HStack>
                <Text fontSize='2xl' as='b' px={10}>Monkeypox Dashboard</Text>
                <Spacer />
                <HStack spacing="10" justify="space-between" px={16}>
                    <Flex justify="space-between" flex="1">
                        <ButtonGroup variant="link" spacing="20">
                            <Button color='gray.700'>
                                <Link to='/'>Map</Link>
                            </Button>
                            <Button color='gray.700'>
                                <Link to='/chartsview'>Charts</Link>
                            </Button>
                            <Button color='gray.700'>
                                <Link to='/help'>Help</Link>
                            </Button>
                        </ButtonGroup>
                    </Flex>
                </HStack>
            </HStack>
        </Box>
    )
}

export default Navbar