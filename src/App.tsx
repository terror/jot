import Document from '@tiptap/extension-document';
import Heading from '@tiptap/extension-heading';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { EditorContent, useEditor } from '@tiptap/react';

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

function App() {
  const editor = useEditor({
    extensions: [
      CustomHorizontalRule,
      Document,
      Heading.configure({ levels: [1, 2, 3] }),
      Paragraph,
      Text,
    ],
    autofocus: true,
    editorProps: {
      attributes: {
        class: 'h-full w-full focus:outline-none prose max-w-none',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className='flex h-screen w-screen items-center justify-center bg-gray-100'>
      <div className='h-full w-full overflow-auto bg-white caret-black'>
        <EditorContent
          autoCorrect='off'
          autoComplete='off'
          spellCheck={false}
          editor={editor}
          className='h-full'
        />
      </div>
    </div>
  );
}

export default App;
