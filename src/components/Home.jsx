import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listDecks, deleteDeck } from "../utils/api";

function Home() {
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = async () => {
    try {
      const decksData = await listDecks();
      setDecks(decksData);
    } catch (error) {
      console.error("Error loading decks:", error);
    }
  };

  const handleDeleteDeck = async (deckId) => {
    if (window.confirm("Delete this deck? You will not be able to recover it")) {
      try {
        await deleteDeck(deckId);
        loadDecks();
      } catch (error) {
        console.error("Error deleting deck:", error);
      }
    }
  };

  return (
    <div>
      <Link to="/decks/new" className="btn btn-secondary mb-2">Create Deck</Link>
      {decks.length === 0 ? (
        <p>No decks found. Create a new deck to get started.</p>
      ) : (
        <div>
          {decks.map((deck) => (
            <div key={deck.id} className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title">{deck.name}</h5>
                  <span className="badge">
                    {deck.cards.length} {deck.cards.length === 1 ? "card" : "cards"}
                  </span>
              </div>
                <p className="card-text">{deck.description}</p>
                <Link to={`/decks/${deck.id}`} className="btn btn-secondary mr-2">View</Link>
                <Link to={`/decks/${deck.id}/study`} className="btn btn-primary mr-2">Study</Link>
                <button className="btn btn-danger float-right" onClick={() => handleDeleteDeck(deck.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;