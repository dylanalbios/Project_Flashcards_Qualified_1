import React, { useState, useEffect} from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { readDeck, deleteDeck, deleteCard } from "../utils/api";


function Deck() {
    const history = useHistory();
    const { deckId } = useParams();
    const [deck, setDeck] = useState(null);

    useEffect(() => {
        loadDeck();
    }, []);

    const loadDeck = async () => {
        try {
            const loadedDeck = await readDeck(deckId);
            setDeck(loadedDeck);
        }   catch (error) {
            console.error("Error loading deck:", error);
        }
    };

    const handleDeleteDeck = async (deckId) => {
        if (window.confirm("Delete this deck? You will not be able to recover it")) {
          try {
            await deleteDeck(deckId);
            history.push("/");
          } catch (error) {
            console.error("Error deleting deck:", error);
          }
        }
    };

    const handleDeleteCard = async (cardId) => {
        if (window.confirm("Are you sure you want to delete this card?")) {
          try {
            await deleteCard(cardId);
            loadDeck();
          } catch (error) {
            console.error("Error deleting card:", error);
          }
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
                    <li className="breadcrumb-item active" aria-current="page">
                        {deck.name}
                    </li>
                </ol>
            </nav>
            <div>
                <div>
                    <h2>{deck.name}</h2>
                    <p>{deck.description}</p>
                </div>
                <div style={{ marginBottom: "20px" }}>
                    <Link to={`/decks/${deckId}/edit`} className="btn btn-secondary mr-2">
                        Edit
                    </Link>
                    <Link to={`/decks/${deckId}/study`} className="btn btn-primary mr-2">
                        Study
                    </Link>
                    <Link to={`/decks/${deckId}/cards/new`} className="btn btn-primary mr-2">
                        Add Cards
                    </Link>
                    <button className="btn btn-danger float-right" onClick={handleDeleteDeck}>
                        Delete
                    </button>
                </div>
            </div>
            <h3>Cards</h3>
            {deck.cards.length === 0 ? (
                <p>No cards found in this deck</p>
            ) : (
                <div>
                    {deck.cards.map((card) => (
                        <div key={card.id} className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-6">
                                        <div className="card-content">
                                            <div className="question">{card.front}</div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="card-content">
                                            <div className="answer">{card.back}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-end m-2">
                                <Link
                                    to={`/decks/${deckId}/cards/${card.id}/edit`}
                                    className="btn btn-secondary mr-2"
                                >
                                    Edit
                                </Link>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleDeleteCard(card.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Deck