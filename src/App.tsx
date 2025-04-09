import Blockquote from '@tiptap/extension-blockquote';
import Bold from '@tiptap/extension-bold';
import BulletList from '@tiptap/extension-bullet-list';
import CharacterCount from '@tiptap/extension-character-count';
import Code from '@tiptap/extension-code';
import Document from '@tiptap/extension-document';
import Dropcursor from '@tiptap/extension-dropcursor';
import Gapcursor from '@tiptap/extension-gapcursor';
import Heading from '@tiptap/extension-heading';
import Highlight from '@tiptap/extension-highlight';
import History from '@tiptap/extension-history';
import Italic from '@tiptap/extension-italic';
import ListItem from '@tiptap/extension-list-item';
import ListKeymap from '@tiptap/extension-list-keymap';
import OrderedList from '@tiptap/extension-ordered-list';
import Paragraph from '@tiptap/extension-paragraph';
import Strike from '@tiptap/extension-strike';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import Text from '@tiptap/extension-text';
import { Editor, EditorContent, JSONContent, useEditor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react';
import { Calendar, Timer } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Position = {
  column: number;
  line: number;
};

const Time = () => {
  const date = new Date();

  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let hours = date.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;

  const minutes = date.getMinutes().toString().padStart(2, '0');

  return (
    <div className='flex'>
      <div className='flex items-center gap-x-1'>
        <Calendar className='h-3 w-3' />
        <p>
          {dayOfWeek} {month}.{day}
        </p>
      </div>
      <p className='px-2'>|</p>
      <div className='flex items-center gap-x-1'>
        <Timer className='h-3 w-3' />
        <p>
          {hours}:{minutes} {ampm}
        </p>
      </div>
    </div>
  );
};

const App = () => {
  const [cursorPosition, setCursorPosition] = useState<Position>({
    line: 1,
    column: 1,
  });

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
      BulletList,
      CharacterCount.configure(),
      Code,
      Document,
      Dropcursor,
      Gapcursor,
      Heading.configure({ levels: [1, 2, 3] }),
      Highlight.configure({ multicolor: true }),
      History,
      Italic,
      ListItem,
      ListKeymap,
      OrderedList,
      Paragraph,
      Strike,
      TaskItem,
      TaskList,
      Text,
    ],
    autofocus: true,
    editorProps: {
      attributes: {
        class: 'h-full w-full focus:outline-none prose prose-sm max-w-none',
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

  const getLineCount = (): number => {
    if (!editor) return 0;

    const content = editor.getJSON().content;

    if (!content) return 0;

    const count = (nodes: JSONContent[]): number => {
      let total = 0;

      const listNodes = ['bulletlist', 'orderedlist', 'tasklist'];

      for (const node of nodes) {
        if (listNodes.includes((node.type ?? '').toLowerCase())) {
          total += count(node.content ?? []);
        } else {
          total += 1;
        }
      }

      return total;
    };

    return count(content);
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
            <div className='px-2 font-mono text-sm text-gray-500'>
              {Array.from({ length: getLineCount() }).map((_, lineNumber) => {
                return (
                  <div key={`line-${lineNumber + 1}`} className='h-6'>
                    {lineNumber + 1}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selection Menu */}
        {editor && (
          <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
            <div className='bubble-menu'>
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'is-active' : ''}
              >
                Bold
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'is-active' : ''}
              >
                Italic
              </button>
              <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={editor.isActive('strike') ? 'is-active' : ''}
              >
                Strike
              </button>
            </div>
          </BubbleMenu>
        )}

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
          <Time />
        </div>
      </div>
    </div>
  );
};

export default App;
