import { useEffect, useState, useRef, useCallback, useMemo } from 'react';

// import { useRouter } from 'next/router';
import { LogConsole } from '../components/log-console';

export default function Home() {
  useEffect(() => {
  }, []);

  return (
    <div className="w-full mt-[9vh] sm:mt-[6vh] px-2 py-4 ag-theme-alpine" style={{ height: '90vh' }}>
      <nav className='mb-2 flex flex-wrap gap-3'>
      </nav>
      <LogConsole />
    </div>
  );
}
