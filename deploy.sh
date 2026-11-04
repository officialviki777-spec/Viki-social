#!/bin/bash
# VIKI SOCIAL Direct Firebase Hosting Deployment Script (No GitHub Required)
echo "⚡ Building VIKI SOCIAL production bundle..."
npm run build

echo "🚀 Deploying to Firebase Hosting project: viki-social-app..."
npx firebase-tools deploy --only hosting --project viki-social-app

echo "✅ Deployment complete! Check https://viki-social-app.web.app"
