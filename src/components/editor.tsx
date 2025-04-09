import { Position } from '@/lib/types';
import { useSettings } from '@/providers/settings-provider';
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
import {
  EditorContent,
  Editor as TiptapEditor,
  useEditor,
} from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react';
import { useRef } from 'react';

interface EditorProps {
  onCursorPositionChange: (position: Position) => void;
  onStatisticsChange: (stats: { characters: number; words: number }) => void;
}

const Editor: React.FC<EditorProps> = ({
  onCursorPositionChange,
  onStatisticsChange,
}) => {
  const { settings } = useSettings();

  const editorContainerRef = useRef(null);

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
        style: `font-family: ${settings.font}; font-size: ${settings.fontSize}px`,
      },
    },
    onUpdate: ({ editor }) => {
      updateCursorPosition(editor);
      updateStatistics(editor);
    },
    onSelectionUpdate: ({ editor }) => {
      updateCursorPosition(editor);
    },
  });

  const updateCursorPosition = (editor: TiptapEditor | null) => {
    if (!editor) return;

    const position = editor.view.state.doc.resolve(editor.state.selection.from);

    onCursorPositionChange({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      line: (position as any).path[1] + 1,
      column: position.parentOffset + 1,
    });
  };

  const updateStatistics = (editor: TiptapEditor | null) => {
    if (!editor) return;

    onStatisticsChange({
      characters: editor.storage.characterCount.characters(),
      words: editor.storage.characterCount.words(),
    });
  };

  if (!editor) {
    return null;
  }

  return (
    <div ref={editorContainerRef} className='h-full flex-1 overflow-auto'>
      {/* Selection Menu */}
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

      <EditorContent
        autoCorrect='off'
        autoComplete='off'
        spellCheck={false}
        editor={editor}
        className='text-foreground h-full'
      />
    </div>
  );
};

export default Editor;
