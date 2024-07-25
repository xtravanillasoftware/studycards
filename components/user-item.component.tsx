// components/user-item.ts
import { Props, Prop, State, JSX } from "1car.us";

@Props(["user"])
export class UserItem {
  @Prop user: { name: string; id: number } | null;
  @State private count: number = 0;

  increment(el) {
    this.count = this.count + 1;
    el.srcElement.innerText = this.count;
  }

  renderItems() {
    const userName = this?.user?.name;

    if (userName) {
      return (
        <li
          id="user-item"
          className="user-item"
          style={{
            margin: "10px 0",
            border: "1px solid #ddd",
            padding: "10px",
          }}
        >
          {userName || "Loading..."}
        </li>
      );
    }
  }

  render() {
    return (
      <div>
        {this.renderItems()}

        <button id="incrementButton" onclick={(el) => this.increment(el)}>
          {String(this.count)}
        </button>
      </div>
    );
  }
}

export default UserItem;
