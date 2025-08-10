@echo off
echo Deploying to GitHub...

git add .
git commit -m "Fix Safari dark mode compatibility - automated deployment"
git push origin main

echo Deployment complete!
pause