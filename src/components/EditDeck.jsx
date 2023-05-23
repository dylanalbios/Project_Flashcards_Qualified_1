import React, { useState, useEffect} from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { readDeck, updateDeck } from "../utils/api";


function EditDeck () {
    const history = useHistory();
    const { deckId } = useParams();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [deck, setDeck] = useState({});


    useEffect(() => {
        const abortController = new AbortController();

        const loadDeck = async () => {
            try {
                const response = await readDeck(deckId, abortController.signal);
                setDeck(response);
                setName(response.name);
                setDescription(response.description);
            }   catch (error) {
                if (!abortController.signal.aborted) {
                    console.error("Error:", error);
                }
            }
        };

        loadDeck();

        return () => {
            abortController.abort();
        };
    }, [deckId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const updatedDeck = {
                ...deck, name, description
            };
            await updateDeck(updatedDeck);
            history.push(`/decks/${deckId}`);
        }   catch (error) {
            console.error("Error updating:", error);
        }
    };

    const handleCancel = () => {
        history.push(`/decks/${deckId}`);
    };


    return (
        <div>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item" aria-current="page">
                        <Link to="/">Home</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        <Link to={`/decks/${deckId}`}>{deck.name}</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        Edit Deck
                    </li>
                </ol>
            </nav>
            <h1>Edit Deck</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                        Name
                    </label>
                    <textarea
                        className="form-control"
                        id="name"
                        rows="3"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={name}
                        required
                    ></textarea>
                </div>
                <div className="mb-3">
                <label htmlFor="description" className="form-label">
                        Description
                    </label>
                    <textarea
                        className="form-control"
                        id="description"
                        rows="3"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={description}
                        required
                    ></textarea>
                </div>
                <button type="button" className="btn btn-secondary mr-2" onClick={handleCancel}>
                    Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                    Sumbit
                </button>
            </form>
        </div>
    )

}


export default EditDeck