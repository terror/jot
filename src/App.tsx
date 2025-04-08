import { useState } from "react";

function App() {
  const [value, setValue] = useState<string>('');

  return (
    <div className='flex h-screen w-screen items-center justify-center bg-gray-100'>
      <textarea
        autoComplete='off'
        autoCorrect='off'
        className='h-full w-full resize-none p-4 focus:outline-none'
        onChange={(e) => setValue(e.target.value)}
        spellCheck={false}
        value={value}
      />
    </div>
  );
}

export default App;
