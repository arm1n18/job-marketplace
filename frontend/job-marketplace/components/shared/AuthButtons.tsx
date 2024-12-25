import React from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';

const AuthButtons = React.memo(() => {
  return (
    <div className="flex gap-6">
      <Button asChild variant="outline">
        <Link href="/login">Увійти</Link>
      </Button>
      <Button asChild className="w-[160px] max-md:hidden">
        <Link href="/register">Зареєструватись</Link>
      </Button>
    </div>
  );
});

AuthButtons.displayName = 'AuthButtons';

export { AuthButtons };
