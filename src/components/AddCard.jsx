import React, { useState, useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { createCard, readDeck } from "../utils/api";

function AddCard() {
    const history = useHistory();
    const [front, setFront] = useState("");
    const [back, setBack] = useState("");
    const { deckId } = useParams();
    const [deck, setDeck] = useState({});

    useEffect(() => {
        const abortController = new AbortController();
    
        const loadDeck = async () => {
          try {
            const response = await readDeck(deckId, abortController.signal);
            setDeck(response);
          } catch (error) {
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
            const newCard = {
                front,
                back,
                deckId: deckId,
            };
            await createCard(deckId, newCard);
            history.push(`/decks/${deckId}`);
        }   catch (error) {
            console.error("Error creating card:", error);
        }
    };

    const handleDone = () => {
        history.push(`/decks/${deckId}`);
    };

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
                        Add Card
                    </li>
                </ol>
            </nav>
            <h1>{deck.name}: Add Card</h1>
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
                        placeholder="Front side of card"
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
                        placeholder="Back side of card"
                        required
                    ></textarea>
                </div>
                <button type="button" className="btn btn-secondary mr-2" onClick={handleDone}>
                    Done
                </button>
                <button type="submit" className="btn btn-primary">
                    Save
                </button>
            </form>
        </div>
    )
}
export default AddCard;