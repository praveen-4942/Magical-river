# Magical River Portfolio

This repository contains the static portfolio site under `praveenkumarg/01/`.

## Preview locally
Open `praveenkumarg/01/index.html` in your browser to view the portfolio.

## Push to GitHub
1. Create a new repository on GitHub.
2. Add the new GitHub remote to this local repo:
   ```bash
git remote remove origin
git remote add origin https://github.com/<your-username>/<new-repo-name>.git
```
3. Commit and push:
   ```bash
git add .
git commit -m "Add portfolio site"
git push origin main
```

## GitHub Pages
If you want a live site, use GitHub Pages and point the Pages source to this repository.

> Note: This repo now contains only the static portfolio files. The `app.py` Streamlit wrapper has been removed.
