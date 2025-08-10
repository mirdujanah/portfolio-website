@echo off
echo Setting up Git repository...

git init
git remote add origin https://github.com/mirdujanah/portfolio-website.git
git branch -M main
git add .
git commit -m "Initial commit with Safari dark mode fixes"
git push -u origin main

echo Setup complete!