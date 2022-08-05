import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import Head from "next/head";
import { RichText } from "prismic-dom";
import { getPrismicClient } from "../../services/prismic";
import styles from './post.module.scss';

interface PostProps {
    // é normal repetir tipagem no typescript
    // o problema é que o Typescript tem a responsabilidade de adicionar tipagens específicas para aum componente apenas
    // Caso a página esteja buscando dados de uma API, por exemplo, naquela página apenas criarei uma tipagem com os dados que eu quero
    post: {
        slug: string;
        title: string;
        content: string;
        updatedAt: string;
    }
}

export default function Post({ post }: PostProps) {
    //a propriedade dangerouslySetInnerHTML é perigosa e deve ser utilizada com cuidado
    //pois possibilita ataque de Cross-Site scripting.
    //Como o prismic possui uma proteção para isso, é mais seguro de ser utilizado
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
                        className={styles.postContent}
                        dangerouslySetInnerHTML={{
                            __html: post.content
                        }}
                    />
                </article>
            </main>
        </>
    );
}
// Não pode ser gerada de forma estática, pois toda página que é gerada de forma estática é desprotegida
export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
    const session = await getSession({ req });
    const { slug } = params;
    if (!session?.activeSubscription) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    const prismic = getPrismicClient();
    const response = await prismic.getByUID('post', String(slug));

    const post = {
        slug,
        title: response.data.title,
        content: RichText.asHtml(response.data.content),
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