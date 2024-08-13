import React, { useState, useEffect } from 'react';
import appwriteService from '../appwrite/configappwrite'
import { Container, PostCard } from '../components';
function Home(props) {
    const [posts, setPost] = useState([])
    useEffect(() => {
        appwriteService.getPosts().then((posts) => {
            if (posts) {
                setPost(posts.documents)
            }
        })
    }, [])

    if (posts.length === 0) {
        return (
            <div>
                <Container>
                    <h1>Login to read Post</h1>
                </Container>
            </div>
        )
    }

    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {
                        posts.map((post) => (
                            <div key={post.$id} className='p-2 w-1/4'>
                                <PostCard post={post} />
                            </div>
                        ))
                    }
                </div>
            </Container>
        </div>
    )
}

export default Home;