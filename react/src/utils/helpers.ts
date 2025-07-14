export const getRange = () => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
    return null;
  }
  return selection.getRangeAt(0);
};

export const extractVideoEmbedInfo = (url: string) => {
  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  if (ytMatch) {
    return {
      provider: "youtube",
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}`,
      title: "YouTube video player",
      aspectRatio: 16 / 9,
    };
  }

  // Vimeo
  const vimeoMatch = url.match(
    /(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/
  );
  if (vimeoMatch) {
    return {
      provider: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      title: "Vimeo video player",
      aspectRatio: 16 / 9,
    };
  }

  // Veed.io
  const veedMatch = url.match(
    /veed\.io\/(?:view|embed)\/([A-Za-z0-9-]+)/
  );
  if (veedMatch) {
    return {
      provider: "veed",
      embedUrl: `https://www.veed.io/embed/${veedMatch[1]}`,
      title: "Veed.io video player",
      aspectRatio: 16 / 9,
    };
  }

  // Loom
  const loomMatch = url.match(
    /loom\.com\/share\/([A-Za-z0-9]+)/
  );
  if (loomMatch) {
    return {
      provider: "loom",
      embedUrl: `https://www.loom.com/embed/${loomMatch[1]}`,
      title: "Loom video player",
      aspectRatio: 16 / 9,
    };
  }

  // Dailymotion
  const dailymotionMatch = url.match(
    /dailymotion\.com\/video\/([A-Za-z0-9]+)/
  );
  if (dailymotionMatch) {
    return {
      provider: "dailymotion",
      embedUrl: `https://www.dailymotion.com/embed/video/${dailymotionMatch[1]}`,
      title: "Dailymotion video player",
      aspectRatio: 16 / 9,
    };
  }

  // Wistia
  const wistiaMatch = url.match(
    /wistia\.com\/medias\/([a-zA-Z0-9]+)/
  );
  if (wistiaMatch) {
    return {
      provider: "wistia",
      embedUrl: `https://fast.wistia.net/embed/iframe/${wistiaMatch[1]}`,
      title: "Wistia video player",
      aspectRatio: 16 / 9,
    };
  }

  // Facebook
  const fbMatch = url.match(
    /facebook\.com\/.*\/videos\/([0-9]+)/
  );
  if (fbMatch) {
    return {
      provider: "facebook",
      embedUrl: `https://www.facebook.com/video/embed?video_id=${fbMatch[1]}`,
      title: "Facebook video player",
      aspectRatio: 16 / 9,
    };
  }

  // Twitch
  const twitchMatch = url.match(
    /twitch\.tv\/videos\/([0-9]+)/
  );
  if (twitchMatch) {
    return {
      provider: "twitch",
      embedUrl: `https://player.twitch.tv/?video=${twitchMatch[1]}&parent=${window.location.hostname}`,
      title: "Twitch video player",
      aspectRatio: 16 / 9,
    };
  }

  // Direct MP4/MOV file
  if (url.match(/\.(mp4|mov)(\?.*)?$/i)) {
    return {
      provider: "file",
      embedUrl: url,
      title: "Direct video file",
      aspectRatio: 16 / 9,
      isFile: true,
    };
  }

  // Fallback: try to embed as-is
  return {
    provider: "unknown",
    embedUrl: url,
    title: "Embedded video",
    aspectRatio: 16 / 9,
  };
};