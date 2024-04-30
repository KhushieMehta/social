import { Box, Button, FormControl, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Progress, Text, Textarea, useDisclosure, useToast, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BsFillPlusCircleFill } from 'react-icons/bs'
import { useRef } from "react";
import Post from "./Post";
import axios from "axios";
import Suggestions from "./Suggestions";

export default function Feed() {
    const [posts, setPosts] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [isPosting, setIsPosting] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const postRef = useRef()
    const postsUrl = '/feed/'
    const createPostUrl = '/post/'
    const toast = useToast()


    const getPosts = async () => {
        setIsLoading(true)
        try {
            let response = await axios.get(postsUrl)
            let data = await response.data

            if (response.status !== 200) {
                setIsLoading(false)
                toast({
                    title: 'Error Loading Posts!',
                    description: data.message,
                    status: 'error',
                    isClosable: true,
                    duration:3000
                })
            }
            else {
                setPosts(data.message)
                setIsLoading(false)
                toast({
                    title:'Posts Loaded Successfully!',
                    status: 'success',
                    duration: 500,
                    isClosable: true
                })
            }
        }
        catch (error) {
            alert(error.message)
        }
    }

    useEffect(() => {
        getPosts()
        // eslint-disable-next-line
    }, [])


    const newPostHandler = async () => {
        if (!postRef.current.value.trim().length) {
            return
        }
        try {
            setIsPosting(true)
            let response = await axios.post(createPostUrl, {
                post: postRef.current.value
            })
            let data = await response.data
            if (response.status !== 200) {
                toast({
                    title: 'An Error Occurred',
                    description: data.message,
                    status: 'error',
                    isClosable: true,
                    duration:2000
                })
                setIsPosting(false)
            }
               
            else {
                toast({
                    title:'Successfully created a new post!',
                    status: 'success',
                    duration: 1500,
                    isClosable: true
                })
                setIsPosting(false)
               
                onClose()
                getPosts() 
            }
        }
        catch (error) {
            alert(error.message)
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
                    duration:2000
                })
            }
            else {
                let newLikesMap = posts.likesMap.map((post, index) => index === idx ? !isLiked : post)
                let newPosts = posts.posts.map((post, index) => index === idx ? { ...post, likes: !isLiked ? [...post.likes, index] : post.likes.slice(0, post.likes.length-1) } : post)
                setPosts({ posts: newPosts, likesMap: newLikesMap })
                toast({
                    title: !isLiked ? 'Post Liked!' : 'Post Unliked!',
                    status: 'success',
                    duration: 1500,
                    isClosable: true
                })
            }
        }
        catch (error) {
        console.log(error.message)
        }
    }
    const deleteHandler = async (id) => {

            try {
                let deleteUrl = createPostUrl + id
                console.log(deleteUrl)
                let response = await axios.delete(deleteUrl)
                let data = await response.data
                if (response.status !== 200) {
                    toast({
                        title: 'An Error Occurred',
                        description: data.message,
                        status: 'error',
                        isClosable: true,
                        duration:2000
                    })
                }
                else {
                    setPosts(prevState => {
                        const newPosts = prevState.posts.filter(post => post._id !== id)
                        return { ...prevState, posts: newPosts }
                    });
                }
            }
            catch (error) {
                console.log(error.message)
            }
        


    }

    return (
        <Box display='flex' backgroundColor='#EDF2F7' flexDirection='column' width='100%' position='relative' >
            <VStack>
                <Box display='flex' width='100%' pb='2rem' pt='12vh' px='5rem' justifyContent='flex-start' alignItems='flex-start'>
                    <Box d='flex' flexDirection='column' width='50%'>
                        <Text fontSize='3xl' fontWeight='semibold' my='1rem' color='twitter.500'>Posts by your friends</Text>
                        {
                            !isLoading && posts.posts?.length === 0 &&
                            <Text fontWeight='semibold'>No posts to display, time to follow more people!</Text>
                        }
                        {
                            !isLoading && posts.posts?.length > 0 &&
                            posts.posts.map((post, idx) => <Post
                                key={idx}
                                post={post.post}
                                likes={post.likes}
                                created={post.createdAt}
                                author={post.author.username}
                                isLiked={posts.likesMap[idx]}
                                likeHandler={likeHandler}
                                deleteHandler={deleteHandler}
                                id={post._id}
                                index={idx}
                                name = {post.author.name}
                                image = {axios.defaults.baseURL + (post.author.photoURL.includes('static/') ? post.author.photoURL.substring(6) : post.author.photoURL)}
                            />)
                        }
                        {
                            isLoading && <Progress size="xs" isIndeterminate width='100%' />
                        }
                    </Box>
                    <Suggestions getPosts={getPosts} />
                </Box>
            </VStack>
            <Box
                position='fixed'
                right='20px'
                bottom='20px'
                width='45px'
                cursor='pointer'
            >
                <BsFillPlusCircleFill
                    color='blue'
                    size='xl'
                    onClick={onOpen}
                />
            </Box>
            <Modal
                initialFocusRef={postRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader style={{ borderBottom: '1px solid lightblue' }}>Add New Post</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody py={6}>
                        <FormControl>
                            <Textarea ref={postRef} placeholder="How are you feeling today..." />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter style={{ borderTop: '1px solid lightblue' }}>
                        <Button onClick={onClose} mr='1rem' disabled={isPosting}>Cancel</Button>

                        <Button
                            colorScheme={!isPosting ? "blue" : 'gray'}
                            mr={3}
                            onClick={newPostHandler}
                            isLoading={isPosting}
                            loadingText='Posting...'
                        >
                            Post
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}