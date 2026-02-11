/**
 * TextBox - Web demo version
 * Stripped-down version for browser demo (no Popover, no ConfirmationDialog, no context menus)
 */

import { DragHandle } from "./dragHandle.js";

export class TextBox {
  static displayName = 'textBox';

  /**
   * Creates a textBox.
   * @param {Object} workspace - The parent workspace for the textBox.
   * @param {string} [textContent] - Optional HTML content to initialize the textBox with.
   */
  constructor(workspace, textContent = "") {
    this.parentWorkspace = workspace;

    /** @member {Object} el - Contains all HTML Elements associated with this object */
    this.el = {};

    this.el.baseContainer = document.createElement('div');
    this.el.baseContainer.classList.add('prototypeContainer', 'text');
    this.parentWorkspace.el.appendChild(this.el.baseContainer);

    this.el.contextMenu = new DragHandle(this, this.parentWorkspace);
    this.el.baseContainer.appendChild(this.el.contextMenu);

    this.el.textBox = document.createElement('div');
    this.el.textBox.classList.add('textBox');
    this.el.textBox.contentEditable = true;
    this.el.textBox.spellcheck = false;

    // Set initial content
    if (textContent && textContent.trim().startsWith('<')) {
      this.el.textBox.innerHTML = textContent;
    } else {
      this.el.textBox.textContent = textContent;
    }

    this.el.baseContainer.appendChild(this.el.textBox);
  }

  /**
   * Returns the root element of this component.
   * @returns {HTMLDivElement}
   */
  getRootContainer() {
    return this.el.baseContainer;
  }

  /**
   * Removes this textBox from the workspace and cleans up DOM elements.
   */
  remove() {
    const index = this.parentWorkspace.ChildObjects.indexOf(this);
    if (index > -1) {
      this.parentWorkspace.ChildObjects.splice(index, 1);
    }
    this.el.baseContainer.remove();
  }

  /**
   * Decreases this textBox's position in the workspace (moves up).
   */
  decPositionInWorkspace() {
    const index = this.parentWorkspace.ChildObjects.indexOf(this);
    if (index > 0) {
      this.parentWorkspace.ChildObjects.splice(index, 1);
      this.parentWorkspace.ChildObjects.splice(index - 1, 0, this);
    }
  }

  /**
   * Increases this textBox's position in the workspace (moves down).
   */
  incPositionInWorkspace() {
    const index = this.parentWorkspace.ChildObjects.indexOf(this);
    if (index < this.parentWorkspace.ChildObjects.length - 1) {
      this.parentWorkspace.ChildObjects.splice(index, 1);
      this.parentWorkspace.ChildObjects.splice(index + 1, 0, this);
    }
  }
}
