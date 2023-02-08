export interface Config {
  name: string; // Name of the image, used in brief, scoring, and etc.
  image_url: string; // Image for brief, and scoring report.
  auto_export_path: string; // For forensics, brief, and scoring report. This should be the Desktop
  auto_export: boolean; // If auto export is allowed or not, explination is above
}

const settings: Config = JSON.parse("../config/config.json");
export const { name, image_url, auto_export_path, auto_export } = settings;
