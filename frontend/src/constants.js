export const BASE_URL = "https://localhost:5000";
  
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
export const OUTLINE_WIDTH = "2px";
export const BUTTON_BORDER_RADIUS = "8px";

export const PRIMARY_COLOR = "#2D8CFF";
export const LIGHT_PRIMARY_COLOR = "#DFEEFF";
export const SUCCESS_COLOR = "#72CF97";
export const LIGHT_SUCCESS_COLOR = "#EAFEEF";
export const WARNING_COLOR = "#FF7474";
export const BLACK_COLOR = "#000000";