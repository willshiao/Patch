export const content = {
  home: {
    navbar: {
      about: "About",
      how: "How"
    },
    title: {
      caption: "The quick fix for your choppy Zoom audio.",
      subcaption: "Posting a video with audio defects? We'll make uploading it the hardest part.",
      start: "Get Patchin\'",
      github: "View on GitHub"
    },
    about: {
      title: "About",
      description: "Patch takes advantage of the fact that the full quality version of the user's voice passes though the computer first, before it is transmitted to Zoom. Any errors or connection issues typically occur during transmission. Patch allows an user to upload their Zoom meeting recording and an audio recording of their own microphone that they took locally. It then analyzes the audio of the meeting recording and attempts to find sections that are corrupted. It then automatically synchronizes the two tracks, replaces the corrupted portions of the meeting recording, and reconstructs the video using the repaired audio."
    },
    how: {
      title: "How it Works",
      descriptionFirst: "Before you start recording your Zoom meeting, make sure to begin recording your own voice. This could be done through an external application on your phone, computer, etc. As long as you provide an audio and video file, you’re good to go!",
      descriptionSecond: "Have both your video file with corrupt audio and completely normal audio file ready to upload. All you need to do is drag and drop them (or browse and select the files if you want to make your life a little harder).",
      descriptionThird: "See your brand-new Zoom video in action! Before you choose to download it, you’ll have the option to watch the video and discover what we were able to find out about it. Want to patch another one? Please, be our guest."
    }
  },
  upload: {
    drop: "Drop the file here!",
    audioCaption: "Upload your “completely fine” audio file.",
    videoCaption: "Upload your video file with “bad” audio.",
    audioFileTypes: "Acceptable file types: .mp3, .m4a",
    videoFileTypes: "Acceptable file types: .mp4, .mov",
    dropAudio: "Drag ‘n’ drop your audio file here",
    dropVideo: "Drag ‘n’ drop your video file here",
    button: "Upload",
    or: "or",
    error: {
      title: "UH-OH!",
      mainMessage: "There was an error uploading your files! This could be because of one of the following reasons:",
      invalidFile: "The video/audio file is not valid.",
      audioShort: "The audio file is shorter than the Zoom recording.",
      audioDifferent: "The audio file is for a different meeting than the video file.",
      timeout: "Our server is currently overloaded and the request timed out (unfortunately, a lot of processing power is required)."
    }
  },
  result: {
    again: "Patch again",
    regions: "patched regions",
    success: {
      title: "Patch Successful!",
      description: "We were able to patch-up your video. Check it out and download it once you're ready!",
      download: "Download video"
    }
  }
}