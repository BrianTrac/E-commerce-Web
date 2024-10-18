import { useNavigate } from "react-router-dom"

const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    return (
        <section>
            <h1 className="text-center text-2xl font-bold">Unauthorized</h1>
            <br />
            <p>You do not have access to the requested page.</p>
            <div>
                <button onClick={goBack}>Go Back</button>
            </div>
        </section>
    )
}

export default Unauthorized