import Editor from '@/components/editor';
import { Time } from '@/components/time';
import type { Position, Statistics } from '@/lib/types';
import { useTheme } from '@/providers/theme-provider';
import { useState } from 'react';

import { SettingsDialog } from './components/settings-dialog';

const App = () => {
  const { theme } = useTheme();

  const [cursorPosition, setCursorPosition] = useState<Position>({
    line: 1,
    column: 1,
  });

  const [statistics, setStatistics] = useState<Statistics>({
    characters: 0,
    words: 0,
  });

  return (
    <div className='bg-background flex h-screen w-screen flex-col'>
      <div className='bg-background caret-foreground flex flex-grow overflow-hidden'>
        <Editor
          onCursorPositionChange={setCursorPosition}
          onStatisticsChange={setStatistics}
        />
      </div>

      <div
        className={`border-border border-t text-xs ${theme === 'dark' ? 'bg-zinc-900 text-zinc-400' : 'bg-zinc-800 text-zinc-300'}`}
      >
        <div className='flex justify-between p-2'>
          <div className='flex gap-2'>
            <span>
              {cursorPosition.line}:{cursorPosition.column}
            </span>
            <span>C {statistics.characters}</span>
            <span>W {statistics.words}</span>
          </div>
          <div className='flex items-center gap-x-2'>
            <Time />
            <SettingsDialog />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
