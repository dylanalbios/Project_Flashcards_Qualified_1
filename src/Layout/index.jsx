import React from "react";
import { Route, Switch } from "react-router-dom";
import Header from "./Header";
import NotFound from "./NotFound";
import Home from "../components/Home"
import Study from "../components/Study";
import CreateDeck from "../components/CreateDeck";
import Deck from "../components/Deck"
import EditDeck from "../components/EditDeck"
import AddCard from "../components/AddCard"
import EditCard from "../components/EditCard"


function Layout() {
  return (
    <>
      <Header />
      <div className="container">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/decks/:deckId/study" component={Study} />
          <Route exact path="/decks/new" component={CreateDeck} />
          <Route exact path="/decks/:deckId" component={Deck} />
          <Route exact path="/decks/:deckId/edit" component={EditDeck} />
          <Route exact path="/decks/:deckId/cards/new" component={AddCard} />
          <Route exact path="/decks/:deckId/cards/:cardId/edit" component={EditCard} />
          {/* Add other routes for other components */}
          <Route component={NotFound} />
        </Switch>
      </div>
    </>
  );
}

export default Layout;
