// decks.component.ts
import { Props, Prop, JSX, Component, State } from "1car.us";
import { Deck as Decktype } from "./models";
import { chamoy } from "chamoy";

export class Deck {
  @Prop deck: Decktype | null;
  @Prop rename_deck: Function;
  @Prop delete_deck: Function;

  share() {
    alert("Share!");
  }

  render() {
    const deck = this?.deck;

    return (
      <div className="deck" id={deck.id}>
        <p className="title">
          <a
            className="title-link"
            href={String(`/pages/flashcards.html?deck=${deck.id}`)}
          >
            {String(deck.title)}
          </a>
        </p>

        <div className="dropdown">
          <button className="dropbtn">Actions</button>
          <div className="dropdown-content">
            <a
              href="#"
              id="rename"
              onclick={() =>
                //@ts-ignore
                window.openModal("rename_deck", deck.id, this.rename_deck)
              }
            >
              Rename
            </a>
            <a href="#" id="share" onclick={() => this.share()}>
              Share
            </a>
            <a
              href="#"
              id="delete"
              //@ts-ignore
              onclick={() => window.deleteDeck(deck.id, this.delete_deck)}
            >
              Delete
            </a>
          </div>
        </div>
      </div>
    );
  }
}

// deck-list.ts
@Component({
  tag: "deck-list",
  shadow: true,
  styleUrl: "./components/decks.css",
})
@Props(["decks"])
export class DeckList extends HTMLElement {
  @Prop decks: any[];
  @State fetchedDecks: any[];
  @State database;

  constructor() {
    super();
    this.fetchAndRenderDecks();
  }

  async saveToDb(data, callback) {
    const props = {
      databaseName: "FlashDatabase",
      objectStoreName: "DeckStore",
      indexName: "DeckIndex",
      indexArr: ["deck.id"],
      keyPath: "id",
    };

    this.database = new chamoy(props);

    await this.database.put(data, (res) => {
      callback(res);
    });
  }

  async fetchAndRenderDecks() {
    try {
      const database = new chamoy({
        databaseName: "FlashDatabase",
        objectStoreName: "DeckStore",
        indexName: "DeckIndex",
        indexArr: ["deck.id"],
        keyPath: "id",
      });

      let decks = [];

      await database.getAll((res) => {
        console.log(res);
        res && (decks = res);
      });

      const jsx = this.renderDecks(decks);

      this.shadowRoot.appendChild(jsx);

      this.fetchedDecks = decks;

      // @ts-ignore
      const state = window.globalState.decks;
      // @ts-ignore
      window.globalState.decks = [...state, ...decks];
    } catch (error) {
      console.error("Error fetching decks:", error);
    }
  }

  async renameDeck(deck: Decktype) {
    // @ts-ignore
    const database = new chamoy({
      databaseName: "FlashDatabase",
      objectStoreName: "DeckStore",
      indexName: "DeckIndex",
      indexArr: ["deck.id"],
      keyPath: "id",
    });

    await database.put({ ...deck }, (res) => {});
  }

  async deleteDeck(deckId) {
    // @ts-ignore
    const database = new chamoy({
      databaseName: "FlashDatabase",
      objectStoreName: "DeckStore",
      indexName: "DeckIndex",
      indexArr: ["deck.id"],
      keyPath: "id",
    });

    await database.delete(
      // @ts-ignore
      { key: deckId },
      (res) => {}
    );
  }

  renderDecks(decks) {
    const deckFragment = document.createDocumentFragment();

    decks.forEach((deck) => {
      const item = new Deck();
      item.deck = deck;
      item.rename_deck = this.renameDeck;
      item.delete_deck = this.deleteDeck;
      const jsx = item.render();
      deckFragment.appendChild(jsx);
    });

    return deckFragment;
  }

  render() {
    // @ts-ignore
    const decks = window.globalState.decks;

    if (decks) {
      if (decks.length) {
        const jsx = this.renderDecks(decks);
        return jsx;
      } else return <div></div>;
    } else {
      return <div></div>;
    }
  }
}

export default DeckList;
