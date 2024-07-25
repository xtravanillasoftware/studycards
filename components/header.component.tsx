// header.component.ts
import { Props, Prop, JSX, Component } from "1car.us";
import { Deck as Decktype } from "./models";
import { chamoy } from "chamoy";

@Component({
  tag: "header-component",
  shadow: true,
  styleUrl: "../components/header.css",
})
@Props(["add_flashcard"])
export class Header extends HTMLElement {
  @Prop add_flashcard: string;

  add_deck(deck: Decktype) {
    const database = new chamoy({
      databaseName: "FlashDatabase",
      objectStoreName: "DeckStore",
      indexName: "DeckIndex",
      indexArr: ["deck.id"],
      keyPath: "id",
    });

    database.put({ key: deck.id, ...deck }, (res) => {
      console.log(res);
    });
  }

  getQueryParameters(str) {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get(str);
    return myParam;
  }

  render() {
    const query_param = this.getQueryParameters("deck");
    eval(this.add_flashcard);

    if (typeof query_param === "string") {
      return (
        <nav className="toolbar">
          <ul>
            <li>
              <button>
                <a href="/">Back</a>
              </button>
            </li>

            <li>
              <button onclick={() => createFlashcard()}>Add</button>
            </li>

            <li>
              <button>
                <a href={`/pages/study.html?deck=${query_param}`}>Study</a>
              </button>
            </li>
          </ul>
        </nav>
      );
    } else
      return (
        <nav className="toolbar">
          <ul>
            <li>
              <button
                onclick={() =>
                  //@ts-ignore
                  window.openModal("add_deck", null, this.add_deck)
                }
              >
                Add
              </button>
            </li>
          </ul>

          {/* <button onclick="showStats()">Stats</button>

        <button id="searchButton" onclick="replaceWithSearchBar()">
          Search
        </button> */}

          {/* <div id="searchBar" className="search-bar" style="display: none">
          <input type="text" id="searchInput" placeholder="Search..." />
          <button id="clearSearch" onclick="search()">
            &#128269;
          </button>
          <button onclick="hideSearchBar()">&times;</button>
        </div> */}
        </nav>
      );
  }
}

export default Header;
