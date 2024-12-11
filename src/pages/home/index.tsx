import { BsSearch } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import styles from './home.module.css';

export function Home() {
    return (
        <main className={styles.container}>
            <form className={styles.form}>
                <input type="text" placeholder="Digite o nome da moeda... (Ex.: Bitcoin)" />
                <button>
                    <BsSearch size={30} color="#FFF"/>
                </button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th scope="col">Moeda</th>
                        <th scope="col">Valor mercado</th>
                        <th scope="col">Preço</th>
                        <th scope="col">Volume</th>
                        <th scope="col">Mudança 24h</th>
                    </tr>
                </thead>
                <tbody id="cripto-table-body">
                    <tr className={styles.row}>
                        <td className={styles.label} data-label="">
                            <Link to="/detail/:id">
                                <span>Bitcoin</span> | BTC
                            </Link>
                        </td>
                        <td className={styles.label} data-label="Valor Mercado">1T</td>
                        <td className={styles.label} data-label="Preço">8.000</td>
                        <td className={styles.label} data-label="Volume">2B</td>
                        <td className={styles.label} data-label="Mudança 24h">
                            <span className="profit">1.2323</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </main>
    )
}