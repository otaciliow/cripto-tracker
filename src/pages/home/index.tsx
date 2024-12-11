import { useState, useEffect, FormEvent } from 'react';
import { BsSearch } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import styles from './home.module.css';

interface ICoinProps {
    id: string;
    name: string;
    symbol: string;
    priceUsd: string;
    vwap24hr: string;
    changePercent24Hr: string;
    rank: string;
    supply: string;
    maxSupply: string;
    marketCapUsd: string;
    volumeUsd24Hr: string;
    explorer: string;
    formatedPrice?: string;
    formatedMarket?: string;
    formatedVolume?: string;
}

interface IDataProp {
    data: ICoinProps[]
}

export function Home() {
    const [input, setInput] = useState("");
    const [coins, setCoins] = useState<ICoinProps[]>([]);
    const [offset, setOffset] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        handleGetData();
    }, [offset])

    async function handleGetData() {
        fetch(`https://api.coincap.io/v2/assets?limit=10&offset=${offset}`)
        .then(response => response.json())
        .then((data: IDataProp) => {
            const coinsData = data.data;

            const price = Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            })

            const priceCompact = Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                notation: "compact"
            })

            const formatedResult = coinsData.map((item) => {
                const formated = {
                    ...item,
                    formatedPrice: price.format(Number(item.priceUsd)),
                    formatedMarket: priceCompact.format(Number(item.marketCapUsd)),
                    formatedVolume: priceCompact.format(Number(item.volumeUsd24Hr)),
                }

                return formated;
            })

            const listCoins = [...coins, ...formatedResult];

            setCoins(listCoins);
        })
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (input === '') return;

        navigate(`/detail/${input}`);
    }

    function handleGetMore() {
        if (offset === 0) {
            setOffset(10);
            return
        }

        setOffset(offset + 10);
    }

    return (
        <main className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input type="text" placeholder="Digite o nome da moeda... (Ex.: Bitcoin)" value={input} onChange={(e) => setInput(e.target.value)} />
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
                    {coins.length > 0 && coins.map((item) => (
                        <tr className={styles.row} key={item.id}>
                            <td className={styles.label} data-label="Moeda">
                                <Link to={`/detail/${item.symbol}`} className={styles.currencyName}>
                                    <img className={styles.logo} src={`https://assets.coincap.io/assets/icons/${item.symbol.toLowerCase()}@2x.png`} alt={`Logo ${item.name}`} />
                                    <span>{item.name}</span> | {item.symbol}
                                </Link>
                            </td>
                            <td className={styles.label} data-label="Valor Mercado">{item.formatedMarket}</td>
                            <td className={styles.label} data-label="Preço">{item.formatedPrice}</td>
                            <td className={styles.label} data-label="Volume">{item.formatedVolume}</td>
                            <td className={styles.label} data-label="Mudança 24h">
                                <span className={Number(item.changePercent24Hr) > 0 ? styles.profit : styles.loss}>{Number(item.changePercent24Hr).toFixed(2)}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className={styles.buttonWrapper}>
                <button className={styles.showMore} onClick={handleGetMore}>
                    Carregar Mais
                </button>
            </div>
        </main>
    )
}