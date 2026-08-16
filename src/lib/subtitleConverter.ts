export async function getSubtitleUrl(file: File): Promise<string> {
  // If it's already a VTT file, just create an object URL
  if (file.name.toLowerCase().endsWith('.vtt')) {
    return URL.createObjectURL(file);
  }

  // Otherwise, assuming it's SRT, convert to VTT format
  const text = await file.text();
  
  // Replace SRT timestamp commas with VTT dots (e.g., 00:00:01,000 -> 00:00:01.000)
  // The regex matches the standard SRT timestamp format
  let vttText = text.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2');
  
  // Ensure the WEBVTT header is at the top
  vttText = `WEBVTT\n\n${vttText}`;
  
  // Create a new blob with the converted text
  const blob = new Blob([vttText], { type: 'text/vtt' });
  return URL.createObjectURL(blob);
}
