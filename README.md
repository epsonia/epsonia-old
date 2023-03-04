<p align="center">
   <img alt="Epsonia" src="https://raw.githubusercontent.com/maytees/epsonia/10d9ef716c69eaf93fb349c390c84c0193782407/LongBanner.svg" />
</p>

<h1 align="center"> Epsonia </h1>

<h3 align="center">Epsiona is a Cyberpatriot practice image "creator".</h3>

## Configuration & Checks (vulns)

This guide will help you configure and create a practice image with Epsonia.

### Configuration

Before creating the checks, you should first setup the config for Epsonia.

1. To get started with this, create a folder in the root of the project named
   `"config"`.
2. Then, create three files in the config folder: `brief.md`, `checks.json`, and
   `config.json`
   - The `brief.md` file is the brief, also known as the Readme for the image.

   - The `checks.json` file is the place where you "state" your checks/vulns
   - Finally, the `config.json` file is the configuration for the image, this is
     what we'll be editing now.

3. Open up the `config.json`, and also open up the
   `exampleConfig/config.example.json`.

   - The `exampleConfig` folder contains example configs for all of these files.

4. Copy and paste everything from the example config to the `config.json` file.
5. Start editing from there!

#### Guide for each config:

- `name`: Name of the image, used in brief, scoring, and etc.
- `image_url`: Image for the brief, and scoring report (NF)
- `auto_export_path`: For forensics, brief, and scoring report.
  - _Tip_: _The auto export path should be the Desktop_
- `auto_export`: State if you want auto export or not.
- `config_folder`: Absolute path of the config folder. (the one you created)
- `export_folder`: Path to the export folder
  - _Tip_: _You can set this to "" if you have auto_export to true_
- `engine_interval`: Repetition for engine scoring (delay for each _"scoring"_
  run)
- `auto_refresh`: Auto refresh time for the scoring report HTML page

## Todo

- [x] Create HTML file for README
  - [x] Read from config file - Marky for parsing Markdown
- [ ] Forensic questions
- [x] Create HTML file for checks (scoring report)
- [x] Config for creating the checks
- [x] Create a modular check system
  - [x] Check file exist
  - [ ] Check firewall up
  - [ ] Check directory permissions
  - [ ] Check file permissions
  - [ ] Check passwords - _**strongness**_
  - [ ] Check user permissions
