export function copyToClipboard(address: string) {
  const textArea = document.createElement("textarea");
  textArea.value =  address;
  document.body.appendChild(textArea);
  textArea.select();
  textArea.focus();
  document.execCommand('copy');
  document.body.removeChild(textArea);
}