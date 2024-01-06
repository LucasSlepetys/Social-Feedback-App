import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

export const PreviewSelectedFile = () => {
  const params = useSearchParams();
  //assign value of param with key of src to a variable
  const fileSrc = params.get('src') || '';
  //assign value of param with key of name to a variable
  const fileName = params.get('name') || 'Selected img';
  return (
    <div className='w-3/5 aspect-reel mt-12 border border-dashed'>
      <Image
        src={fileSrc} // Source set to file's preview URL
        alt={fileName} // Alt text for accessibility
        width={200} // Width of the preview image
        height={300} // Height of the preview image
        layout='responsive' // Responsive layout for the image
      />
    </div>
  );
};
