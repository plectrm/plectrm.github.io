/**
 * StaveBox - Web demo version
 * Stripped-down version for browser demo
 * Removed: Popover, ConfirmationDialog, staveTuning, context menus
 * Kept: staveGrid with all keyboard/cell editing logic, staveEnd (without popover)
 */

import { DragHandle } from "./dragHandle.js";

export class StaveBox {
  static displayName = 'staveBox';

  /**
   * Creates a staveBox.
   * @param {Object} workspace - The parent workspace for the staveBox.
   * @param {string[]} tuning - The staveBox's initial tuning.
   * @param {object} [staveBoxOptions] - Optional staveBox options.
   * @param {number} [staveBoxOptions.length] - Length of staveBox.
   * @param {[]} [staveBoxOptions.clonedCellArray] - Array of cell values to copy from.
   */
  constructor(workspace, tuning = ['E', 'A', 'D', 'G', 'B', 'e'], staveBoxOptions = { length: 24, clonedCellArray: [] }) {
    const options = staveBoxOptions;
    this.parentWorkspace = workspace;

    /** @member {Object} el - Contains all HTML Elements associated with this object */
    this.el = {};

    this.tuning = tuning;

    this.el.baseContainer = document.createElement('div');
    this.el.baseContainer.classList.add('prototypeContainer', 'stave');
    this.parentWorkspace.el.appendChild(this.el.baseContainer);

    this.el.contextMenu = new DragHandle(this, this.parentWorkspace);
    this.el.baseContainer.appendChild(this.el.contextMenu);

    this.el.staveBox = document.createElement('div');
    this.el.staveBox.classList.add('staveBox');
    this.el.baseContainer.appendChild(this.el.staveBox);

    // Create simple tuning display (no interactive staveTuning)
    this.el.staveTuningContainer = document.createElement('div');
    this.el.staveTuningContainer.classList.add('staveTuningContainer');
    this.el.staveBox.appendChild(this.el.staveTuningContainer);
    this._updateTuningDisplay();

    /** @member {Object[][]} cellArray - A 2d array containing all the staveBox's grid's values and indexes. */
    this.cellArray = initCellArray(options.length, tuning.length, options.clonedCellArray);

    /** @member {number} length - Length of the staveBox's grid */
    this.length = this.cellArray[0].length;

    this.el.staveBoxGrid = document.createElement('div');
    this.el.staveBoxGrid.classList.add('staveGrid');
    this.el.staveBox.appendChild(this.el.staveBoxGrid);

    this.staveGrid = new staveGrid(this, this.cellArray);

    // Create staveEnd (resize handle) - no popover, just drag functionality
    this.staveEnd = new StaveEnd(this);
  }

  /**
   * Returns the root element of this component.
   * @returns {HTMLDivElement}
   */
  getRootContainer() {
    return this.el.baseContainer;
  }

  /**
   * Updates the tuning display (static, no editing in demo)
   * @private
   */
  _updateTuningDisplay() {
    this.el.staveTuningContainer.textContent = '';
    const hasAccidentals = /[#b]/.test(this.tuning);
    for (let i = this.tuning.length - 1; i >= 0; i--) {
      const stringTuning = this.tuning[i];
      let labelText;
      if ((stringTuning.length > 1) || !hasAccidentals) {
        labelText = `${this.tuning[i]}|`;
      } else {
        labelText = `${this.tuning[i]} |`;
      }
      const textContainer = document.createElement('div');
      textContainer.style.whiteSpace = 'nowrap';
      textContainer.textContent = labelText;
      this.el.staveTuningContainer.appendChild(textContainer);
    }
  }

  /**
   * Clears all cells in the staveGrid, resetting them to the default value.
   */
  clearGrid() {
    for (let row = 0; row < this.cellArray.length; row++) {
      for (let col = 0; col < this.cellArray[row].length; col++) {
        this.cellArray[row][col].value = '-';
      }
    }
    this.staveGrid.redrawGrid();
  }

  decPositionInWorkspace() {
    const index = this.parentWorkspace.ChildObjects.indexOf(this);
    if (index > 0) {
      this.parentWorkspace.ChildObjects.splice(index, 1);
      this.parentWorkspace.ChildObjects.splice(index - 1, 0, this);
    }
  }

  incPositionInWorkspace() {
    const index = this.parentWorkspace.ChildObjects.indexOf(this);
    if (index < this.parentWorkspace.ChildObjects.length - 1) {
      this.parentWorkspace.ChildObjects.splice(index, 1);
      this.parentWorkspace.ChildObjects.splice(index + 1, 0, this);
    }
  }

  /**
   * Removes this staveBox from the workspace and cleans up DOM elements.
   */
  remove() {
    const index = this.parentWorkspace.ChildObjects.indexOf(this);
    if (index > -1) {
      this.parentWorkspace.ChildObjects.splice(index, 1);
    }
    this.el.baseContainer.remove();
  }

  /**
   * Parses the staveBox contents into a formatted string for export.
   * @returns {string} The parsed string representation.
   */
  parseStringContents() {
    const tuning = this.tuning;
    let textBuffer = ``;
    let hasAccidentals = /[#b]/.test(tuning);

    for (let row = 0; row < tuning.length; row++) {
      const stringLabel = tuning[tuning.length - (row + 1)];
      if ((stringLabel.length > 1) || !hasAccidentals) {
        textBuffer += `${stringLabel}|`;
      } else {
        textBuffer += `${stringLabel} |`;
      }
      const cellRow = this.cellArray[row];
      cellRow.forEach((cell) => {
        textBuffer += cell.value;
      });
      textBuffer += '|\n';
    }

    return textBuffer;
  }
}

/**
 * Direction enum for grid navigation
 */
const Direction = Object.freeze({
  Vertical: Symbol("vertical"),
  Horizontal: Symbol("horizontal")
});

/**
 * Initialises an array of cells to store staveBox values.
 * @param {number} x - Column count.
 * @param {number} y - Row count.
 * @param {[[{value: string, idx: number}]]} cloneArray - Two dimensional array of cell values to copy from.
 */
function initCellArray(x, y, cloneArray = false) {
  const cellArray = [];
  if (!cloneArray || cloneArray.length < 1) {
    for (let row = 0; row < y; row++) {
      const rowArray = [];
      for (let col = 0; col < x; col++) {
        const idx = (x * row) + col;
        const value = '-';
        rowArray.push({ idx: idx, value: value });
      }
      cellArray.push(rowArray);
    }
  } else {
    cloneArray.forEach((row, yIdx) => {
      const rowArray = [];
      row.forEach((cell, xIdx) => {
        const idx = (yIdx * cloneArray[0].length) + xIdx;
        let value;
        if (typeof cell !== 'object') {
          value = '-';
        } else {
          value = cell.value !== undefined ? cell.value : '-';
        }
        rowArray.push({ idx: idx, value: value });
      });
      cellArray.push(rowArray);
    });
  }
  return cellArray;
}

/**
 * The grid of cells which makes up the main contents of a staveBox.
 * @param {StaveBox} stavebox - staveBox object to bind to.
 * @param {Object[][]} cellArray - 2D array of cell data.
 */
class staveGrid {
  constructor(stavebox, cellArray) {
    /** @member {Object} el - Contains all HTML Elements associated with this object */
    this.el = {};

    /** @member {Object} state - Contains attributes pertaining to the current state */
    this.state = {
      focus: false,
      activeCell: { x: 0, y: 0 },
      inputDirection: Direction.Horizontal,
      lastClicked: { x: 0, y: 0 }
    };

    this.staveBox = stavebox;
    this.parentWorkspace = stavebox.parentWorkspace;

    this.el.baseContainer = this.staveBox.el.staveBoxGrid;

    // Create text node for grid content
    let gridContent = "";
    cellArray.forEach((row) => {
      row.forEach(cell => {
        gridContent += cell.value;
      });
      gridContent += `\n`;
    });
    this.el.baseContainer.textContent = gridContent;

    this.el.hoverHighlight = document.createElement('div');
    this.el.hoverHighlight.classList.add('cellHighlight');
    this.el.baseContainer.appendChild(this.el.hoverHighlight);

    this.el.directionHighlight = document.createElement('div');
    this.el.directionHighlight.classList.add('cellDirection');
    this.el.baseContainer.appendChild(this.el.directionHighlight);

    this.el.activeHighlight = document.createElement('div');
    this.el.activeHighlight.classList.add('cellActive');
    this.el.baseContainer.appendChild(this.el.activeHighlight);

    // handle hover events
    this.el.baseContainer.addEventListener('mousemove', (event) => {
      if (event.target !== this.el.baseContainer) { return; }
      const position = {
        x: Math.min(Math.trunc(Math.max(event.offsetX, 0) / (this.parentWorkspace.emSize.width * 1.015)), this.staveBox.cellArray[0].length - 1),
        y: Math.min(Math.trunc(Math.max(event.offsetY, 0) / (this.parentWorkspace.emSize.height * 1.05)), this.staveBox.cellArray.length - 1)
      };

      this.el.hoverHighlight.style.transform = `translate(${position.x * (this.parentWorkspace.emSize.width * 1.015)}px, ${position.y * (this.parentWorkspace.emSize.height * 1.015)}px)`;
    });

    // handle click events
    this.el.baseContainer.addEventListener('mousedown', (event) => {
      if (event.target !== this.el.baseContainer) { return; }

      // left click
      if (event.button === 0) {
        event.preventDefault();
        const position = {
          x: Math.min(Math.trunc(Math.max(event.offsetX, 0) / (this.parentWorkspace.emSize.width * 1.015)), this.staveBox.cellArray[0].length - 1),
          y: Math.min(Math.trunc(Math.max(event.offsetY, 0) / (this.parentWorkspace.emSize.height * 1.05)), this.staveBox.cellArray.length - 1)
        };

        this.state.activeCell = position;
        this.state.focus = true;

        // consecutive clicks on the same cell changes input direction
        if ((this.state.activeCell.x === this.state.lastClicked.x) && (this.state.activeCell.y === this.state.lastClicked.y)) {
          this.state.inputDirection = this.state.inputDirection == Direction.Vertical ? Direction.Horizontal : Direction.Vertical;
        }

        this.draw();
        Object.assign(this.state, { lastClicked: { x: position.x, y: position.y } });
      }
    });

    document.body.addEventListener('mousedown', (event) => {
      if (this.el.baseContainer.contains(event.target)) { return; }
      this.state.focus = false;
      this.draw();
    });

    // handle keyboard events
    document.body.addEventListener('keydown', (event) => {
      if (!this.state.focus) { return; }
      event.preventDefault();

      const key = event.code;

      if (key === 'Space') {
        // switch input direction
        this.state.inputDirection = this.state.inputDirection == Direction.Vertical ? Direction.Horizontal : Direction.Vertical;
      } else if (key === 'Backspace') {
        this.setCell(this.state.activeCell.x, this.state.activeCell.y, '-');

        // holding alt while backspacing should not move pointer
        if (!event.altKey) { this.retreatPointer(); }

      } else if (key.includes('Arrow')) {
        // move pointer
        const previousInputDirection = this.state.inputDirection;
        switch (key) {
          case "ArrowUp":
            this.state.inputDirection = Direction.Vertical;
            this.advancePointer();
            break;
          case "ArrowDown":
            this.state.inputDirection = Direction.Vertical;
            this.retreatPointer();
            break;
          case "ArrowRight":
            this.state.inputDirection = Direction.Horizontal;
            this.advancePointer();
            break;
          case "ArrowLeft":
            this.state.inputDirection = Direction.Horizontal;
            this.retreatPointer();
            break;
          default:
            break;
        }

        // holding alt while traversing should move without changing input direction
        if (event.altKey) { this.state.inputDirection = previousInputDirection; }
      } else if (key.includes('Key') || key.includes('Digit') || /^[\/~-]$/.test(event.key)) {
        event.preventDefault()
        // if key pressed is a valid cell value then change its contents
        const character = event.key;

        this.setCell(this.state.activeCell.x, this.state.activeCell.y, character);

        // holding alt while entering character should not move pointer
        if (!event.altKey) { this.advancePointer(); }
      }

      this.draw();
    });
  }

  /**
   * Updates and draws changes to staveGrid's elements.
   */
  draw() {
    if (this.state.focus) {
      this.el.baseContainer.classList.toggle('focus', true);
      this.staveBox.el.baseContainer.classList.toggle('focus', true);

      // render direction highlight
      if (this.state.inputDirection == Direction.Horizontal) {
        this.el.directionHighlight.style.width = `${this.staveBox.length + 1}em`;
        this.el.directionHighlight.style.height = '1em';
        this.el.directionHighlight.style.letterSpacing = '0.5em';
        this.el.directionHighlight.style.transform = `translate(1px, ${this.state.activeCell.y * (this.parentWorkspace.emSize.height * 1.015)}px)`;
      } else if (this.state.inputDirection == Direction.Vertical) {
        this.el.directionHighlight.style.width = '1em';
        this.el.directionHighlight.style.height = `${this.staveBox.cellArray.length * (this.parentWorkspace.emSize.height * 1.05)}px`;
        this.el.directionHighlight.style.letterSpacing = 'normal';
        this.el.directionHighlight.style.transform = `translate(${this.state.activeCell.x * (this.parentWorkspace.emSize.width * 1.015)}px, 0px)`;
      }

      // render selected cell
      const content = this.staveBox.cellArray[this.state.activeCell.y][this.state.activeCell.x].value;
      this.el.activeHighlight.textContent = content;

      this.el.activeHighlight.style.transform = `translate(${this.state.activeCell.x * (this.parentWorkspace.emSize.width * 1.015)}px, ${this.state.activeCell.y * (this.parentWorkspace.emSize.height * 1.015)}px)`;
    } else {
      this.el.baseContainer.classList.toggle('focus', false);
      this.staveBox.el.baseContainer.classList.toggle('focus', false);
    }
  }

  /**
   * Sets a specific cell in a staveGrid to a given value.
   * @param {number} x - X position of cell to change.
   * @param {number} y - Y position of cell to change.
   * @param {string} value - New value for cell.
   */
  setCell(x, y, value) {
    this.staveBox.cellArray[y][x].value = value;
    const arr = this.staveBox.cellArray.flat(1);
    let contents = "";
    arr.forEach((cell, idx) => {
      contents += cell.value;
      if (idx % this.staveBox.cellArray[0].length === (this.staveBox.cellArray[0].length - 1)) {
        contents += `\n`;
      }
    });
    this.el.baseContainer.firstChild.nodeValue = contents;
  }

  /**
   * Advances the position of the active cell pointer, dependent on inputDirection
   */
  advancePointer() {
    let nextCell = { x: 0, y: 0 };
    if (this.state.inputDirection == Direction.Vertical) {
      if (this.state.activeCell.y === 0) {
        nextCell.x = this.state.activeCell.x == this.staveBox.length - 1 ? this.state.activeCell.x : this.state.activeCell.x + 1;
        nextCell.y = this.staveBox.tuning.length - 1;
      } else {
        nextCell.x = this.state.activeCell.x;
        nextCell.y = this.state.activeCell.y - 1;
      }
    } else if (this.state.inputDirection == Direction.Horizontal) {
      if (this.state.activeCell.x === this.staveBox.length - 1) {
        nextCell.x = 0;
        nextCell.y = this.state.activeCell.y === this.staveBox.tuning.length - 1 ? this.state.activeCell.y : this.state.activeCell.y + 1;
      } else {
        nextCell.x = this.state.activeCell.x === this.staveBox.length - 1 ? 0 : this.state.activeCell.x + 1;
        nextCell.y = this.state.activeCell.y;
      }
    }
    this.state.activeCell = nextCell;
  }

  /**
   * Retreats the position of the active cell pointer, dependent on inputDirection
   */
  retreatPointer() {
    let nextCell = { x: 0, y: 0 };
    if (this.state.inputDirection == Direction.Vertical) {
      if (this.state.activeCell.y === this.staveBox.tuning.length - 1) {
        nextCell.x = this.state.activeCell.x === 0 ? this.state.activeCell.x : this.state.activeCell.x - 1;
        nextCell.y = 0;
      } else {
        nextCell.x = this.state.activeCell.x;
        nextCell.y = this.state.activeCell.y + 1;
      }
    } else if (this.state.inputDirection == Direction.Horizontal) {
      if (this.state.activeCell.x === 0) {
        nextCell.x = this.state.activeCell.x;
        nextCell.y = this.state.activeCell.y;
      } else {
        nextCell.x = this.state.activeCell.x - 1;
        nextCell.y = this.state.activeCell.y;
      }
    }
    this.state.activeCell = nextCell;
  }

  /**
   * Updates the whole text node of the staveGrid according to its cellArray
   */
  redrawGrid() {
    let gridContent = "";

    this.staveBox.cellArray.forEach((row) => {
      row.forEach(cell => {
        gridContent += cell.value;
      });
      gridContent += `\n`;
    });

    this.el.baseContainer.firstChild.nodeValue = gridContent;
  }
}

/**
 * StaveEnd - The resize handle at the end of the stave
 * Web demo version - No popover, just drag to resize
 */
class StaveEnd {
  /**
   * @param {StaveBox} stavebox - staveBox object to bind to.
   */
  constructor(stavebox) {
    /** @member {Object} el - Contains all HTML Elements associated with this object */
    this.el = {};

    this.staveBox = stavebox;
    this.parentWorkspace = stavebox.parentWorkspace;

    this.el.baseContainer = document.createElement('div');
    this.el.baseContainer.classList.add('staveEnd');
    this.el.baseContainer.textContent = '|\r'.repeat(this.staveBox.tuning.length);

    this.el.baseContainer.addEventListener('mousedown', (event) => {
      if (event.button !== 0) { return; }
      event.preventDefault();

      this.el.baseContainer.classList.add('focus');
      document.body.style.cursor = 'col-resize';

      const resizeHandler = (event) => this.handleResize(event);

      document.addEventListener('mousemove', resizeHandler);

      const mouseUpHandler = () => {
        document.body.style.cursor = 'auto';
        this.el.baseContainer.classList.remove('focus');
        document.removeEventListener('mousemove', resizeHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
      };

      document.addEventListener('mouseup', mouseUpHandler);
    });

    this.staveBox.el.staveBox.appendChild(this.el.baseContainer);
  }

  /**
   * Handles the resize drag operation - updates grid width based on mouse position
   * @param {MouseEvent} event 
   */
  handleResize(event) {
    const workspaceRight = this.parentWorkspace.el.getBoundingClientRect().right;
    const mouseX = Math.min(event.clientX, workspaceRight - (this.parentWorkspace.emSize.width * 2));

    const gridRect = this.staveBox.el.staveBoxGrid.getBoundingClientRect();
    const cellWidth = gridRect.width / this.staveBox.length;
    const newLength = Math.max(Math.round((mouseX - gridRect.left) / cellWidth), 1);

    if (newLength === this.staveBox.length) { return; }

    this.resizeGrid(newLength);
  }

  /**
   * Resizes the grid to a new length, preserving existing cell data
   * @param {number} newLength - The new grid length (number of columns)
   */
  resizeGrid(newLength) {
    const prevLength = this.staveBox.length;
    const rowCount = this.staveBox.tuning.length;

    if (newLength < prevLength) {
      // truncate each row
      for (let row = 0; row < rowCount; row++) {
        this.staveBox.cellArray[row] = this.staveBox.cellArray[row].slice(0, newLength);
      }
    } else if (newLength > prevLength) {
      // add new cells to each row
      const diff = newLength - prevLength;
      for (let row = 0; row < rowCount; row++) {
        const newCells = Array.from({ length: diff }, (_, i) => ({
          idx: (row * newLength) + prevLength + i,
          value: '-'
        }));
        this.staveBox.cellArray[row].push(...newCells);
      }
      // reindex all cells
      for (let row = 0; row < rowCount; row++) {
        for (let col = 0; col < newLength; col++) {
          this.staveBox.cellArray[row][col].idx = (row * newLength) + col;
        }
      }
    }

    this.staveBox.length = newLength;
    this.staveBox.staveGrid.redrawGrid();
  }

  /**
   * Redraws the staveEnd display (vertical bars)
   * @param {number} height - Number of rows (strings) to display
   */
  redraw(height = this.staveBox.tuning.length) {
    this.el.baseContainer.textContent = '|\r'.repeat(height);
  }
}
