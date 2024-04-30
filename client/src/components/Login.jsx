import { Box, FormControl, VStack, Input, Text, Button, InputGroup, InputLeftElement, InputRightElement, Link } from "@chakra-ui/react";
import { FiUsers } from 'react-icons/fi'
import { AiOutlineLock } from 'react-icons/ai'
import { AiOutlineEyeInvisible } from 'react-icons/ai'
import { useState } from "react";
import { Link as SignupLink, useHistory } from 'react-router-dom'
import { useRef } from "react";

export default function Login() {
    const [showPassword, setShowPassword] = useState('password')
    const [loggingIn, setLoggingIn] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const usernameRef = useRef()
    const passwordRef = useRef()
    const history = useHistory()
    const url = window.location.href.includes('localhost') ? 'http://localhost:4000' : `https://geek-overflow-backend.herokuapp.com`

    const showPasswordHandler = () => {
        setShowPassword('text')
    }

    const hidePasswordHandler = () => {
        setShowPassword('password')
    }

    const attemptLogIn = async () => {
        try {
            let response = await fetch(url+ '/auth/login', {
                method: 'POST',
                body: JSON.stringify({
                    username: usernameRef.current.value.trim(),
                    password: passwordRef.current.value.trim()
                }),
                headers: {
                    'content-type': 'application/json'
                }
            })
            if (response.status !== 200) {
                let errorMessage = await response.json()
                setErrorMessage(errorMessage.message)
                setLoggingIn(false)
                return
            }
            else {
                let data = await response.json()
            
                window.localStorage.setItem('access_Token', data.access_Token)
                window.localStorage.setItem('refresh_Token', data.refresh_Token)
                window.localStorage.setItem('userName', data.userName)


                
                history.push('/feed')
            }
        }
        catch (error) {
            setErrorMessage(error.message)
            setLoggingIn(false)
            return
        }
    }

    const loginHandler = (e) => {
        e.preventDefault()
        setLoggingIn(true)
        if (usernameRef.current.value.trim().length < 6) {
            setErrorMessage('Minimum 6 characters required for username!')
            setLoggingIn(false)
            return
        }
        if (!passwordRef.current.value.trim().length) {
            setErrorMessage('Password field cannot be empty!')
            setLoggingIn(false)
            return
        }

        attemptLogIn()
    }

    return (
        <Box d='flex' justifyContent='center' alignItems='center' minHeight='100vh'>
            <VStack>
                <Text fontSize='6xl' paddingBottom='1rem'>Friends-Group</Text>
                <Box d="flex" p="2rem" paddingTop='0' borderWidth="1px" borderRadius="lg">
                    <VStack>
                        <FormControl>
                            <Text fontSize='3xl' mb='2rem'>Sign-In</Text>
                            <InputGroup>
                                <InputLeftElement
                                    pointerEvents="none"
                                    children={<FiUsers color="gray.300" />}
                                />
                                <Input
                                    variant='outline'
                                    placeholder="Username"
                                    isRequired
                                    type='text'
                                    mb='1rem'
                                    ref={usernameRef}
                                />
                            </InputGroup>
                        </FormControl>
                        <FormControl>

                            <InputGroup>
                                <InputLeftElement
                                    pointerEvents="none"
                                    children={<AiOutlineLock color="gray.300" />}
                                />
                                <Input
                                    variant='outline'
                                    placeholder='Password'
                                    isRequired
                                    type={showPassword}
                                    mb='1rem'
                                    ref={passwordRef}
                                />
                                <InputRightElement
                                    children={<AiOutlineEyeInvisible color="gray.300" />}
                                    onMouseDown={showPasswordHandler}
                                    onMouseUp={hidePasswordHandler}
                                    cursor='pointer'
                                />
                            </InputGroup>
                        </FormControl>
                        <Button colorScheme='blue' onClick={loginHandler} isLoading={loggingIn} loadingText='Logging In'>Submit</Button>
                        <Text fontSize='xs' py='1rem' color='red'>{errorMessage}</Text>
                    </VStack>
                </Box>
                <Text><Link as={SignupLink} to='/signup' color='blue'>Don't have an account? Sign Up!</Link></Text>
            </VStack>
        </Box>
    )
}