import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { createCard, readCard, readDeck, updateCard } from "../utils/api";


function EditCard() {
    const history = useHistory();
    const [front, setFront] = useState("");
    const [back, setBack] = useState("");
    const { deckId, cardId } = useParams();
    const [deck, setDeck] = useState({});
    const [card, setCard] = useState({});

    useEffect(() => {
        const abortController = new AbortController();

        const loadCard = async () => {
            try {
                const response = await readCard(cardId, abortController.signal);
                setCard(response);
                setFront(response.front);
                setBack(response.back);
            }   catch (error) {
                if (!abortController.signal.aborted) {
                    console.error("Error:", error);
                }
            }
        };

        loadCard();

        return () => {
            abortController.abort();
        };
    }, [cardId]);


    useEffect(() => {
        const abortController = new AbortController();

        const loadDeck = async () => {
            try {
                const response = await readDeck(deckId, abortController.signal);
                setDeck(response);
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
            const updatedCard = {
                ...card, front, back
            };
            await updateCard(updatedCard);
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
                        Edit Card {cardId}
                    </li>
                </ol>
            </nav>
            <h1>Edit Card</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="front" className="form-label">
                        Front
                    </label>
                    <textarea
                        className="form-control"
                        id="front"
                        rows="3"
                        value={front}
                        onChange={(e) => setFront(e.target.value)}
                        placeholder={front}
                        required
                    ></textarea>
                </div>
                <div className="mb-3">
                <label htmlFor="back" className="form-label">
                        Back
                    </label>
                    <textarea
                        className="form-control"
                        id="back"
                        rows="3"
                        value={back}
                        onChange={(e) => setBack(e.target.value)}
                        placeholder={back}
                        required
                    ></textarea>
                </div>
                <button type="button" className="btn btn-secondary mr-2" onClick={handleCancel}>
                    Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </form>
        </div>
    )
}

export default EditCard