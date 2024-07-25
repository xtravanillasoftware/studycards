// modal.component.tsx
import { Props, Prop, JSX, Component, State } from "1car.us";
import { chamoy } from "chamoy";

@Component({
  tag: "icarus-modal",
  shadow: true,
  styleUrl: "./components/modal.css",
})
@Props(["open", "mode", "callback"])
export class Modal extends HTMLElement {
  @Prop open: string;
  @Prop mode: "rename_deck" | "add_deck";
  @State private deckName: string;

  close() {
    // @ts-ignore
    window.closeModal();
  }

  submit(event: PointerEvent) {
    event.preventDefault();
    // @ts-ignore
    window.handleFormSubmission(this.deckName, this.mode);
  }

  render() {
    return (
      <div id={this.open === "true" ? "modal" : "myModal"} className="modal">
        <div className="modal-content">
          <span className="close" onclick={(el: HTMLElement) => this.close()}>
            &times;
          </span>
          <h2 id="modalTitle">
            {this.mode === "add_deck" ? "Add New Deck" : "Rename Deck"}
          </h2>
          <form id="deckForm">
            <label for="deckName">Name:</label>
            <input
              type="text"
              id="deckName"
              name="deckName"
              required
              onchange={(event) => (this.deckName = event.target.value)}
            />
            <button
              id="submitBtn"
              type="submit"
              onclick={(event: PointerEvent) => this.submit(event)}
            >
              {this.mode === "add_deck" ? "Add Deck" : "Rename Deck"}
            </button>
          </form>
        </div>
      </div>
    );
  }
}
