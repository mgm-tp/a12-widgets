### Material Symbols and Fonts

Material Symbols fonts and icon data need to be updated manually, which includes:

1. **Download fonts**: Get the latest variable fonts from the [material-symbols](https://www.npmjs.com/package/material-symbols) npm package (`npm pack material-symbols@latest`) and extract `material-symbols-outlined.woff2` and `material-symbols-rounded.woff2`.

2. **Optimize fonts (axis pinning)**: The full variable fonts are very large (~4-5 MB each) because they include 4 variable axes (FILL, GRAD, opsz, wght). We only use the FILL axis (0 for outlined, 1 for filled); the others are always fixed at GRAD=0, opsz=24, wght=400. Use [fontTools](https://github.com/fonttools/fonttools) to pin the unused axes, reducing each font to ~500 KB:

   ```bash
   pip3 install fonttools brotli
   python3 -m fontTools varLib.instancer material-symbols-outlined.woff2 \
     -o material-symbols-outlined.woff2 --output-file=material-symbols-outlined.woff2 \
     GRAD=0 opsz=24 wght=400
   python3 -m fontTools varLib.instancer material-symbols-rounded.woff2 \
     -o material-symbols-rounded.woff2 --output-file=material-symbols-rounded.woff2 \
     GRAD=0 opsz=24 wght=400
   ```

   This keeps the FILL axis variable (needed for filled/outlined switching) while removing all other variation data.

3. **Copy optimized fonts** to `./core/src/theme/fonts/materialsymbols/`.

4. **Update icon data**: Update the MATERIAL_ICONS list in `./core/src/icon/main/material-icons-data.ts` by extracting icon names from the `index.d.ts` file in the material-symbols npm package. The `MaterialSymbols` type definition contains all available icon ligature names. You can use `core/scripts/icon-list-transform_script_example.js` as a reference.
