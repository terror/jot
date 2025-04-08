import Blockquote from '@tiptap/extension-blockquote';
import Bold from '@tiptap/extension-bold';
import CharacterCount from '@tiptap/extension-character-count';
import Document from '@tiptap/extension-document';
import Heading from '@tiptap/extension-heading';
import History from '@tiptap/extension-history';
import Italic from '@tiptap/extension-italic';
import Paragraph from '@tiptap/extension-paragraph';
import Strike from '@tiptap/extension-strike';
import Text from '@tiptap/extension-text';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import { useEffect, useRef, useState } from 'react';

import { formatDate } from './lib/utils';

type Position = {
  column: number;
  line: number;
};

function App() {
  const [cursorPosition, setCursorPosition] = useState<Position>({
    line: 1,
    column: 1,
  });
  const [currentDate] = useState<string>(formatDate(new Date()));
  const [characterCount, setCharacterCount] = useState<{
    characters: number;
    words: number;
  }>({
    characters: 0,
    words: 0,
  });
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      Blockquote,
      Bold,
      CharacterCount.configure(),
      Document,
      Heading.configure({ levels: [1, 2, 3] }),
      History,
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
      updateCharacterCount(editor);
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

  const updateCharacterCount = (editor: Editor | null): void => {
    if (!editor) return;
    const characters = editor.storage.characterCount.characters();
    const words = editor.storage.characterCount.words();
    setCharacterCount({ characters, words });
  };

  useEffect(() => {
    if (!editorContainerRef.current || !lineNumbersRef.current) return;
    const editorContainer = editorContainerRef.current;
    const lineNumbersContainer = lineNumbersRef.current;

    const handleScroll = () => {
      lineNumbersContainer.scrollTop = editorContainer.scrollTop;
    };

    editorContainer.addEventListener('scroll', handleScroll);

    return () => {
      editorContainer.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (editor) {
      updateCharacterCount(editor);
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className='flex h-screen w-screen flex-col bg-gray-100'>
      <div className='flex flex-grow overflow-hidden bg-white caret-black'>
        {/* Line Numbers */}
        <div
          ref={lineNumbersRef}
          className='pointer-events-none overflow-hidden border-r border-gray-200 bg-gray-100 text-right select-none'
          style={{ paddingTop: '0.1rem' }}
        >
          <div className='px-2 font-mono text-sm text-gray-500'>
            {editor.getJSON().content?.map((_, nodeIndex) => {
              const lineNumber = nodeIndex + 1;
              return (
                <div key={`line-${lineNumber}`} className='h-6'>
                  {lineNumber}
                </div>
              );
            })}
          </div>
        </div>
        {/* Editor */}
        <div ref={editorContainerRef} className='h-full flex-1 overflow-auto'>
          <EditorContent
            autoCorrect='off'
            autoComplete='off'
            spellCheck={false}
            editor={editor}
            className='h-full'
          />
        </div>
      </div>

      {/* Status */}
      <div className='border-t border-gray-300 bg-gray-200 text-xs text-gray-600'>
        <div className='flex justify-between p-2'>
          <div className='flex gap-2'>
            <span>
              {cursorPosition.line}:{cursorPosition.column}
            </span>
            <span>C {characterCount.characters}</span>
            <span>W {characterCount.words}</span>
          </div>
          <div>{currentDate}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
