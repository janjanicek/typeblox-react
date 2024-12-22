import React, { useState, useRef, useEffect } from "react";
import Toolbar from "./Toolbar";
import { toCssStyle } from "./utils/utils.ts";

function BlockRow({
  blockId,
  type,
  content,
  dragListeners,
  onUpdate,
  onAddBelow,
}) {
  const [hovered, setHovered] = useState(false);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [showTextMenu, setShowTextMenu] = useState(false);
  const [textMenuPosition, setTextMenuPosition] = useState({ top: 5, left: 0 });
  const contentRef = useRef(null);
  const savedSelection = useRef(null);

  useEffect(() => {
    if (contentRef.current && type !== "image" && contentRef.current.innerHTML !== content) {
      contentRef.current.innerHTML = content;
    }
  }, [content, type]);

  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      savedSelection.current = selection.getRangeAt(0); // Save the current range
    }
  };

  const restoreSelection = () => {
    const selection = window.getSelection();
    selection.removeAllRanges(); // Clear any existing selections
    if (savedSelection.current) {
      selection.addRange(savedSelection.current); // Restore the saved range
    }
  };

  const handleTextSelection = () => {
    removeSelectedWrapper();
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      // Get the selection's bounding rect to position the toolbar
      const rect = range.getBoundingClientRect();
      saveSelection();

      // Set the toolbar position
      setTextMenuPosition({
        top: textMenuPosition.top,
        left: rect.left / 2,
      });

      // Check if the selection is already inside a "selected" span
      const parentNode = range.commonAncestorContainer.parentNode;
      if (parentNode.classList?.contains("selected")) {
        setShowTextMenu(true); // Just show the toolbar, no new wrapper needed
        return;
      }

      // If not already wrapped, wrap the selection in a "selected" span
      createSelectedElement(range);
      setShowTextMenu(true);
    }
  };

  const createSelectedElement = (range) => {
    const wrapper = document.createElement("span");
    wrapper.className = "selected";
    wrapper.appendChild(range.extractContents());
    range.insertNode(wrapper);
  }

  const removeSelectedWrapper = () => {
    const selectedElements = contentRef.current.querySelectorAll(".selected");
    selectedElements.forEach((element) => {
      // Unwrap the content inside the `span` with class `selected`
      const parent = element.parentNode;
      while (element.firstChild) {
        parent.insertBefore(element.firstChild, element);
      }
      parent.removeChild(element);
    });
  };

  const handleOutsideClick = (e) => {
    if (contentRef.current && !contentRef.current.contains(e.target)) {
      // Check if the click is inside the menu container
      if (e.target.closest(".menu-container")) {
        return; // Do nothing if the click is inside the menu
      }
      setShowTextMenu(false); // Close the menu if the click is outside
      removeSelectedWrapper(); // Remove the `selected` wrapper
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const detectStyle = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const parentNode = range.startContainer.parentNode;

      // Detect styles from the parent node
      const color = window.getComputedStyle(parentNode).color || null;
      const backgroundColor =
        window.getComputedStyle(parentNode).backgroundColor || null;

      return { color, backgroundColor };
    }
    return { color: null, backgroundColor: null };
  };

  const applyFormatting = (tagName, style = {}) => {
    restoreSelection(); // Obnoví textový výběr
  
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      // Pokud není žádný výběr, ukonči funkci
      return;
    }
  
    const range = selection.getRangeAt(0);
    const selectedElement = document.querySelector(".selected");
  
    if (!selectedElement) {
      // Pokud `.selected` element neexistuje, vytvoř ho
      createSelectedElement(range)
  
      // Aktualizuj obsah editoru
      contentRef.current.normalize();
      onUpdate(blockId, contentRef.current.innerHTML);
      return;
    }
  
    // Projít všechny nadřazené elementy
    let matchingParent = null;
    const leadingStyle = Object.keys(style)[0];
    if(style){
     const styleKey = toCssStyle(leadingStyle);    
     matchingParent = selectedElement.closest(`${tagName}[style*=${styleKey}]`);
    //  console.warn(`${tagName}[style^=${styleKey}]`)
    }
    //  console.warn(matchingParent)
  
    if (matchingParent) {
      // Pokud existuje rodič s odpovídajícím tagem a styly, nedělat nic
      Object.keys(style).forEach((key) => {
        matchingParent.style[key] = style[key];
      });
      return;
    }
  
    // Pokud rodič existuje, ale styly se liší, nebo neexistuje vůbec
    const wrapper = document.createElement(tagName);
    Object.keys(style).forEach((key) => {
      wrapper.style[key] = style[key];
    });
  
    // Zabalit `selected` element novým wrapperem
    const parentElement = selectedElement.parentElement;
    if (parentElement) {
      parentElement.replaceChild(wrapper, selectedElement);
      wrapper.appendChild(selectedElement);
    } else {
      // Pokud není rodič, vložit wrapper přímo
      selectedElement.replaceWith(wrapper);
      wrapper.appendChild(selectedElement);
    }
  
    // Zajistit, že `.selected` zůstává čistý
    //ensureSelectedIsClean();
  
    // Aktualizovat obsah editoru
    contentRef.current.normalize();
    onUpdate(blockId, contentRef.current.innerHTML);
  };
  
//   const ensureSelectedIsClean = () => {
//     const selectedElements = contentRef.current.querySelectorAll(".selected");
  
//     selectedElements.forEach((selected) => {
//       // Přenést styly z `.selected` na rodiče
//       const parent = selected.parentElement;
//       if (parent && parent.tagName.toLowerCase() !== "body") {
//         const stylesToMove = selected.style.cssText;
//         selected.style.cssText = ""; // Odstranit styly z `.selected`
  
//         if (stylesToMove) {
//           // Pokud styly existují, přidat je rodiči
//           parent.style.cssText += stylesToMove;
//         }
//       }
//     });
//   };

    
  return (
    <div
      className="group relative flex items-start gap-2 py-2"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setShowPlusMenu(!showPlusMenu)}
          className="w-6 h-6 flex items-center justify-center border border-0 rounded-full bg-white text-gray-700 hover:bg-gray-50"
        >
          +
        </button>
        <button
          {...dragListeners}
          className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing border border-0 bg-white"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <circle cx="5" cy="5" r="1" />
            <circle cx="5" cy="12" r="1" />
            <circle cx="5" cy="19" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </button>
      </div>

            {/* Contextual Menu for the Plus Button */}
            {showPlusMenu && (
        <div
          className="absolute left-10 top-0 bg-white border border-gray-300 shadow-lg p-2 z-10"
        >
          <p
            className="cursor-pointer hover:bg-gray-100 p-1"
            onClick={() => {
                setShowPlusMenu(false);
                onAddBelow(blockId, "text")
            }}
          >
            Add Text Block
          </p>
          <p
            className="cursor-pointer hover:bg-gray-100 p-1"
            onClick={() => {
                setShowPlusMenu(false);
                onAddBelow(blockId, "code")
            }}
          >
            Add Code Block
          </p>
          <p
            className="cursor-pointer hover:bg-gray-100 p-1"
            onClick={() => {
                setShowPlusMenu(false);
                onAddBelow(blockId, "image")
            }}
          >
            Add Image Block
          </p>
        </div>
      )}

      {/* Contextual Menu for Text */}
      {showTextMenu && (
        <Toolbar
          textMenuPosition={textMenuPosition}
          applyFormatting={applyFormatting}
          detectStyle={detectStyle}
          saveSelection={saveSelection}
          restoreSelection={restoreSelection}
        />
      )}

      {type === "text" || type === "code" ? (
        <div
          ref={contentRef}
          contentEditable
          suppressContentEditableWarning
          className="flex-1 outline-none border border-transparent px-2"
          onBlur={() => onUpdate(blockId, contentRef.current.innerHTML)}
          onKeyUp={handleTextSelection}
          onMouseUp={handleTextSelection}
        />
      ) : type === "image" ? (
        <div className="flex-1">
          {content ? (
            <img
              src={content}
              alt="Uploaded"
              className="max-w-full h-auto border rounded"
            />
          ) : (
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                onUpdate(blockId, URL.createObjectURL(e.target.files[0]))
              }
              className="border p-2"
            />
          )}
        </div>
      ) : null}
    </div>
  );
}

export default BlockRow;
