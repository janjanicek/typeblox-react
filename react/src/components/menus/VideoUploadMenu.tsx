interface VideoUploadMenuProps {
  handleUrlSubmit: (url: string) => void;
}

const VideoUploadMenu: React.FC<VideoUploadMenuProps> = ({
  handleUrlSubmit,
}) => {
  return (
    <div className="rounded-md">
      <div className="text-center p-2">
        <input
          type="text"
          id="youtube-url"
          placeholder="Paste YouTube URL here"
          className="border p-2 mb-2 block w-full"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const input = e.target as HTMLInputElement;
              handleUrlSubmit(input.value);
            }
          }}
        />
        <button
          onClick={() => {
            const input = document.getElementById(
              "youtube-url",
            ) as HTMLInputElement;
            handleUrlSubmit(input.value);
          }}
          className="tbx-bg-primary text-white px-4 py-2 rounded"
        >
          Embed video
        </button>
      </div>
    </div>
  );
};

export default VideoUploadMenu;
