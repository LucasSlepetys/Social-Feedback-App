import Image from 'next/image';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <VideoPlayer
        videoUrl={'https://youtube.com/shorts/CXJT-IA48dU?si=OH741G-NBM_RUtPf'}
      />
    </main>
  );
}

const VideoPlayer = ({ videoUrl }: { videoUrl: string }) => {
  return (
    <div
      style={{
        position: 'relative',
        paddingBottom: '56.25%',
        height: 0,
        overflow: 'hidden',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      <iframe
        src={videoUrl}
        frameBorder='0'
        allowFullScreen
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      ></iframe>
    </div>
  );
};
