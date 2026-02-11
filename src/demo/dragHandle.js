/**
 * DragHandle - Web demo version
 * Stripped-down version for browser demo (no electronAPI, no ConfirmationDialog)
 */

const dragHandleSVG = `<svg fill="currentColor" width="24" height="24" viewBox="0 0 36 36" version="1.1"  preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg"><circle cx="15" cy="12" r="1.5" class="clr-i-outline clr-i-outline-path-1"></circle><circle cx="15" cy="24" r="1.5" class="clr-i-outline clr-i-outline-path-2"></circle><circle cx="21" cy="12" r="1.5" class="clr-i-outline clr-i-outline-path-3"></circle><circle cx="21" cy="24" r="1.5" class="clr-i-outline clr-i-outline-path-4"></circle><circle cx="21" cy="18" r="1.5" class="clr-i-outline clr-i-outline-path-5"></circle><circle cx="15" cy="18" r="1.5" class="clr-i-outline clr-i-outline-path-6"></circle><rect x="0" y="0" width="24" height="24" fill-opacity="0"/></svg>`;

const trashSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;

export class DragHandle {
  constructor(parentObject, workspace) {
    const parentContainer = parentObject.getRootContainer();
    const contextMenu = document.createElement('div');
    contextMenu.classList.add('contextMenu');
    
    const dragButton = document.createElement('div');
    dragButton.classList.add('dragHandle');
    dragButton.innerHTML = dragHandleSVG;
    contextMenu.appendChild(dragButton);
    
    const deleteButton = document.createElement('div');
    deleteButton.classList.add('deleteButton');
    deleteButton.innerHTML = trashSVG;
    contextMenu.appendChild(deleteButton);
    
    let elementCenterY;
    let previousElement = parentContainer.previousElementSibling;
    let previousElementRect;
    let nextElement = parentContainer.nextElementSibling;
    let nextElementRect;
    let yOffset = 0;

    const resizeHandler = (entry) => {
      // calculates the approximate height of the parent object in ems
      const containerContentDiv = parentContainer.children[1]; // div of the container's content (textBox or staveBox)
      const computedEm = parseFloat(getComputedStyle(parentContainer).fontSize);
      const approxHeight = parseFloat(getComputedStyle(containerContentDiv).height) / computedEm;
      if (approxHeight < 2) {
        deleteButton.classList.remove('show');
      } else {
        deleteButton.classList.add('show');
      }

      // resizeObserver should look at parentContainers content for correct height
      if (entry[0].target === parentContainer) {
        resizeObserver.unobserve(parentContainer);
        resizeObserver.observe(containerContentDiv);
      }
    };

    const resizeObserver = new ResizeObserver(resizeHandler);
    resizeObserver.observe(parentContainer);

    const elementDragging = (event) => {
      const mouseY = event.clientY;
      const elementRect = parentContainer.getBoundingClientRect();
      let distanceY = mouseY - elementCenterY;
      parentContainer.style.transform = `translateY(${distanceY + yOffset}px) scale(102%)`;

      // dragging up
      if (previousElement) {
        if (elementRect.top < (previousElementRect.top + (previousElementRect.height / 2))) {
          yOffset += previousElementRect.height + (workspace.emSize.height);
          parentContainer.style.transform = `translateY(${distanceY + yOffset}px) scale(102%)`;

          if (previousElement) { previousElement.classList.toggle('glowBelow', false); }
          if (nextElement) { nextElement.classList.toggle('glowAbove', false); }

          parentObject.decPositionInWorkspace();
          workspace.el.insertBefore(parentContainer, previousElement);

          dragButton.classList.add('forceActive');

          previousElement = parentContainer.previousElementSibling;
          nextElement = parentContainer.nextElementSibling;

          if (previousElement) {
            previousElementRect = previousElement.getBoundingClientRect();
            previousElement.classList.toggle('glowBelow', true);
          }
          if (nextElement) {
            nextElementRect = nextElement.getBoundingClientRect();
            nextElement.classList.toggle('glowAbove', true);
          }
        }
      }

      // dragging down
      if (nextElement) {
        if (elementRect.bottom > (nextElementRect.bottom - (nextElementRect.height / 2))) {
          yOffset -= nextElementRect.height + (workspace.emSize.height);
          parentContainer.style.transform = `translateY(${distanceY + yOffset}px) scale(102%)`;

          if (previousElement) { previousElement.classList.toggle('glowBelow', false); }
          if (nextElement) { nextElement.classList.toggle('glowAbove', false); }

          parentObject.incPositionInWorkspace();
          nextElement.insertAdjacentElement('afterend', parentContainer);

          dragButton.classList.add('forceActive');

          previousElement = parentContainer.previousElementSibling;
          nextElement = parentContainer.nextElementSibling;

          if (previousElement) {
            previousElementRect = previousElement.getBoundingClientRect();
            previousElement.classList.toggle('glowBelow', true);
          }
          if (nextElement) {
            nextElementRect = nextElement.getBoundingClientRect();
            nextElement.classList.toggle('glowAbove', true);
          }
        }
      }
    };

    dragButton.addEventListener('mousedown', (event) => {
      if (event.button !== 0) { return; }
      document.body.style.cursor = 'grabbing';
      const elementRect = dragButton.getBoundingClientRect();
      elementCenterY = elementRect.top + (elementRect.height / 2);
      parentContainer.classList.add('dragged');
      parentContainer.style.transform = `scale(102%)`;

      previousElement = parentContainer.previousElementSibling;
      nextElement = parentContainer.nextElementSibling;

      if (previousElement) { previousElement.classList.toggle('glowBelow', true); }
      if (nextElement) { nextElement.classList.toggle('glowAbove', true); }

      if (previousElement) { previousElementRect = previousElement.getBoundingClientRect(); }
      if (nextElement) { nextElementRect = nextElement.getBoundingClientRect(); }

      document.addEventListener('mousemove', elementDragging);

      document.addEventListener('mouseup', (event) => {
        dragButton.classList.toggle('forceActive', false);
        document.body.style.cursor = 'auto';
        parentContainer.style.transform = `translateY(0px) scale(100%)`;
        yOffset = 0;
        parentContainer.classList.remove('dragged');

        previousElement = parentContainer.previousElementSibling;
        nextElement = parentContainer.nextElementSibling;

        if (previousElement) { previousElement.classList.toggle('glowBelow', false); }
        if (nextElement) { nextElement.classList.toggle('glowAbove', false); }

        document.removeEventListener('mousemove', elementDragging);
      });
    });

    deleteButton.addEventListener('mousedown', (event) => {
      // Direct remove without confirmation dialog for web demo
      parentObject.remove();
    });

    return contextMenu;
  }
}
