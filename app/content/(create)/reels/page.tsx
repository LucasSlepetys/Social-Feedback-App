'use client';
// Importing necessary modules from Next.js and React
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';

// Type definition for state, combining File object with an additional 'preview' property
type FileWithPreview = {
  file: File;
  preview: string;
};

const DragDropUpload = () => {
  // State for storing a single file with preview
  const [file, setFile] = useState<FileWithPreview | null>(null);
  const router = useRouter();

  // useDropzone hook to create a dropzone area
  const { getRootProps, getInputProps } = useDropzone({
    // Function to handle file drop
    onDrop: (acceptedFiles: File[]) => {
      // Since multiple is false, only take the first file
      const file = acceptedFiles[0];
      // Mapping accepted files to include a preview URL
      setFile({ file, preview: URL.createObjectURL(file) });
    },
    multiple: false, // Restricts to a single file
  });

  // Effect for cleaning up the preview URL
  useEffect(() => {
    return () => {
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
    };
  }, [file]);

  return (
    <div
      {...getRootProps()} // Spread operator for dropzone props
      className='border-dashed border-4 border-gray-200 p-4'
    >
      <input {...getInputProps()} /> {/* Input field for file uploads */}
      <p>Drag 'n' drop some files here, or click to select files</p>
      <aside>
        {/* Shows file on the screen if file exists */}
        {file && (
          <div>
            <Image
              src={file.preview} // Source set to file's preview URL
              alt={file.file.name} // Alt text for accessibility
              width={200} // Width of the preview image
              height={800} // Height of the preview image
              layout='responsive' // Responsive layout for the image
            />
          </div>
        )}
      </aside>
      <button
        type='button'
        onClick={() => {
          router.push(
            `/content/reels/edits?src=${file?.preview}&name=${file?.file.name}`
          );
        }}
        className='fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full'
      >
        Next
      </button>
    </div>
  );
};

export default DragDropUpload;
