import { Box, Button, Image, Link, Text } from "@chakra-ui/react";
import { useState } from "react";
import { Link as profileLink } from 'react-router-dom';


export default function UserCard({ username, image, followers, followHandler }) {
    const [loading, setLoading] = useState(false)
    const [imageError, setImageError] = useState(false)

    const imageDisplayHandler = () => {
        setImageError(true)
    }

    return (
        <Box bgColor='white' p='1rem' width='100%' d='flex' flexDirection='column' borderRadius='12px' boxShadow='lg'>
            <Box d='flex' justifyContent='space-between' alignItems='center'>
                <Text fontSize='md' color='twitter.500' mr='1rem'>
                    <Link
                        as={profileLink}
                        to={{
                            pathname: `/profile/${username}`,
                            state: { id: `${username}` }
                        }}
                        style={{ textDecoration: 'none' }}
                    >
                        @{username}
                    </Link>
                </Text>
                {!imageError ?
                    <Image borderRadius='50%' width='35px' height='35px' objectFit='cover' src='/img.jpeg' alt={username} onError={imageDisplayHandler} />
                    :
                    <Image borderRadius='50%' width='35px' height='35px' objectFit='cover' src='/img.jpeg' alt='null' />
                }
            </Box>

            <Box d='flex' justifyContent='space-between' alignItems='center' mt='1rem'>
                <Text fontSize='md'>Followers : {followers}</Text>
                <Button
                    color='twitter.500'
                    size='xs'
                    onClick={() => followHandler(username, setLoading)}
                    isLoading={loading}
                    loadingText='Following'
                >
                    Follow
                </Button>
            </Box>
        </Box >
    )
}