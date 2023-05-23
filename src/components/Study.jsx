import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { readDeck } from "../utils/api";

function Study() {
  const history = useHistory();
  const { deckId } = useParams();
  const [deck, setDeck] = useState({});
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

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

  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextCard = () => {
    if (cardIndex + 1 < deck.cards.length) {
      setCardIndex(cardIndex + 1);
      setIsFlipped(false);
    } else {
      const restart = window.confirm(
        "Restart the deck? Click 'Cancel' to return to the home screen."
      );
      if (restart) {
        setCardIndex(0);
        setIsFlipped(false);
      } else {
        history.push("/");
      }
    }
  };

  if (!deck.id) {
    return <p>Loading...</p>;
  }

  if (deck.cards.length <= 2) {

    const cardCountText =
      deck.cards.length === 1 ? "is 1 card" : `are ${deck.cards.length} cards`;

    return (
      <div>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item" aria-current="page">
              <Link to={`/decks/${deckId}`}>{deck.name}</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Study
            </li>
          </ol>
        </nav>
        <h2>{deck.name}: Study</h2>
        <h3>Not enough Cards</h3>
        <p>
          {`You need at least 3 cards to study. There ${cardCountText} in this deck.`}
        </p>
        <Link to={`/decks/${deck.id}/cards/new`} className="btn btn-primary">
          Add Cards
        </Link>
      </div>
    );
  }

  const currentCard = deck.cards[cardIndex];

  return (
    <div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item" aria-current="page">
            <Link to={`/decks/${deckId}`}>{deck.name}</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Study
          </li>
        </ol>
      </nav>
      <h2>{deck.name}: Study</h2>
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">
            Card {cardIndex + 1} of {deck.cards.length}
          </h4>
          <p className="card-text">{isFlipped ? currentCard.back : currentCard.front}</p>
          {!isFlipped && (
            <button className="btn btn-secondary" onClick={handleFlipCard}>
              Flip
            </button>
          )}
          {isFlipped && (
            <div>
              <button className="btn btn-secondary mr-2" onClick={handleFlipCard}>
                Flip
              </button>
              <button className="btn btn-primary" onClick={handleNextCard}>
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Study;
