/**
 * Demo Workspace - Web demo initialization
 * Creates a workspace with demo components for the Plectrm website
 */

import { StaveBox } from "./staveBox.js";
import { TextBox } from "./textBox.js";

/**
 * Demo workspace that manages components
 */
export class DemoWorkspace {
  constructor(containerElement) {
    /** @member {HTMLElement} el - The container element */
    this.el = containerElement;
    
    /** @member {Array} ChildObjects - Array of component instances */
    this.ChildObjects = [];
    
    /** @member {Object} emSize - Calculated em size for positioning */
    this.emSize = { width: 14, height: 14 };
    
    // Calculate em size
    this._calculateEmSize();
    
    // Handle window resize
    window.addEventListener('resize', () => this._calculateEmSize());
  }
  
  /**
   * Calculate the actual pixel size of 1em
   * @private
   */
  _calculateEmSize() {
    const tempEl = document.createElement('div');
    tempEl.style.fontSize = '1em';
    tempEl.style.width = '1em';
    tempEl.style.height = '1em';
    tempEl.style.position = 'absolute';
    tempEl.style.visibility = 'hidden';
    this.el.appendChild(tempEl);
    const rect = tempEl.getBoundingClientRect();
    this.emSize.width = rect.width;
    this.emSize.height = rect.height;
    this.el.removeChild(tempEl);
  }
  
  /**
   * Clear all components from the workspace
   */
  clear() {
    this.ChildObjects.forEach(obj => {
      obj.el.baseContainer.remove();
    });
    this.ChildObjects = [];
  }
  
  /**
   * Initialize the demo with sample data
   */
  initDemo() {
    this.clear();
    
    // Demo data configuration
    const demoData = [
      { type: 'text', content: `My Tab - My band \nby @memrye` },
      { type: 'text', content: 'Intro' },
      { 
        type: 'stave', 
        tuning: ['E', 'A', 'D', 'G', 'B', 'e'],
        length: 38,
        cells: [
          // Pre-fill some cells with example tab data
          // Format: { row: stringIndex (0=high e, 5=low E), col: columnIndex, value: fretNumber }
          { row: 5, col: 0, value: '0' },   // Low E open
          { row: 4, col: 2, value: '2' },   // A string 2nd fret
          { row: 3, col: 2, value: '2' },   // D string 2nd fret
          { row: 2, col: 1, value: '1' },   // G string 1st fret
          { row: 1, col: 0, value: '0' },   // B string open
          { row: 0, col: 0, value: '0' },   // High e open
          // Some chords/notes
          { row: 5, col: 4, value: '3' },
          { row: 4, col: 4, value: '2' },
          { row: 3, col: 4, value: '0' },
          { row: 2, col: 4, value: '0' },
          { row: 1, col: 4, value: '0' },
          { row: 0, col: 4, value: '3' },
          { row: 5, col: 5, value: '3' },
          { row: 4, col: 5, value: '2' },
          { row: 3, col: 5, value: '0' },
          { row: 2, col: 5, value: '0' },
          { row: 1, col: 5, value: '0' },
          { row: 0, col: 5, value: '3' },
          // Slide example
          { row: 5, col: 8, value: '5' },
          { row: 5, col: 9, value: '/' },
          { row: 5, col: 10, value: '7' },
          // Hammer-on example
          { row: 4, col: 14, value: '2' },
          { row: 4, col: 15, value: 'h' },
          { row: 4, col: 16, value: '4' },
          // Pull-off example
          { row: 3, col: 18, value: '4' },
          { row: 3, col: 19, value: 'p' },
          { row: 3, col: 20, value: '2' },
          // Bend example
          { row: 2, col: 22, value: '7' },
          { row: 2, col: 23, value: 'b' },
          { row: 2, col: 24, value: '9' },
        ]
      },
      { type: 'text', content: '' },
      { 
        type: 'stave', 
        tuning: ['E', 'A', 'D', 'G', 'B', 'e'],
        length: 24,
        cells: [] // Empty stave for user to fill in
      },
      { type: 'text', content: 'click stave above and type or use arrow keys to move \ndouble click or press space to change input direction \n\nalt + arrow keys = move without updating direction \nalt + input = enter without moving \nrearrange elements on the page with the drag handle (top left)' },
    ];
    
    // Create components based on demo data
    demoData.forEach(item => {
      if (item.type === 'text') {
        const textBox = new TextBox(this, item.content);
        this.ChildObjects.push(textBox);
      } else if (item.type === 'stave') {
        // Build clonedCellArray from cells if provided
        const clonedCellArray = [];
        for (let row = 0; row < item.tuning.length; row++) {
          const rowArray = [];
          for (let col = 0; col < item.length; col++) {
            const cell = item.cells.find(c => c.row === row && c.col === col);
            rowArray.push({ value: cell ? cell.value : '-' });
          }
          clonedCellArray.push(rowArray);
        }
        
        const staveBox = new StaveBox(
          this,
          item.tuning,
          { length: item.length, clonedCellArray }
        );
        this.ChildObjects.push(staveBox);
      }
    });
  }
}

/**
 * Initialize the demo in a container element
 * @param {HTMLElement} container - The container element for the workspace
 * @returns {DemoWorkspace} The workspace instance
 */
export function initDemoWorkspace(container) {
  const workspace = new DemoWorkspace(container);
  workspace.initDemo();
  return workspace;
}

/**
 * Reset the demo to its initial state
 * @param {DemoWorkspace} workspace - The workspace to reset
 */
export function resetDemo(workspace) {
  workspace.initDemo();
}
