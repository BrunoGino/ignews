import { AppProps } from 'next/app';
import { Header } from '../components/Header';
import { SessionProvider } from 'next-auth/react';
import '../styles/global.scss';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Header />
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp
//Next utiliza file-system routing, todo arquivo dentro de /pages é uma rota nova
// Se quisermos repetir um cabeçalho, ou utilizar um contexto em todas as páginas 
// coloca-se dentro de _app.tsx.
// O grande ponto do app é que ele é recarregado toda vez que o usuário mudar de página
// pois <Component> é um componente que representa as páginas da aplicação, para cada página
// o Next a injeta dentro desse componente.

//Quando quero fazer algo que deve ser carregado APENAS uma única vez, como o carregamento de uma fonte externa
//utilizo o arquivo _document.tsx, que corresponde ao index.html do CRA.