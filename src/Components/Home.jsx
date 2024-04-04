import { useNavigate } from 'react-router-dom'
import '../styles/home.scss'


const Home = () => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/products/64da35c9f2805549788a4fc6')
    }

    return (
        <div className='center home-main'>
            <h1 className="gradient-text center">Welcome to BharatPOS</h1>
            <button onClick={handleClick}>
                Click Me
            </button>
        </div>
    )
}

export default Home