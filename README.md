<p align="center">
   <img alt="Epsonia" src="https://raw.githubusercontent.com/maytees/epsonia/10d9ef716c69eaf93fb349c390c84c0193782407/LongBanner.svg" />
</p>

- [What is Epsonia](#what-is-epsonia)
- [Configuration \& Checks (vulns)](#configuration--checks-vulns)
    - [Configuration](#configuration)
      - [Guide for each config:](#guide-for-each-config)
      - [Checks confi guide:](#checks-confi-guide)
- [Todo](#todo)

# What is Epsonia

Epsonia is a user-friendly and engaging cybersecurity scoring engine designed to
provide students with a fun and interactive way to improve their cybersecurity
skills. With a focus on replicating the Cyberpatriot competition experience,
Epsonia offers a dynamic and challenging platform for school clubs and their
members to learn and develop their cybersecurity knowledge and expertise.

# Configuration & Checks (vulns)

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
- `competition_mode`: This boolean value turns on/off competition mode, which
  connects to your competition server
- `competition_url`: The URL endpoint for your competition.

#### Checks confi guide:

The `checks.json` contains an object of various lists, each list being a list of
checks for that category.

_Here is an explination for each check currently available:_

- `users`:
  - The users list contains objects, each object being a user and their
    settings. A user has 8 settings: `name`, `shouldExist`, `initialExist`,
    `administrator`, `points`, `adminPoints`, `message`, and `penaltyMessage`.
    Name is the **username** (not name) of the user, meaning it most likely is
    not capitalized in any way. Should exist is pretty self explanitory, it is
    if the user should exist. Initial exist is if the user exists when the image
    is launched up by a competitor. Administrator is if the user should be an
    administrator. Points are how many points the user gets from removing/adding
    a user, while admin points are how many points the user should get from
    adding/removing the user from the sudoers (administrators) list, message is
    the message the user gets when they remove/add a user, and penalty message
    is the penalty message.
  - Keep in mind that there are a few rules twists to the users object: If you
    have a user who should exist, and intially exists, it is not a check meaning
    that it doesnt get added to the vulnerabilities list, but is penatalized if
    the user removes that user, because they are supposed to exist, and they
    already exist, so the user removing them would be bad, but not doing
    anything would be good, so there is no check there.
  - Another twist is for if the user should exist but doesn't intially exist.
    This check is for a user who needs to be added.
  - And finally, the last twist is that the administrator checks do not go along
    with the users checks, they are parsed and acted upon (checked) separately.
- `binaryExists`:
  - The binary exists list contains objects which have the following attributes:
    `name`, `points`, `message`, and finaly, `penaltMessage`. The last 3 are
    self explanitory as with all the other checks, though the name is simply the
    binary name (aka file name). This check will simply check if running `which`
    will return a file path to a binary.
- `onlineServices`:
  - The Online Services object contains the following attributes: `serviceName`,
    `points`, `message`, and `penaltyMessage`. Service name is the name of the
    service. This will run the systemctl is-active command to check if the
    service is active.
- `Forensics`:
  - Forensics are to be made their own check in the future, though right now
    they are going to stay manual, meaning that you must create the file
    yourself. The forensics list contains objects with the following attributes:
    `path`, `answers`, `caseSensative`, points, message, and penaltyMessage.
    Path is the path of the forensic question, this should be the Desktop as
    with all the other files which the user has to see. Answers is a list of
    strings, which can be 1 to however many answers you may have. And finally,
    case case sensative is a boolean value which says if the answers are case
    sensative.
- `fileExistsCheck`:
  - This contains a list of objects with a `path`, points, message, and penalty
    message attributes. Path is simply the path of the file. *There will be a
    `shouldExist` attribute which says of the file should exist or not. This
    check is useful for checking illegal media files.
- `fileLineContains`:
  - This check checks if a line of a file is equal to a correct value. The check
    has a `path`, `correctContent`, `line`, points, message, and penaltyMessage.
    Path is the path of the file, correct content is the correct content, and
    line is the line number which you want to check.
- `fileContainsContent`:
  - This check checks if a file contains a string which you specify. It contains
    objects with a `path`, `containing`, points, message, and penalty message.
    Path is the path of the file, and containing is what the file should
    contain.

# Todo

- [x] Create HTML file for README
  - [x] Read from config file - Marky for parsing Markdown
- [x] Forensic questions
- [x] Create HTML file for checks (scoring report)
- [x] Config for creating the checks
- [x] Create a modular check system
  - [x] Check file exist
  - [x] Check firewall up
  - [ ] Check directory permissions
  - [ ] Check file permissions
  - [ ] Check passwords - _**strongness**_
  - [ ] Check user permissions
- [ ] Create working backend service
- [ ] Create web interface for creating images
