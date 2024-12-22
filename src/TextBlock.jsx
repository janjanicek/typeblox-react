// TextBlock.jsx
import React, { useRef, useState, useEffect } from 'react';

function TextBlock({
  blockId,
  type,
  content,
  onUpdate,
  onAddBlockBelow,
}) {
  const ref = useRef(null);

  // For hover-based "+" menu
  const [hovered, setHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Only update the DOM if the external `content` changes
  // This prevents the cursor from jumping to start on every keystroke.
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== content) {
      ref.current.innerHTML = content;
    }
  }, [content]);

  // When user types, call parent to store new content
  const handleInput = () => {
    if (ref.current) {
      onUpdate(blockId, ref.current.innerHTML);
    }
  };

  const closeMenu = () => setShowMenu(false);

  return (
    <div
      style={{
        position: 'relative',
        marginBottom: '8px',
        border: '1px solid #ccc',
        background: '#fff',
        padding: '8px',
        paddingLeft: '40px',  // Reserve space so the plus icon is inside the container
        minHeight: '50px',
        cursor: 'text',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setShowMenu(false);
      }}
    >
      {/* The editable area */}
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        // Do *not* set `dangerouslySetInnerHTML` here again, because
        // we handle it in the useEffect above.
        style={{
          outline: 'none',
          minHeight: '30px',
        }}
      />

      {/* Hover-based plus icon */}
      {hovered && (
        <button
          style={{
            position: 'absolute',
            left: '8px',   // Move inside the bounding box (was -30px before)
            top: '8px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            border: '1px solid #999',
            background: '#fff',
            cursor: 'pointer',
          }}
          onClick={() => setShowMenu(true)}
        >
          +
        </button>
      )}

      {/* The small menu to add new blocks below */}
      {showMenu && (
        <div
          style={{
            position: 'absolute',
            left: '40px',
            top: '8px',
            background: '#fff',
            border: '1px solid #ccc',
            padding: '4px 8px',
            zIndex: 10,
          }}
        >
          <p
            style={{ margin: '4px 0', cursor: 'pointer' }}
            onClick={() => {
              onAddBlockBelow(blockId, 'text');
              closeMenu();
            }}
          >
            + Text Block
          </p>
          <p
            style={{ margin: '4px 0', cursor: 'pointer' }}
            onClick={() => {
              onAddBlockBelow(blockId, 'heading');
              closeMenu();
            }}
          >
            + Heading
          </p>
        </div>
      )}
    </div>
  );
}

export default TextBlock;
