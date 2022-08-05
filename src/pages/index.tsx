import Head from 'next/head';
import styles from './home.module.scss';
import { SubscribeButton } from '../components/SubscribeButton'
import { GetServerSideProps, GetStaticProps } from 'next';//getServerSideProps (SSR), getStaticProps (SSG)
import { stripe } from '../services/stripe';

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}
//3 formas de chamar APIs:
//Client side (com hooks, informações que não tem necessidade de já estar disponível antes da página ser carregada)
//Server-side (informações em tempo real com dados dinâmicos)
//Static Site Generation (útil para home de um blog, páginas que são iguais para todos usuários)

export default function Home({ product }: HomeProps) {
  //O componente Head permite adicionar um título diferente por página, será anexado ao _document.tsx
  //Inclusive, se o elemento <title> for colocado direto no document.tsx o Next gera um erro
  return (
    <>
      <Head>
        <title>Home | Ig News</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey,welcome!</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>
            Get access to all publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>
        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  )
}
//Quando quero buscar dados de SSR é sempre busca de dados sempre DA PÁGINA PARA O COMPONENTE
//Por meio de useEffect causa layout shift, quando o usuário entra na tela o preço ainda não existe
//somente depois o preço carrega.
//Server Side Rendering irá segurar a renderização da página até que a request seja terminada
export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1K9z5uDnaOovrQ7qwGeGafIy');

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price.unit_amount / 100), //salva em centavos

  };

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24, //24 hours, só muda a propriedade quando o revalidate terminar
  }
  //SSR= mais dinamicidade
  //SSG= menos dinamicidade (depende do revalidate para regerar o HTML estático)
}
