import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

function App() {
  const editor = useEditor({
    extensions: [StarterKit],
    editorProps: {
      attributes: {
        class: 'h-full w-full focus:outline-none p-4 prose max-w-none caret-black',
      },
    },
  });

  return (
    <EditorContent
      autoComplete='off'
      autoCorrect='off'
      editor={editor}
      spellCheck={false}
    />
  );
}

export default App;
