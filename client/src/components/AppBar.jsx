import { Box, Button, Link, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useState ,useEffect} from "react";
import { Link as profileLink, useHistory, Link as homeLink } from "react-router-dom";

export default function AppBar() {
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const history = useHistory()
    const logoutUrl = '/logout'
    const toast = useToast()
    const [userName, setUserName] = useState("")

    useEffect(() => {
        let user=window.localStorage.getItem('userName')
        setUserName(user)
        // eslint-disable-next-line
    }, [])

    const logoutHandler = async () => {
        setIsLoggingOut(true)
        try {
            let response = await axios.get(logoutUrl)
            if (response.status !== 200) {
                let errorMessage = await response.data
                setIsLoggingOut(false)
                toast({
                    title: 'An Error Occurred',
                    description: errorMessage.message,
                    status: 'error',
                    isClosable: true,
                    duration: 3000
                })
            }
            else {
                window.localStorage.removeItem('access_Token')
                window.localStorage.removeItem('refresh_Token')
                
                toast({
                    title: 'Logged Out!',
                    isClosable: true,
                    duration: 2000,
                    status: 'info'
                })
                history.push('/')
            }
        }
        catch (error) {
            alert(error.message)
        }
    }
    return (
        <Box bgColor='#EDF2F7' display='flex' justifyContent='space-between' alignItems='center' boxShadow='md' width='100%' px='2rem' py='1rem' position='fixed' top='0' zIndex='1'>
            <Text fontSize='4xl' fontWeight='bold' color='twitter.500'><Link as={homeLink} to='/feed' textDecoration='none' style={{ textDecoration: 'none' }}>
                Friends-Group  </Link></Text>
            <Box >

                <Link as={profileLink} to='/profile' textDecoration='inherit' style={{ textDecoration: 'inherit' }}><Button colorScheme='facebook' color='yellow' mr='1rem'> Hey 👋 {userName}</Button></Link>
                <Button
                    colorScheme='red'
                    onClick={logoutHandler}
                    isLoading={isLoggingOut}
                    loadingText = 'Logging Out...'
                >
                    Logout
                </Button>
            </Box>
        </Box>
    )
}