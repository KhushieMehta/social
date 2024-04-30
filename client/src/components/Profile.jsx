import { Box, Button, Image, Link, Progress, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useParams, Link as homeLink } from "react-router-dom";
import Post from "./Post";

export default function Profile() {
    const [isLoading, setIsLoading] = useState(false)
    const [user, setUser] = useState(null)
    const [posts, setPosts] = useState({})
    const [imageError, setImageError] = useState(false)
    const { id } = useParams()
    const [isFollowing, setIsFollowing] = useState(false)
    const [error, setError] = useState(null)
    const toast = useToast()

    const getProfile = async (link) => {
        setIsLoading(true)
        try {
            let response = await axios.get(link)
            let data = await response.data

            if (response.status !== 200) {
                console.log('in status false')
                toast({
                    title: 'An Error Occurred',
                    description: data.message,
                    status: 'error',
                    isClosable: true,
                    duration: 2000
                })
                setIsLoading(false)
                setError('An Unexpected Error Occurred!')
                setUser(null)
            }
            else {
                setUser(data.message)
                setPosts({ posts: data.message.posts, likesMap: data.message.likesMap })
                setIsLoading(false)
                toast({
                    title: 'Profile loaded!',
                    status: 'info',
                    duration: 1000,
                    isClosable: true
                })
            }
        }
        catch (error) {
            setIsLoading(false)
            setError('User Does Not Exist!')
            setUser(null)
        }
    }

    useEffect(() => {
        getProfile(id ? '/profile/' + id : '/profile')
        // eslint-disable-next-line
    }, [])

    const followHandler = async () => {
        setIsFollowing(true)
        const url = user.currentlyFollowing ? '/unfollow/' : '/follow/'
        try {
            let response = await axios.post(url + user.username)
            let data = await response.data

            if (response.status !== 200) {
                toast({
                    title: 'An Error Occurred',
                    description: data.message,
                    status: 'error',
                    isClosable: true,
                    duration: 2000
                })
                setIsFollowing(false)
            }
            else {
                setUser({ ...user, currentlyFollowing: !user.currentlyFollowing, following: user.currentlyFollowing ? user.following - 1 : user.following + 1 })
                setIsFollowing(false)
                toast({
                    title: user.currentlyFollowing ? 'Unfollowed!' : 'Followed!',
                    status: 'info',
                    duration: 1500,
                    isClosable: true
                })
            }
        }
        catch (error) {
            alert(error.message)
            setIsFollowing(false)
        }
    }

    const likeHandler = async (id, idx, isLiked) => {
        try {
            let likeUrl = isLiked ? '/unlike/' + id : '/like/' + id
            let response = await axios.post(likeUrl)
            let data = await response.data
            if (response.status !== 200) {
                toast({
                    title: 'An Error Occurred',
                    description: data.message,
                    status: 'error',
                    isClosable: true,
                    duration: 3000
                })
            }
            else {
                let newLikesMap = posts.likesMap.map((post, index) => index === idx ? !isLiked : post)
                setPosts({ ...posts, likesMap: newLikesMap })
                toast({
                    title: !isLiked ? 'Post Liked!' : 'Post Unliked!',
                    status: 'success',
                    duration: 1500,
                    isClosable: true
                })
            }
        }
        catch (error) {
            alert(error.message)
        }
    }

    const imageDisplayHandler = () => {
        setImageError(true)
    }

    return (
        <Box d='flex' justifyContent='center' alignItems='center' flexDirection='column' width='100%' pt='12vh' px='5rem'>
            <Box width='100%' d='flex' justifyContent='center' alignItems='center' flexDirection='column'>
                {
                    user &&
                    <Box d='flex' justifyContent='center' alignItems='center' flexDirection='column' mb='2rem' width='50%'>
                        <Text fontSize='4xl' fontWeight='bold' mb='1rem'>{user.name}</Text>
                        {!imageError ?
                            <Image mb='1rem' borderRadius='50%' width='125px' height='125px' objectFit='cover' src={axios.defaults.baseURL + (user.photoURL.includes('static/') ? user.photoURL.substring(6) : user.photoURL)} onError={imageDisplayHandler} />
                            :
                            <Image borderRadius='50%' width='125px' height='125px' objectFit='cover' src='/blank.png' alt='null' mr='2rem' />
                        }
                        <Box display='flex' justifyContent='center' alignItems='center' width='100%' mb='1rem'>
                            <Text fontSize='md' fontWeight='bold' mr='3rem'>@{user.username}</Text>
                            {!user.self &&
                                <Button
                                    size='sm'
                                    backgroundColor={user.currentlyFollowing ? 'red' : 'twitter.500'}
                                    color='white'
                                    onClick={followHandler}
                                    isLoading={isFollowing}
                                    loadingText={user.currentlyFollowing ? 'Unfollowing...' : 'Following...'}
                                >
                                    {user.currentlyFollowing ? 'Unfollow' : 'Follow'}
                                </Button>}
                        </Box>
                        <Box display='flex'><Text fontSize='sm' fontWeight='semibold' mr='1rem'>Following : {user.following}</Text><Text fontSize='sm' fontWeight='semibold'> Followers: {user.followers}</Text></Box>
                    </Box>
                }
            </Box>
            <Box d='flex' justifyContent='center' alignItems='center' flexDirection='column' width='50%'>
                {
                    user && <Text fontSize='3xl' fontWeight='semibold' my='1rem' >Posts by {user.username}</Text>
                }
                {
                    !isLoading && posts.posts?.length === 0 &&
                    <Text fontWeight='semibold'>No posts to display!</Text>
                }
                {
                    !isLoading && posts.posts?.length > 0 &&
                    posts.posts?.map((post, idx) => <Post
                        key={idx}
                        post={post.post}
                        likes={post.likes}
                        created={post.createdAt}
                        author={post.author.username}
                        isLiked={posts.likesMap[idx]}
                        likeHandler={likeHandler}
                        id={post._id}
                        index={idx}
                        name={post.author.name}
                        image={axios.defaults.baseURL + (post.author.photoURL.includes('static/') ? post.author.photoURL.substring(6) : post.author.photoURL)}
                    />)
                }
                {
                    isLoading && <Progress size="xs" isIndeterminate width='100%' />
                }
                {
                    !isLoading && !user && error &&
                    <Box mt='5rem' d='flex' justifyContent='center' alignItems='center' flexDirection='column'>
                        <Text fontSize='3xl' fontWeight='semibold'>{error}</Text>
                        <Text><Link as={homeLink} to='/feed' color='twitter.500' style={{ textDecoration: 'none' }}>Click here to go home!</Link></Text>
                    </Box>
                }
            </Box>
        </Box>
    )
}