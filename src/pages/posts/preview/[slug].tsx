import { GetStaticProps } from "next";
import Link from "next/link";
import Head from "next/head";
import { RichText } from "prismic-dom";
import { getPrismicClient } from "../../../services/prismic";
import styles from '../post.module.scss';
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

interface PostPreviewProps {
    post: {
        slug: string;
        title: string;
        content: string;
        updatedAt: string;
    }
}

export default function PostPreview({ post }: PostPreviewProps) {
    const { data } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (data?.activeSubscription) {
            router.push(`/posts/${post.slug}`);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    return (
        <>
            <Head>
                <title>{post.title} | Ignews</title>
            </Head>

            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>

                    <div
                        className={`${styles.postContent} ${styles.previewContent}`}
                        dangerouslySetInnerHTML={{
                            __html: post.content
                        }}
                    />
                    <div className={styles.continueReading}>
                        Want to continue reading?
                        <Link href="/">
                            <a>Subscribe now 💁‍♂️</a>
                        </Link>
                    </div>
                </article>
            </main>
        </>
    );
}

export const getStaticPaths = () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const { slug } = params;

    const prismic = getPrismicClient();

    const response = await prismic.getByUID('post', String(slug));

    const post = {
        slug,
        title: response.data.title,
        content: RichText.asHtml(response.data.content.splice(0, 3)),
        updatedAt: new Date(response.last_publication_date)
            .toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })
    }
    return {
        props: { post }
    }
}