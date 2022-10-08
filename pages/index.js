import Head from "next/head";
import Image from "next/image";
// import Header from "../components/ManualHeader";
import Header from "../components/AutoHeader";
import styles from "../styles/Home.module.css";
import LottoEntrance from "../components/LottoEntrance";
export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Lotto</title>
        <meta name="description" content="Smart contract lottery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      hello, world!
      <LottoEntrance />
    </div>
  );
}
