import { Box, Button, FormControl, Input, InputGroup, InputRightElement, Link, Text, useToast, VStack } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { Link as LoginLink, useHistory } from 'react-router-dom'

export default function SignUp() {
    const [showPassword, setShowPassword] = useState('password')
    const [image, setImage] = useState(null)
    const [errorMessage, setErrorMessage] = useState(' ')
    const [buttonLoading, setButtonLoading] = useState(false)
    const nameRef = useRef()
    const usernameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const confirmPasswordRef = useRef()
    const url = window.location.href.includes('localhost') ? 'http://localhost:4000' : `https://geek-overflow-backend.herokuapp.com`
    const history = useHistory()
    const toast = useToast()

    const showPasswordHandler = () => {
        setShowPassword('text')
    }

    const hidePasswordHandler = () => {
        setShowPassword('password')
    }


    const submitForm = async () => {
        let formData = new FormData()
        formData.append("name", nameRef.current.value.trim())
        formData.append("email", emailRef.current.value.trim())
        formData.append("password", passwordRef.current.value.trim())
        formData.append("username", usernameRef.current.value.trim())
        if (image) {
            formData.append('profilePic', image)
        }
        try {
            let response = await fetch(url + '/auth/signup', {
                method: 'POST',
                body: formData
            })
            if (response.status !== 200) {
                let errorMessage = await response.json()
                console.log(errorMessage)
                setErrorMessage(errorMessage.message)
                setButtonLoading(false)
                toast({
                    title: "We Encountered an Error",
                    status: 'error',
                    duration: 3000,
                    isClosable:true
                })
                return
            }
            else {
                toast({
                    title: "Account Created",
                    status: 'success',
                    duration: 1500,
                    isClosable:true
                })
                history.push('/login')
            }
        }
        catch (error) {
            setErrorMessage(error.message)
            setButtonLoading(false)
            return
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        setButtonLoading(true)
        setErrorMessage(' ')
        if (nameRef.current.value.trim().length < 4) {
            setErrorMessage('Minimum 4 characters required for name!')
            setButtonLoading(false)
            return
        }
        if (usernameRef.current.value.trim().length < 6) {
            setErrorMessage('Minimum 6 characters required for username!')
            setButtonLoading(false)
            return
        }
        if (!/.*@.*\..*/.test(emailRef.current.value.trim())) {
            setErrorMessage('Please enter a valid Email Id!')
            setButtonLoading(false)
            return
        }
        if (passwordRef.current.value.trim().length < 6) {
            setErrorMessage('Password should be atleast 6 characters long')
            setButtonLoading(false)
            return
        }
        if (passwordRef.current.value.trim() !== confirmPasswordRef.current.value.trim()) {
            setErrorMessage(`Passwords don't match!`)
            setButtonLoading(false)
            return
        }
        console.log(nameRef.current.value)
        submitForm()
    }

    return (
        <Box d='flex' justifyContent='center' alignItems='center' minHeight='100vh'>
            <VStack>
                <Text fontSize='6xl' paddingBottom='1rem'>Friends-Group</Text>
                <Box d="flex" p="2rem" paddingTop='0' borderWidth="1px" borderRadius="lg" minWidth='80%'>
                    <VStack>
                        <FormControl>
                            <Text fontSize='5xl' mb='1rem'>Sign Up</Text>
                            <Input
                                id='full-name'
                                variant='outline'
                                placeholder="Full Name"
                                isRequired
                                type='text'
                                mb='1rem'
                                ref={nameRef}
                            />
                            <Input
                                id='username'
                                variant='outline'
                                placeholder="Username"
                                isRequired
                                type='text'
                                mb='1rem'
                                ref={usernameRef}
                            />
                            <Input
                                id='email'
                                variant='outline'
                                placeholder="Email"
                                isRequired
                                type='email'
                                mb='1rem'
                                ref={emailRef}
                            />

                        </FormControl>
                        <FormControl>
                            <InputGroup>
                                <Input
                                    id='password'
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
                            <Input
                                id='confirm-password'
                                variant='outline'
                                placeholder='Confirm Password'
                                isRequired
                                type='password'
                                mb='1rem'
                                ref={confirmPasswordRef}
                            />

                            <Box d='flex' justifyContent='flex-start' mb='1rem' alignItems='center'>
                                <label htmlFor='profilePic' style={{ marginRight: '1rem' }}>
                                    <Button
                                        colorScheme='green'
                                        as='span'
                                        disabled={buttonLoading}
                                    >
                                        Upload Photo
                                    </Button>
                                </label>
                                <input
                                    accept="image/*"
                                    id="profilePic"
                                    name="profilePic"
                                    type="file"
                                    onChange={(e) => setImage(e.target.files[0])}
                                    style={{ display: 'none' }}
                                />
                                <p>{image?.name}</p>
                            </Box>
                        </FormControl>
                        <Button
                            colorScheme='blue'
                            onClick={submitHandler}
                            isLoading={buttonLoading}
                            loadingText='Submitting'
                            mb='1rem'
                        >
                            Submit
                        </Button>
                        <Text fontSize='xs' py='1rem' color='red'>{errorMessage}</Text>
                    </VStack>
                </Box>
                <Text><Link as={LoginLink} to='/login' color='blue'>Already have an account? Log In</Link></Text>
            </VStack>
        </Box>
    )
}