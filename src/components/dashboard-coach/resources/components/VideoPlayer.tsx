'use client';

interface VideoPlayerProps {
  url: string;
  thumbnail?: string;
  title?: string;
  className?: string;
}

export const VideoPlayer = ({ url, thumbnail, title, className = '' }: VideoPlayerProps) => {
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
  const isVimeo = url.includes('vimeo.com');
  
  let videoId = '';
  let embedUrl = '';
  
  if (isYouTube) {
    // Extraire l'ID de la vidéo YouTube
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^\"&?\/\s]{11})/);
    videoId = match ? match[1] : '';
    embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  } else if (isVimeo) {
    // Extraire l'ID de la vidéo Vimeo
    const match = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
    videoId = match ? match[1] : '';
    embedUrl = `https://player.vimeo.com/video/${videoId}?autoplay=1`;
  }
  
  if (isYouTube || isVimeo) {
    return (
      <div className={`relative aspect-video w-full bg-black rounded-lg overflow-hidden ${className}`}>
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={title || "Vidéo intégrée"}
        />
      </div>
    );
  }
  
  // Pour les vidéos locales ou MP4
  return (
    <div className={`relative w-full ${className}`}>
      <video 
        controls 
        className="w-full max-h-[70vh] bg-black rounded-lg"
        poster={thumbnail}
      >
        <source src={url} type="video/mp4" />
        Votre navigateur ne prend pas en charge la lecture de vidéos.
      </video>
    </div>
  );
};
