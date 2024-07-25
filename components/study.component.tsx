// components/study-list.ts
import { Component, State, JSX, Prop } from "1car.us";
import { Flashcard } from "models";
import { chamoy } from "chamoy";

export class StudyCard {
  @Prop card: Flashcard | null;
  @Prop update_card: Function;
  @Prop delete_card: Function;
  @Prop on_respond: Function;
  @Prop rerender: Function;
  @State isFlipped: boolean = false;

  share() {
    alert("Share!");
  }

  respond(response: string) {
    this.on_respond(response);
  }

  flipCard() {
    this.isFlipped = !this.isFlipped;
    const flashcard = document
      .querySelector(".study-component")
      .shadowRoot.querySelector(".flashcard");
    if (this.isFlipped) {
      flashcard.classList.remove("flip");
    } else flashcard.classList.add("flip");
  }

  editCard() {
    const flashcard = document
      .querySelector(".study-component")
      .shadowRoot.querySelector(".flashcard");

    const frontContent = this.card.front;
    const backContent = this.card.back;

    const newFrontContent = prompt(
      "Enter new content for the front of the flashcard:",
      frontContent
    );
    flashcard.querySelector(".front").textContent = newFrontContent;

    const newBackContent = prompt(
      "Enter new content for the back of the flashcard:",
      backContent
    );
    flashcard.querySelector(".back").textContent = newBackContent;

    if (newFrontContent !== null && newBackContent !== null) {
      this.card.front = newFrontContent;
      this.card.back = newBackContent;
    }
  }

  render() {
    const card = this?.card;

    return (
      <div className="flashcard-container">
        <div className={this.isFlipped ? "flashcard flip" : "flashcard"}>
          <div className="front">{this.card.front}</div>
          <div className="back">
            <div className="content">{this.card.back}</div>
            <div className="answers-btns">
              <button id="again-btn" onclick={() => this.respond("again")}>
                Again
              </button>
              <button id="hard-btn" onclick={() => this.respond("hard")}>
                Hard
              </button>
              <button id="good-btn" onclick={() => this.respond("good")}>
                Good
              </button>
              <button id="easy-btn" onclick={() => this.respond("easy")}>
                Easy
              </button>
            </div>
          </div>
        </div>
        <div className="buttons">
          <button id="edit-btn" onclick={() => this.editCard()}>
            Edit
          </button>
          <button id="btn" onclick={() => this.flipCard()}>
            Flip
          </button>
        </div>
      </div>
    );
  }
}

@Component({
  tag: "study-component",
  shadow: true,
  styleUrl: "../components/study.css",
})
export class Study extends HTMLElement {
  @State cards: Flashcard[];
  @State currentCardIndex: number = 0;

  constructor() {
    super();
    // Initialize the user data
    this.cards = [];

    // Fetch and render users
    this.fetchAndRenderCardsByDeck(this.getQueryParameters("deck"));
  }

  getQueryParameters(str) {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get(str);
    return myParam;
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
      await database.get({ key, id: key }, (res) => {
        if (res && res.cards.length > 0) {
          this.cards = res.cards;
        }
      });
      const jsx = this.renderStudyCard();
      const div = document.createElement("div");
      div.id = "study-container";
      div.appendChild(jsx);
      this.shadowRoot.appendChild(div);
    } catch (error) {
      console.error("Error fetching decks:", error);
    }
  }

  handleRespond(response: string) {
    // Handle response logic here, e.g., adjust flashcard repetition state based on response

    // Move to the next flashcard
    this.currentCardIndex = this.currentCardIndex + 1;
    // this.flipCard();

    // Check if there are more flashcards
    if (this.currentCardIndex < this.cards.length) {
      const jsx = this.renderStudyCard();
      this.rerender(jsx);
    } else {
      // No more flashcards, reset to initial state
      this.currentCardIndex = 0;
      this.shadowRoot.innerHTML = "";
    }
  }

  renderStudyCard() {
    const currentCard = this.cards[this.currentCardIndex];
    const cardFragment = document.createDocumentFragment();

    const item = new StudyCard();
    item.card = currentCard;
    item.on_respond = (response: string) => this.handleRespond(response);
    item.rerender = this.renderStudyCard;
    const jsx = item.render();
    cardFragment.appendChild(jsx);

    const div = document.createElement("div");
    div.id = "study-container";
    div.appendChild(cardFragment);

    return div;
  }

  rerender(jsx) {
    const style = this.shadowRoot.querySelector("style");
    this.shadowRoot.innerHTML = "";
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(jsx);
  }
}

export default Study;
