import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { createCard, readCard, readDeck, updateCard } from "../utils/api";

function AddCard() {
    const history = useHistory();
    const { deckId, cardId } = useParams();
    const [deck, setDeck] = useState(null);
    const [card, setCard] = useState({
        front: "",
        back: "",
    });

    useEffect(() => {
        loadDeck();
        if (cardId) {
            loadCard();
        }
    }, [cardId]);

    const loadDeck = async () => {
        try {
            const loadedDeck = await readDeck(deckId);
            setDeck(loadedDeck);
        } catch (error) {
            console.error("Error loading deck:", error);
        }
    };

    const loadCard = async () => {
        try {
            const loadedCard = await readCard(cardId);
            setCard(loadedCard);
        } catch (error) {
            console.error("Error loading card:", error);
        }
    };

    const handleChange = (event) => {
        setCard({
        ...card,
        [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (cardId) {
            await updateCard(card);
        } else {
            await createCard(deckId, card);
            setCard({ front: "", back: "" });
        }

        if (cardId) {
            history.push(`/decks/${deckId}`);
        }
    };

    if (!deck) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/">Home</Link>
                    </li>
                    <li className="breadcrumb-item">
                        <Link to={`/decks/${deckId}`}>{deck.name}</Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        {cardId ? "Edit Card" : "Add Card"}
                    </li>
                </ol>
            </nav>
            <h2>{cardId ? "Edit Card" : "Add Card"}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="front">Front</label>
                    <textarea
                        id="front"
                        name="front"
                        className="form-control"
                        rows="4"
                        placeholder="Front side of the card"
                        value={card.front}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="back">Back</label>
                    <textarea
                        id="back"
                        name="back"
                        className="form-control"
                        rows="4"
                        placeholder="Back side of the card"
                        value={card.back}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                {!cardId && (
                    <button
                        type="button"
                        className="btn btn-secondary mr-2"
                        onClick={() => history.push(`/decks/${deckId}`)}
                    >
                        Done
                    </button>
                )}
                <button type="submit" className="btn btn-primary">
                    Save
                </button>
            </form>
        </div>
    );
}

export default AddCard;
