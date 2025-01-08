/**
 * @jest-environment jsdom
 */
import { FormatManager } from "../FormatManager";
import { DOMManager } from "../DOMManager";
import { TypingManager } from "../TypingManager";
import { CLASSES } from "../../constants";

describe("FormatManager", () => {
  let formatManager: FormatManager;
  let mockTypingManager: jest.Mocked<TypingManager>;
  let mockDOMManager: jest.Mocked<DOMManager>;

  beforeEach(() => {
    // Mock TypingManager
    mockTypingManager = {
      getSelectedElement: jest.fn(),
      getCursorElement: jest.fn(),
      splitContentBySelected: jest.fn(),
      selectAllTextInSelectedElement: jest.fn(),
    } as unknown as jest.Mocked<TypingManager>;

    // Mock DOMManager
    mockDOMManager = {
      getBlockElement: jest.fn(),
      removeElement: jest.fn(),
    } as unknown as jest.Mocked<DOMManager>;

    // Initialize FormatManager with mocks
    formatManager = new FormatManager(mockTypingManager, mockDOMManager);
  });

  describe("applyFormat", () => {
    it("should not apply format if no contentElement is found", () => {
      mockDOMManager.getBlockElement.mockReturnValue(null);

      formatManager.applyFormat("b");

      expect(mockDOMManager.getBlockElement).toHaveBeenCalled();
      expect(mockTypingManager.getSelectedElement).not.toHaveBeenCalled();
    });

    it("should not apply format if no selectedElement is found", () => {
      const mockContentElement = document.createElement("div");
      mockDOMManager.getBlockElement.mockReturnValue(mockContentElement);
      mockTypingManager.getSelectedElement.mockReturnValue(null);

      formatManager.applyFormat("b");

      expect(mockDOMManager.getBlockElement).toHaveBeenCalled();
      expect(mockTypingManager.getSelectedElement).toHaveBeenCalledWith(
        mockContentElement,
      );
    });

    it("should wrap the selected text with a tag and apply styles", () => {
      const mockContentElement = document.createElement("div");
      const mockSelectedElement = document.createElement("span");
      mockSelectedElement.textContent = "Sample Text";

      mockDOMManager.getBlockElement.mockReturnValue(mockContentElement);
      mockTypingManager.getSelectedElement.mockReturnValue(mockSelectedElement);

      const parentElement = document.createElement("div");
      parentElement.appendChild(mockSelectedElement);

      formatManager.applyFormat("b", { color: "red" });

      const wrapper = parentElement.querySelector("b");
      expect(wrapper).not.toBeNull();
      expect(wrapper!.style.color).toBe("red");
      expect(wrapper!.textContent).toBe("Sample Text");
    });
  });

  describe("unapplyFormat", () => {
    it("should not unapply format if no selectedElement is found", () => {
      mockTypingManager.getSelectedElement.mockReturnValue(null);

      formatManager.unapplyFormat("b");

      expect(mockTypingManager.getSelectedElement).toHaveBeenCalledWith(
        document,
      );
    });

    it("should remove a matching parent tag", () => {
      const mockSelectedElement = document.createElement("span");
      const mockParentElement = document.createElement("b");
      mockParentElement.appendChild(mockSelectedElement);
      document.body.appendChild(mockParentElement);

      mockTypingManager.getSelectedElement.mockReturnValue(mockSelectedElement);

      formatManager.unapplyFormat("b");

      expect(mockSelectedElement.parentNode).toBeNull();
    });

    it("should remove a specific style from a matching parent element", () => {
      const mockSelectedElement = document.createElement("span");
      const mockParentElement = document.createElement("b");
      mockParentElement.style.color = "red";
      mockParentElement.appendChild(mockSelectedElement);
      document.body.appendChild(mockParentElement);

      mockTypingManager.getSelectedElement.mockReturnValue(mockSelectedElement);

      formatManager.unapplyFormat("b", "color");

      expect(mockParentElement.style.color).toBe("");
    });
  });

  describe("getStyle", () => {
    it("should return default styles if no selection is found", () => {
      mockTypingManager.getSelectedElement.mockReturnValue(null);

      const styles = formatManager.getStyle();

      expect(styles).toEqual({
        color: null,
        backgroundColor: null,
        isBold: false,
        isItalic: false,
        isUnderline: false,
        isStrikeout: false,
        fontFamily: null,
        isH1: false,
        isH2: false,
        isH3: false,
        isParagraph: false,
        isCode: false,
      });
    });

    it("should detect bold style", () => {
      const mockSelectedElement = document.createElement("span");
      mockSelectedElement.style.fontWeight = "bold";

      mockTypingManager.getCursorElement.mockReturnValue(mockSelectedElement);

      const styles = formatManager.getStyle();

      expect(styles.isBold).toBe(true);
    });

    it("should detect bold style when wrapped in a <strong> tag", () => {
      const mockSelectedElement = document.createElement("strong");
      mockSelectedElement.textContent = "Bold Text";

      mockTypingManager.getCursorElement.mockReturnValue(mockSelectedElement);

      const styles = formatManager.getStyle();

      expect(styles.isBold).toBe(true);
    });

    it("should detect bold style when <b> is selected within a parent element", () => {
      const mockParentElement = document.createElement("div");
      const mockBoldElement = document.createElement("b");
      mockBoldElement.textContent = "Bold Text";

      mockParentElement.appendChild(mockBoldElement);
      document.body.appendChild(mockParentElement);

      // Mock the window.getSelection behavior
      const mockRange = document.createRange();
      mockRange.selectNodeContents(mockBoldElement);

      const mockSelection = {
        rangeCount: 1,
        getRangeAt: jest.fn(() => mockRange),
        toString: jest.fn(() => mockBoldElement.textContent),
      };

      jest
        .spyOn(window, "getSelection")
        .mockReturnValue(mockSelection as unknown as Selection);

      mockTypingManager.getCursorElement.mockReturnValue(mockBoldElement);

      const styles = formatManager.getStyle();

      expect(styles.isBold).toBe(true);
    });

    it("should detect bold style when wrapped in a <b> tag", () => {
      const mockSelectedElement = document.createElement("b");
      mockSelectedElement.textContent = "Bold Text";

      mockTypingManager.getCursorElement.mockReturnValue(mockSelectedElement);

      const styles = formatManager.getStyle();

      expect(styles.isBold).toBe(true);
    });

    it("should detect bold style if a parent element is <b>", () => {
      const mockParentElement = document.createElement("b");
      const mockSelectedElement = document.createElement("span");
      mockSelectedElement.textContent = "Bold Text";

      mockParentElement.appendChild(mockSelectedElement);
      mockTypingManager.getCursorElement.mockReturnValue(mockSelectedElement);

      const styles = formatManager.getStyle();

      expect(styles.isBold).toBe(true);
    });

    it("should detect custom styles", () => {
      const mockSelectedElement = document.createElement("span");
      mockSelectedElement.style.color = "blue";
      mockSelectedElement.style.fontStyle = "italic";

      mockTypingManager.getCursorElement.mockReturnValue(mockSelectedElement);

      const styles = formatManager.getStyle();

      expect(styles.color).toBe("blue");
      expect(styles.isItalic).toBe(true);
    });
  });

  describe("clearFormat", () => {
    let container: HTMLElement;
    let consoleWarnSpy: jest.SpyInstance;

    beforeEach(() => {
      container = document.createElement("div");
      document.body.appendChild(container);

      mockTypingManager.getSelectedElement.mockReset();
      mockTypingManager.getCursorElement.mockReset();
      consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    });

    afterEach(() => {
      consoleWarnSpy.mockRestore();
    });

    it("should remove all formatting tags while preserving text content", () => {
      container.innerHTML = `
        <p>
          <b>Bold</b> and <i>Italic</i> text with <u>Underline</u>.
        </p>
      `;

      mockTypingManager.getSelectedElement.mockReturnValue(container);

      formatManager.clearFormat();

      const normalizedOutput = container.innerHTML.replace(/\s+/g, " ").trim();
      const expectedOutput = "<p> Bold and Italic text with Underline. </p>";

      expect(normalizedOutput).toBe(expectedOutput);
    });

    it("should handle nested formatting tags", () => {
      container.innerHTML = `
        <p>
          <b><u>Bold and Underlined</u></b> text.
        </p>
      `;

      mockTypingManager.getSelectedElement.mockReturnValue(container);

      formatManager.clearFormat();

      const normalizedOutput = container.innerHTML.replace(/\s+/g, " ").trim();
      const expectedOutput = "<p> Bold and Underlined text. </p>";

      expect(normalizedOutput).toBe(expectedOutput);
    });

    it("should remove inline styles", () => {
      container.innerHTML = `
        <p>
          <span style="color: red;">Red Text</span> and <mark>highlighted text</mark>.
        </p>
      `;

      mockTypingManager.getSelectedElement.mockReturnValue(container);

      formatManager.clearFormat();

      const normalizedOutput = container.innerHTML.replace(/\s+/g, " ").trim();
      const expectedOutput = "<p> Red Text and highlighted text. </p>";

      expect(normalizedOutput).toBe(expectedOutput);
    });

    it("should handle deeply nested elements", () => {
      container.innerHTML = `
        <div>
          <b><i><u>Deeply nested</u></i></b> text.
        </div>
      `;

      mockTypingManager.getSelectedElement.mockReturnValue(container);

      formatManager.clearFormat();

      const normalizedOutput = container.innerHTML.replace(/\s+/g, " ").trim();
      const expectedOutput = "<div> Deeply nested text. </div>";

      expect(normalizedOutput).toBe(expectedOutput);
    });

    it("should handle cases with no selected element", () => {
      mockTypingManager.getSelectedElement.mockReturnValue(null);
      mockTypingManager.getCursorElement.mockReturnValue(null);

      formatManager.clearFormat();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "No selected or cursor element found for clearing formatting.",
      );
    });

    it("should merge adjacent text nodes", () => {
      container.innerHTML = `
        <p>
          Part 1<span> Part 2</span> Part 3.
        </p>
      `;

      mockTypingManager.getSelectedElement.mockReturnValue(container);

      formatManager.clearFormat();

      const normalizedOutput = container.innerHTML.replace(/\s+/g, " ").trim();
      const expectedOutput = "<p> Part 1 Part 2 Part 3. </p>";

      expect(normalizedOutput).toBe(expectedOutput);
    });
  });
});
