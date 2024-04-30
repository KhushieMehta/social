import { Box, Circle, Image, Link, Text ,Button } from "@chakra-ui/react";
import { useState } from "react";
import { AiOutlineLike } from 'react-icons/ai'
import { Link as profileLink } from 'react-router-dom';


export default function Post({ post, likes, created, author, isLiked, likeHandler, deleteHandler ,id, index, name, image }) {
    const [imageError, setImageError] = useState(false)
    const getTime = () => {
        let date = new Date(created)
        let currentDate = date.getDate()
        let currentMonth = Number(date.getMonth()) + 1
        let hours = date.getHours()
        let minutes = date.getMinutes()
        let seconds = date.getSeconds()
        return (currentDate < 10 ? '0' + currentDate : currentDate) + '/' + (currentMonth < 10 ? '0' + currentMonth : currentMonth) + '/' + date.getFullYear() + ', ' + (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds)
    }
    

    const imageDisplayHandler = () => {
        setImageError(true)
    }

    return (
        <Box display='flex' flexDirection='column' justifyContent='flex-start' alignItems='flex-start' borderColor= 'Red' width='80%' boxShadow='md' mb='2rem' borderRadius='12px'>
            <Box display='flex' p='.05rem' justifyContent='flex-start' alignItems='center' width='100%' backgroundColor='white' borderTopRadius='12px'>
                {
                    !imageError ?
                        <Image borderRadius='50%' width='3rem' height='3rem' objectFit='cover' src={image} alt={author} mr='2rem' onError={imageDisplayHandler} />
                        :
                        <Image borderRadius='50%' width='4rem' height='4rem' objectFit='cover' src='/img.jpeg' alt={author} mr='2rem' onError={imageDisplayHandler} />
                }
                
                
                <Box display='flex' flexDirection='column' color='black' justifyContent='space-evenly' height='5rem'width='100%' alignItems='flex-start' mb='0.5rem'>
                    <Text fontSize='xl' fontWeight='semibold'>{name}</Text>
                    <Text fontSize='sm' color='twitter.500' fontWeight='semibold'>
                        <Link as={profileLink}
                            to={{
                                pathname: `/profile/${author}`,
                                state: { id: `${author}` }
                            }}
                            style={{ textDecoration: 'none' }}>
                            @{author}
                        </Link>
                    </Text>
                </Box>
               
            </Box>
            <Box display='flex' flexDirection='column' justifyContent='flex-start'  p='1rem' width= '100%' >
                <Text fontSize='2xl' fontWeight='bold' mb='0.5rem'>{post}</Text>
                <Text fontSize='md' color='gray' mb='0.5rem'>Posted on: {getTime()}</Text>
                <Box d='flex' justifyContent='space-betwwen' alignItems='space-between' grid-gap= '4'
                 borderColor= 'black' borderStyle = 'solid'  width='100%'>
                    <Text mr='1rem'  color='twitter.500'>{likes.length} {likes.length === 1 ? 'like' : 'likes'} </Text>
                    <Circle
                        border='1px'
                        borderStyle='solid'
                        borderColor='blue.200'
                        size="30px" bg={isLiked ? 'twitter.500' : 'transparent'}
                        onClick={() => likeHandler(id, index, isLiked)}
                        cursor='pointer'
                        mr='1rem'
                    >
                        <AiOutlineLike color={isLiked ? 'white' : 'black'} />
                    </Circle>
                    {isLiked && <Text>You like this!</Text>}
                    <Box display ='flex' width ='100%' 
                    justifyContent= 'end' >
                    <div   >
                        <Button colorScheme="pink" variant="solid" size="sm" width ="100%"   onClick={() => deleteHandler(id)}>Delete-Post </Button>
                        </div>
                    </Box>
                   
                </Box>
            </Box>
            
        </Box >
    )
}