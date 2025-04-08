import Bold from '@tiptap/extension-bold';
import Document from '@tiptap/extension-document';
import Heading from '@tiptap/extension-heading';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Italic from '@tiptap/extension-italic';
import Paragraph from '@tiptap/extension-paragraph';
import Strike from '@tiptap/extension-strike';
import Text from '@tiptap/extension-text';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import { useState } from 'react';

const CustomHorizontalRule = HorizontalRule.extend({
  addKeyboardShortcuts() {
    return {
      'Mod-Enter': () => {
        this.editor.commands.setHorizontalRule();
        return true;
      },
    };
  },
});

function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  };

  return date.toLocaleDateString('en-US', options);
}

interface CursorPosition {
  line: number;
  column: number;
}

function App() {
  const [cursorPosition, setCursorPosition] = useState<CursorPosition>({
    line: 1,
    column: 1,
  });

  const [currentDate] = useState<string>(formatDate(new Date()));

  const editor = useEditor({
    extensions: [
      Bold,
      CustomHorizontalRule,
      Document,
      Heading.configure({ levels: [1, 2, 3] }),
      Italic,
      Paragraph,
      Strike,
      Text,
    ],
    autofocus: true,
    editorProps: {
      attributes: {
        class: 'h-full w-full focus:outline-none prose max-w-none',
      },
    },
    onUpdate: ({ editor }) => {
      updateCursorPosition(editor);
    },
    onSelectionUpdate: ({ editor }) => {
      updateCursorPosition(editor);
    },
  });

  const updateCursorPosition = (editor: Editor | null): void => {
    if (!editor) return;

    const { from } = editor.state.selection;

    const position = editor.view.state.doc.resolve(from);

    setCursorPosition({
      line: (position as any).path[1] + 1,
      column: position.parentOffset + 1,
    });
  };

  if (!editor) {
    return null;
  }

  return (
    <div className='flex h-screen w-screen flex-col bg-gray-100'>
      <div className='flex-grow overflow-auto bg-white caret-black'>
        <EditorContent
          autoCorrect='off'
          autoComplete='off'
          spellCheck={false}
          editor={editor}
          className='h-full'
        />
      </div>
      <div className='border-t border-gray-300 bg-gray-200 p-2 text-xs text-gray-600'>
        <div className='flex justify-between'>
          <div>
            Line {cursorPosition.line} Column {cursorPosition.column}
          </div>
          <div>{currentDate}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
