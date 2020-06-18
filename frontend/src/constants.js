export const BASE_URL = "https://localhost:5000";

export const uploadStyles = {
  backgroundColor: {
    success: "#eafeef",
    normal: "#dfeeff",
    disabled: "#f0f3f6"
  },
}
  
export const tableColumns = [
  {
    title: 'Begin Timestamp',
    dataIndex: 'beginTimestamp',
    key: 'beginTimestamp',
  },
  {
    title: 'End Timestamp',
    dataIndex: 'endTimestamp',
    key: 'endTimestamp',
  },
  {
    title: 'Corrupted Phrase',
    dataIndex: 'corruptedPhrase',
    key: 'corruptedPhrase',
  }
];

export const videoFileTypes = ["video/quicktime", "video/mp4"];
export const audioFileTypes = ["audio/x-m4a", "audio/mpeg"];

export const NUM_FILES_ERROR = "Please select only 1 file.";
export const INVALID_FILE_ERROR = "Sorry, it seems like you're trying to upload the wrong type of file!";
export const MODAL_WIDTH = 640;
export const BUTTON_BORDER_RADIUS = "8px";