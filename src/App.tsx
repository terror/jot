function App() {
  return (
    <div className='flex h-screen w-screen items-center justify-center bg-gray-100'>
      <textarea
        autoComplete='off'
        autoCorrect='off'
        className='h-full w-full resize-none p-4 focus:outline-none'
        spellCheck={false}
      />
    </div>
  );
}

export default App;
