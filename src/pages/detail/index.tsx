import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { ICoinProps } from '../../shared/coinProps.interface';

import styles from './detail.module.css';
import { BiInfoSquare } from 'react-icons/bi';

interface IResponseData {
    data: ICoinProps
}

interface IErrorData {
    error: string
}

type DataProps = IResponseData | IErrorData;

export function Detail() {
    const cripto = useParams();
    const navigate = useNavigate();

    const [coin, setCoin] = useState<ICoinProps>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getCoin() {
            try{
                fetch(`https://api.coincap.io/v2/assets/${cripto.id}`)
                .then(response => response.json())
                .then((data: DataProps) => {
                    if ("error" in data) {
                        navigate('/');
                        return;
                    }

                    const price = Intl.NumberFormat("en-US", {
                        style: 'currency',
                        currency: 'USD'
                    })

                    const priceCompact = Intl.NumberFormat("en-US", {
                        style: 'currency',
                        currency: 'USD',
                        notation: 'compact'
                    })

                    const resultData = {
                        ...data.data,
                        formatedPrice: price.format(Number(data.data.priceUsd)),
                        formatedMarket: priceCompact.format(Number(data.data.marketCapUsd)),
                        formatedVolume: priceCompact.format(Number(data.data.volumeUsd24Hr)),
                    }

                    setCoin(resultData);
                    setLoading(false);
                })

            } catch(err){
                console.log(err);
                navigate('/');
            }
        }

        getCoin();
    }, [cripto])

    if (loading || !coin) {
        return (
            <div className={styles.container}>
                <h1 className={styles.center}>Carregando detalhes...</h1>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <div className={styles.infosWrapper}>
                <img src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`} alt={`Logo ${coin?.name}`} className={styles.logo} />                
                <h1 className={styles.center}>{coin?.name} | {coin?.symbol}</h1>
            </div>

            <section className={styles.content}>
                <p><strong>Preço: </strong>{coin?.formatedPrice}</p>
                <p><strong>Mercado: </strong>{coin?.formatedMarket}</p>
                <p><strong>Volume: </strong>{coin?.formatedVolume}</p>
                <p>
                    <strong>Mudança 24h: </strong>
                    <span className={Number(coin?.changePercent24Hr) > 0 ? styles.profit : styles.loss}>{Number(coin?.changePercent24Hr).toFixed(2)}</span>
                </p>
            </section>
        </div>
    )
}