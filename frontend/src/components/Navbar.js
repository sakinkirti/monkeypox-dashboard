import React from 'react'
import {
    Box,
    Button,
    ButtonGroup,
    Flex,
    HStack,
    Text,
    Spacer,
    useColorModeValue,
    Menu,
    MenuItem,
    MenuButton,
    IconButton,
    MenuList
} from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'
import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <Box position='absolute' zIndex={10} bg='gray.100' minWidth='100%' boxShadow={useColorModeValue('sm', 'sm-dark')} py={5}>
            <HStack>
                <Text fontSize='2xl' as='b' px={10} whiteSpace='nowrap'>Monkeypox Dashboard</Text>
                <Spacer />
                <HStack spacing="10" justify="space-between" px={16}>
                    <Flex justify="space-between" flex="1" display={{ sm: 'none', md: 'flex' }}>
                        <ButtonGroup variant="link" spacing="20">
                            <Button color='gray.700'>
                                <Link to='/'>Map</Link>
                            </Button>
                            <Button color='gray.700'>
                                <Link to='/charts'>Charts</Link>
                            </Button>
                            <Button color='gray.700'>
                                <Link to='/help'>Help</Link>
                            </Button>
                        </ButtonGroup>
                    </Flex>
                    <Flex flex="1" display={['flex', 'flex', 'none', 'none']}>
                        <Menu>
                            <MenuButton
                                as={IconButton}
                                aria-label='Options'
                                icon={<HamburgerIcon />}
                                variant='outline'
                            />
                            <MenuList>
                                <Link to="/">
                                    <MenuItem>Map</MenuItem>
                                </Link>
                                <Link to="/charts">
                                    <MenuItem>Charts</MenuItem>
                                </Link>
                                <Link to="/help">
                                    <MenuItem>Help</MenuItem>
                                </Link>
                            </MenuList>
                        </Menu>
                    </Flex>
                </HStack>
            </HStack>
        </Box>
    )
}

export default Navbar