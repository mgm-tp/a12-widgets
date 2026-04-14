### Material Icons and Fonts

Material Icons and Fonts need to be updated manually, which includes:

- Updating Material Fonts in **./widgets/src/theme/fonts/materialicons**, **./widgets/src/theme/fonts/materialiconsoutlined** and **./widgets/src/theme/fonts/materialiconsrounded** by accessing [font](https://github.com/google/material-design-icons/tree/master/font), downloading the latest according fonts and converting to **.woff** and **.woff2** by [font-converter](https://cloudconvert.com/)
- Updating the MATERIAL_ICONS in **.widgets/src/icon/main/data.ts** by using script **./icon-list-transform_script_example.js**. To run script you need to do:
  - Download the metadata icons from https://fonts.google.com/metadata/icons and replace with "your-file-name" in script.
  - Update the currentVersion list from https://github.com/google/material-design-icons/blob/master/update/current_versions.json
