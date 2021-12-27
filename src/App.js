import "./index.css";
import React from "react";

function Square(props) {
  let typeClass = "";
  if (props.type === "head") {
    typeClass = "water-entry";
  } else if (props.type === "foot") {
    typeClass = "water-exit";
  }

  let className = "block-square";
  let brick = props.bricks[(props.i - 1) * props.cols + props.j - 1];
  if (brick) {
    if (brick.type === "brick") {
      className = "square";
    }
    if (brick.display !== "body") {
      className += " " + brick.display;
    }
    return (
      <button
        key={brick.id}
        data-id={brick.id}
        data-type={brick.type}
        draggable
        className={typeClass ? className + " " + typeClass : className}
        onDragStart={(event) => props.onDragStart(event, brick.id, brick.type)}
        onClick={props.onClick}
      >
        {brick.id}
      </button>
    );
  } else {
    return (
      <button className={className}>
        {""}
        {(props.i - 1) * props.rows + props.j - 1}
      </button>
    );
  }
}
function BlockRows(props) {
  let rows = [];
  for (let j = 0; j < props.rows; j++) {
    if (props.rows * (props.i - 1) + (j + 1) <= props.blocks) {
      rows.push(
        <Square
          key={"block_" + j + "_" + props.i}
          bricks={props.blockBricks}
          cols={props.cols}
          i={props.i}
          rows={props.rows}
          j={j + 1}
          blocks={props.blocks}
          onDragStart={props.onDragStart}
          onClick={props.onClick}
        />
      );
    }
  }
  return <div className="board-row">{rows}</div>;
}
function Columns(props) {
  let cols = [];
  let type = "body";
  if (props.hasOwnProperty("type")) {
    type = props.type;
  }
  for (let j = 0; j < props.cols; j++) {
    cols.push(
      <Square
        key={"brick_" + j + "_" + props.i}
        i={props.i}
        j={j + 1}
        bricks={props.bricks}
        cols={props.cols}
        onDragStart={props.onDragStart}
        type={type}
        onClick={props.onClick}
      />
    );
  }
  return <div className="board-row">{cols}</div>;
}
function Rows(props) {
  let rows = [];
  for (let i = 0; i < props.rows; i++) {
    rows.push(
      <Columns
        key={"col_" + i}
        i={i + 1}
        bricks={props.bricks}
        cols={props.cols}
        onDragStart={props.onDragStart}
      />
    );
  }
  return <>{rows}</>;
}
function BlockColumns(props) {
  let cols = [];
  for (let i = 0; i < props.cols; i++) {
    cols.push(
      <BlockRows
        key={"bcol_" + i}
        blockBricks={props.blockBricks}
        cols={props.cols}
        i={i + 1}
        rows={props.rows}
        blocks={props.blocks}
        onDragStart={props.onDragStart}
      />
    );
  }
  return <>{cols}</>;
}

class Blocks extends React.Component {
  render() {
    let rows = 0;
    let cols = 0;
    if (this.props.blocks % 2 > 0) {
      rows = (this.props.blocks - 1) / 2 + 1;
    } else {
      rows = this.props.blocks / 2;
    }
    cols = 2;
    return (
      <div className="board-column">
        <BlockColumns
          blockBricks={this.props.blockBricks}
          cols={cols}
          rows={rows}
          blocks={this.props.blocks}
          onDragStart={this.props.onDragStart}
        />
      </div>
    );
  }
}

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bricks: new Array(12)
        .fill({ type: "brick", display: "body" })
        .map((item, index) => {
          return { ...item, id: index };
        }),
      rows: 3,
      cols: 4,
      blocks: 4,
      blockBricks: new Array(4)
        .fill({ type: "block", display: "body" })
        .map((item, index) => {
          return { ...item, id: index };
        }),
      startPoint: null,
      str: ""
    };
  }

  onChangeCols = async (e) => {
    let cols = null;
    let rows = this.state.rows;
    let arry = [];
    let len = this.state.blocks;
    let blockArry = new Array(len).fill({ type: "block", display: "body" });
    blockArry = blockArry.map((item, index) => {
      return { ...item, id: index };
    });
    if (e.target.value !== "" && e.target.value > 0) {
      cols = parseInt(e.target.value, 10);
      arry = new Array(rows * cols).fill({ type: "brick", display: "body" });
      arry = await arry.map((item, index) => {
        return { ...item, id: index };
      });
    }
    this.refresh({
      cols: cols,
      bricks: arry,
      blockBricks: blockArry
    });
  };

  onChangeRows = async (e) => {
    let rows = null;
    let cols = this.state.cols;
    let brickArry = [];
    let len = this.state.blocks;
    let blockArry = new Array(len).fill({ type: "block", display: "body" });
    blockArry = blockArry.map((item, index) => {
      return { ...item, id: index };
    });
    if (e.target.value !== "" && e.target.value > 0) {
      rows = parseInt(e.target.value, 10);
      brickArry = new Array(rows * cols).fill({
        type: "brick",
        display: "body"
      });
      brickArry = await brickArry.map((item, index) => {
        return { ...item, id: index };
      });
    }
    this.refresh({
      rows: rows,
      bricks: brickArry,
      blockBricks: blockArry
    });
  };

  onChangeBlocks = async (e) => {
    let len = null;
    let blockArry = [];
    let rows = this.state.rows;
    let cols = this.state.cols;
    let brickArry = new Array(rows * cols).fill({
      type: "brick",
      display: "body"
    });
    brickArry = brickArry.map((item, index) => {
      return { ...item, id: index };
    });

    if (e.target.value !== "" && e.target.value > 0) {
      len = parseInt(e.target.value, 10);
      blockArry = new Array(len).fill({ type: "block", display: "body" });
      blockArry = await blockArry.map((item, index) => {
        return { ...item, id: index };
      });
    }
    this.refresh({
      blocks: len,
      blockBricks: blockArry,
      bricks: brickArry
    });
  };
  refresh = (items) => {
    if (Object.keys(items).length > 0) {
      this.setState({
        ...items
      });
    } else {
      this.setState({
        bricks: new Array(12)
          .fill({ type: "brick", display: "body" })
          .map((item, index) => {
            return { ...item, id: index };
          }),
        rows: 3,
        cols: 4,
        blocks: 4,
        blockBricks: new Array(4)
          .fill({ type: "block", display: "body" })
          .map((item, index) => {
            return { ...item, id: index };
          }),
        bricksHead: [],
        bricksFoot: []
      });
    }
  };
  onDragStart = (e, id, type) => {
    console.log("drag started", e.target.value, id, type);
    e.dataTransfer.setData("id", id);
    e.dataTransfer.setData("type", type);
  };
  onDragOver = (event) => {
    event.preventDefault();
  };
  onDrop = (event, cat) => {
    if (cat === "buildingBlocks") {
      let id = event.dataTransfer.getData("id");
      let type = event.dataTransfer.getData("type");
      const tid = event.target.getAttribute("data-id");
      const ttype = event.target.getAttribute("data-type");
      let bricks = this.state.bricks.map((brick) => {
        if (brick.id == tid) {
          return { id: brick.id, type: type, display: "body" };
        }
        return { id: brick.id, type: brick.type, display: "body" };
      });
      let blockBricks = this.state.blockBricks.map((brick) => {
        if (brick.id == id) {
          return { id: brick.id, type: ttype, display: "body" };
        }
        return { id: brick.id, type: brick.type, display: "body" };
      });
      // console.log(bricks, blockBricks);
      this.setState({
        ...this.state,
        blockBricks,
        bricks
      });
    }
  };

  prepareSimulation = () => {
    let cols = this.state.cols;
    this.setState({
      ...this.state,
      ...{
        bricksHead: new Array(cols)
          .fill({ type: "brick" })
          .map((item, index) => {
            return { ...item, id: index, display: "body" };
          }),
        bricksFoot: new Array(cols)
          .fill({ type: "brick" })
          .map((item, index) => {
            return { ...item, id: index, display: "body" };
          })
      }
    });
  };
  startWaterFall = (e) => {
    const tid = e.target.getAttribute("data-id");
    let startPoint = parseInt(tid, 10);
    this.startSimulation(startPoint);
  };
  hideOtherStartPoints = (startPoint) => {
    let hideOthers = this.state.bricksHead.map((brick) => {
      let id = brick.id;
      let type = brick.type;
      let display = brick.display;
      let newDisplay = "hide";
      if (id === startPoint) {
        newDisplay = display;
      }
      return { id, type, display: newDisplay };
    });
    return hideOthers;
  };
  startSimulation = (startPoint) => {
    // step1: hide other entry points
    let hideOthers = this.hideOtherStartPoints(startPoint);
    // step2 Inspect Waterflow
    let waterFlow = this.runInspection(startPoint);
    console.log(waterFlow);
    this.setState({
      bricks: waterFlow,
      bricksHead: hideOthers,
      startPoint
    });
  };
  runInspection = (startPoint) => {
    let cols = this.state.cols;
    let rows = this.state.rows;
    let bricks = this.state.bricks.map((a) => ({ ...a }));
    for (let i = 0; i < rows; i++) {
      // handling for first row
      if (i === 0) {
        if (bricks[startPoint].type === "block") {
          break;
        } else {
          // flow water in the current box
          let waterBlock = bricks.filter((brick) => {
            return brick.id === startPoint;
          });
          waterBlock[0].display = "water";
          bricks[startPoint] = waterBlock[0];
          // check if next row box is blocked
          if (bricks[cols + startPoint].type === "block") {
            // flow water in this box row in both sides if open
            // left side
            if (startPoint > 0) {
              for (let j = startPoint - 1; j >= 0; j--) {
                // flow water in the current box
                let waterBlock = bricks.filter((brick) => {
                  return brick.id === j;
                });
                waterBlock[0].display = "water";
                bricks[j] = waterBlock[0];
                // now check if can flow down
                if (bricks[cols + j].type === "block") {
                  // do nothing
                } else {
                  break;
                }
              }
            }
            // right-side
            if (startPoint < cols - 1) {
              for (let k = startPoint + 1; k < cols; k++) {
                // flow water in the current box
                let waterBlock = bricks.filter((brick) => {
                  return brick.id === k;
                });
                waterBlock[0].display = "water";
                bricks[k] = waterBlock[0];
                // now check if can flow down
                if (bricks[cols + k].type === "block") {
                  // do nothing
                } else {
                  break;
                }
              }
            }
          } else {
            // do nothing
          }
        }
      }

      // handling for mid rows
      if (i > 0 && i < rows - 1) {
        //get previous row`s first and last water blocks if more than one is there
        let prevRow = bricks.slice((i - 1) * cols, i * cols);
        let waterBricks = prevRow.filter((item) => {
          return item.display === "water";
        });
        for (let l = 0; l < waterBricks.length; l++) {
          let startPoint = cols + waterBricks[l].id;
          if (bricks[startPoint].type === "block") {
            // continue;
          } else {
            // flow water in the current box
            let waterBlock = bricks.filter((brick) => {
              return brick.id === startPoint;
            });
            if (waterBlock.length > 0) {
              waterBlock[0].display = "water";
              bricks[startPoint] = waterBlock[0];
            }

            // check if next row box is blocked
            if (bricks[cols + startPoint].type === "block") {
              // flow water in this box row in both sides if open
              //left-side
              if (startPoint >= i * cols) {
                for (let j = startPoint - 1; j >= i * cols; j--) {
                  // flow water in the current box if not a block
                  let waterBlock = bricks.filter((brick) => {
                    return brick.id === j;
                  });
                  if (bricks[j].type === "block") {
                    // do nothing
                    break; // exit current water flow to the left
                  } else {
                    //continuously flow water to left
                    waterBlock[0].display = "water";
                    bricks[j] = waterBlock[0];
                  }
                  // further
                  // str +=
                  //   "<br> ---left sideof " +
                  //   startPoint +
                  //   JSON.stringify(waterBlock);
                  // // now check if can flow down
                  // if (bricks[cols + j].type === "block") {
                  //   // do nothing
                  // } else {
                  //   break;
                  // }
                }
              }
              // right-side
              if (startPoint < (i + 1) * cols) {
                for (let k = startPoint + 1; k < (i + 1) * cols; k++) {
                  // flow water in the current box
                  let waterBlock = bricks.filter((brick) => {
                    return brick.id === k;
                  });
                  // if itself is a block then break the loop
                  if (bricks[k].type === "block") {
                    break; // exit current water flow to the left
                  } else {
                    waterBlock[0].display = "water";
                    bricks[k] = waterBlock[0];
                  }
                  // // now check if can not flow down
                  if (bricks[cols + k].type === "block") {
                    //continuously flow water to right
                  } else {
                    break;
                  }
                }
              }
            } else {
              // do nothing
            }
          }
        }
      }
      // handling for last row
      if (i === rows - 1) {
        let prevRow = bricks.slice((i - 1) * cols, i * cols);
        let waterBricks = prevRow.filter((item) => {
          return item.display === "water";
        });
        for (let l = 0; l < waterBricks.length; l++) {
          let startPoint = cols + waterBricks[l].id;
          if (bricks[startPoint].type === "block") {
            // continue;
          } else {
            // flow water in the current box
            let waterBlock = bricks.filter((brick) => {
              return brick.id === startPoint;
            });
            if (waterBlock.length > 0) {
              waterBlock[0].display = "water";
              bricks[startPoint] = waterBlock[0];
            }
          }
        }
      }
    } // end for
    return bricks;
  };
  render() {
    let blocks = this.state.blocks;
    let bricks = this.state.bricks;
    let blockBricks = this.state.blockBricks;
    let BuildingBlocks = <div></div>;
    for (let i = 0; i < this.state.rows; i++) {
      BuildingBlocks = (
        <div className="board-column">
          <Rows
            bricks={bricks}
            cols={this.state.cols}
            rows={this.state.rows}
            onDragStart={this.onDragStart}
          />
        </div>
      );
    }
    let bricksHead = this.state.bricksHead;
    let brickHeader = bricksHead ? (
      <Columns
        i={1}
        bricks={bricksHead}
        cols={this.state.cols}
        type={"head"}
        onClick={this.startWaterFall}
      />
    ) : null;
    let bricksFoot = this.state.bricksFoot;
    let brickFooter = bricksFoot ? (
      <Columns i={1} bricks={bricksFoot} cols={this.state.cols} type={"foot"} />
    ) : null;
    return (
      <div>
        <div className={"prev"}>
          {brickHeader}
          <div className="game">
            <div
              className="game-board"
              onDragOver={(event) => this.onDragOver(event)}
              onDrop={(event) => {
                this.onDrop(event, "buildingBlocks");
              }}
            >
              {BuildingBlocks}
            </div>
          </div>
          {brickFooter}
        </div>
        <div className={"next"}>
          <div className="game-info">
            Columns:{" "}
            <input
              type="text"
              value={this.state.cols}
              onChange={this.onChangeCols}
            />
            <div>
              Rows:{" "}
              <input
                type="text"
                value={this.state.rows}
                onChange={this.onChangeRows}
              />
            </div>
            <div>
              Blocks:{" "}
              <input
                type="text"
                value={this.state.blocks}
                onChange={this.onChangeBlocks}
              />
            </div>
            <div
              className="block-board"
              onDragOver={(event) => this.onDragOver(event)}
              onDrop={(event) => this.onDrop(event, "Done")}
            >
              <Blocks
                blocks={blocks}
                blockBricks={blockBricks}
                onDragStart={this.onDragStart}
              />
            </div>
            <div>
              <button
                type="text"
                // value={this.state.blocks}
                onClick={this.prepareSimulation}
              >
                Start Simulation
              </button>
            </div>
            {/* {this.state.str} */}
          </div>
        </div>
      </div>
    );
  }
}
