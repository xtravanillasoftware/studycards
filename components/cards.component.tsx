// card.component.ts
import { Props, Prop, JSX, Component, State } from "1car.us";
import { Flashcard } from "./models";
import { chamoy } from "chamoy";

export class Card {
  @Prop card: Flashcard | null;
  @Prop update_card: Function;
  @Prop delete_card: Function;

  share() {
    alert("Share!");
  }

  toggleFlip(event) {
    event.currentTarget.classList.toggle("flip");
  }

  handleDeleteCard(event) {
    event.stopPropagation();
    if (this.card && this.delete_card) {
      this.delete_card(this.card.id);
    }
  }

  async editCard(event, isFront: boolean) {
    event.stopPropagation();
    await window.editCardContent(
      event.target,
      this.card.id,
      isFront,
      this.update_card
    );
  }

  render() {
    const card = this?.card;

    return (
      <div className="flashcard" onclick={(event) => this.toggleFlip(event)}>
        <div className="front">
          <p onclick={(event) => this.editCard(event, true)}>{card.front}</p>
        </div>
        <div className="back">
          <p onclick={(event) => this.editCard(event, false)}>{card.back}</p>
        </div>
        <button
          className="delete-button"
          onclick={(event) => this.handleDeleteCard(event)}
        >
          &#128465;
        </button>
      </div>
    );
  }
}

// card-list.ts
@Component({
  tag: "card-list",
  shadow: true,
  styleUrl: "../components/cards.css",
})
@Props(["cards"])
export class CardList extends HTMLElement {
  @Prop cards: any[] = [];
  @State fetchedCards: any[] = [];
  @State deck: any[] = [];

  constructor() {
    super();
    this.fetchAndRenderCardsByDeck(getQueryParameters("deck"));
  }

  saveFlashcards(cards: any[]) {
    const database = new chamoy({
      databaseName: "FlashDatabase",
      objectStoreName: "DeckStore",
      indexName: "DeckIndex",
      indexArr: ["deck.id"],
      keyPath: "id",
    });

    const deckId = getQueryParameters("deck");

    database.update(
      {
        key: deckId,
        id: deckId,
        cards,
      },
      (res) => {
        console.log(res);
      }
    );
  }

  async fetchAndRenderCardsByDeck(key: string) {
    try {
      const database = new chamoy({
        databaseName: "FlashDatabase",
        objectStoreName: "DeckStore",
        indexName: "DeckIndex",
        indexArr: ["deck.id"],
        keyPath: "id",
      });

      let cards = [];

      await database.get({ key }, (res) => {
        if (res && res.cards.length > 0) {
          cards = [...res.cards, ...JSON.parse(this.cards)];
          this.fetchedCards = cards;
          window.globalState.cards = cards;
        }
      });

      const jsx = this.renderCards(cards);
      const div = document.createElement("div");
      div.id = "flashcard-container";
      div.appendChild(jsx);
      this.shadowRoot.appendChild(div);
    } catch (error) {
      console.error("Error fetching decks:", error);
    }
  }

  updateCardsByDeck(cards) {
    const database = new chamoy({
      databaseName: "FlashDatabase",
      objectStoreName: "DeckStore",
      indexName: "DeckIndex",
      indexArr: ["deck.id"],
      keyPath: "id",
    });

    const id = getQueryParameters("deck");

    database.update({ key: id, id, cards }, (res) => {
      // console.log(res);
    });
  }

  async deleteCard(cardId) {
    await window.deleteFlashcard(cardId);
    this.deck = window.globalState.cards;
    const database = new chamoy({
      databaseName: "FlashDatabase",
      objectStoreName: "DeckStore",
      indexName: "DeckIndex",
      indexArr: ["deck.id"],
      keyPath: "id",
    });

    const id = getQueryParameters("deck");

    database.update({ key: id, id, cards: this.deck }, (res) => {
      // console.log(res);
    });
  }

  renderCards(cards) {
    const cardFragment = document.createDocumentFragment();

    cards.forEach((card) => {
      const item = new Card();
      item.card = card;
      item.update_card = this.updateCardsByDeck;
      item.delete_card = this.deleteCard;
      const jsx = item.render();
      cardFragment.appendChild(jsx);
    });

    return cardFragment;
  }

  render() {
    const cards = [
      // ...(this.fetchedCards ?? []),
      // ...(JSON.parse(this.cards) ?? []),
      ...window.globalState.cards,
    ];
    this.deck = cards;

    if (this.deck) {
      if (this.deck.length > 0) {
        const jsx = this.renderCards(this.deck);
        this.saveFlashcards(this.deck);
        return <div id="flashcard-container">{jsx}</div>;
      } else return <div></div>;
    } else {
      return <div></div>;
    }
  }
}

function getQueryParameters(str) {
  const urlParams = new URLSearchParams(window.location.search);
  const myParam = urlParams.get(str);
  return myParam;
}

export default CardList;
