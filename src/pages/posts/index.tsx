import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../../services/prismic';
import styles from './styles.module.scss';

type Post = {
    slug: string;
    title: string;
    excerpt: string;
    updatedAt: string;
}


interface PostProps {
    posts: Post[];
}

export default function Posts({ posts }: PostProps) {
    return (
        <>
            <Head>
                <title>Posts | Ignews</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.posts}>
                    {posts.map(post => (
                        <Link href={`/posts/${post.slug}`} key={post.slug}>
                            <a>
                                <time>{post.updatedAt}</time>
                                <strong>{post.title}</strong>
                                <p>{post.excerpt}</p>
                            </a>
                        </Link>

                    ))}
                </div>
            </main>
        </>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const prismic = getPrismicClient();

    const response = await prismic.getAllByType('post', {
        fetch: ['post.title', 'post.content'],
        pageSize: 100
    });

    // útil para debug, traz objetos internos de outro objeto
    console.log(JSON.stringify(response, null, 2));

    // Sempre faça a formatação dos dados (preço, data...) logo após o consumo da api
    // Garante mais performance pois garante com que a formatação é feita uma única vez

    const posts = response.map(post => {
        return {
            slug: post.uid,
            title: post.data.title,
            excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
            updatedAt: new Date(post.last_publication_date)
                .toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                }),
        };
    });

    return {
        props: { posts }
    }
}