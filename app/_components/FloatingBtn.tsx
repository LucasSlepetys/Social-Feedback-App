import React from 'react';

interface Props {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

function FloatingBtn({ onClick }: Props) {
  return (
    <button
      type='button'
      onClick={onClick}
      className='fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full'
    >
      Publish
    </button>
  );
}

export default FloatingBtn
