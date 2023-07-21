export const formatDuration = (seconds: number) => {
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = pad(date.getUTCSeconds().toString());
  if (hh) {
    return `${hh}:${pad(mm.toString())}:${ss}`;
  }
  return `${mm}:${ss}`;
};

function pad(str: string) {
  return ('0' + str).slice(-2);
}

export const truncateString = (inputString: string, maxLength: number) => {
  if (inputString.length <= maxLength) {
    return inputString;
  } else {
    return inputString.slice(0, maxLength);
  }
};
