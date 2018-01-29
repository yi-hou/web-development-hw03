import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';
import LetterCache from "./LetterCache.js";

export default function run_demo(root) {
  ReactDOM.render(<Memory />, root);
}


class Memory extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialDefaultState();

    this.letterCache = new LetterCache();
    this.letterCache.randomGenerate();
  }

  initialDefaultState() {
    let itemState = new Array(16);

    for (let i = itemState.length - 1; i >= 0; i--) {
      itemState[i] = false;
    }

    return {
      itemState: itemState,
      showArray: new Array(16),
      clickLock: false,
      numberofClick: 0
    };
  }

  itemClick(index) {
    if (this.state.clickLock) {
      // click lock,wait for 1 second
      return;
    }

    let result = this.letterCache.handleClick(index, this.state.showArray);

    console.log(result);

    // handle result
    if (!result.didMatch && !result.doTimeout) {
      // first tile clicked or same tile clicked
      this.setState({
        showArray: result.showArray,
        numberofClick: this.state.numberofClick + 1
      });
    } else if (result.didMatch) {
      // did mtach
      let nextItemState = this.state.itemState;
      nextItemState[result.preIndex] = true;
      nextItemState[result.nextIndex] = true;

      this.setState({
        showArray: result.showArray,
        itemState: nextItemState,
        numberofClick: this.state.numberofClick + 1
      });
    } else {
      // not match
      this.setState({
        showArray: result.showArray,
        clickLock: true,
        numberofClick: this.state.numberofClick + 1
      });

      let nextShowArray = result.showArray.slice(0); // show after timeout
      nextShowArray[result.preIndex] = null;
      nextShowArray[result.nextIndex] = null;

      setTimeout(() => {
        this.setState({
          showArray: nextShowArray,
          clickLock: false
        });
      }, result.timeout);
    }
  }

  restartClick = () => {
    this.setState(this.initialDefaultState);

    this.letterCache = new LetterCache();
    this.letterCache.randomGenerate();
  };

  render() {
    return (
      <div className="Memory">
        <div className="pair-wrapper">
          <ul className="pair">{this.create_dom()}</ul>
          <footer>
            <div className="clicksNum-wrapper">
              <label htmlFor="clicksNum-text" className="clicksNum-label">
                Clicks:
              </label>
              <span className="clicksNum-text">{this.state.numberofClick}</span>
            </div>
            <div className="buttons-wrapper">
              <button id="restart" onClick={this.restartClick}>
                Restart
              </button>
            </div>
          </footer>
        </div>
      </div>
    );
  }

  create_dom() {
    let row_Dom = [];

    for (let i = 0; i < 4; i++) {
      row_Dom.push(
        <li className="pair-row" key={"row-" + i}>
          <ul className="row">{create_items.call(this, i)}</ul>
        </li>
      );
    }

    return row_Dom;

    function create_items(i) {
      let item_Dom = [];

      for (let j = i * 4; j < (i + 1) * 4; j++) {
        if (this.state.itemState[j]) {
          item_Dom.push(
            <li className="pair-item" key={"item-" + j}>
              <span className="item-text">{this.state.showArray[j]}</span>
            </li>
          );
        } else {
          item_Dom.push(
            <li
              className="pair-item"
              onClick={this.itemClick.bind(this, j)}
              key={"item-" + j}
            >
              <span className="item-text">{this.state.showArray[j]}</span>
            </li>
          );
        }
      }
      return item_Dom;
    }
  }
}

