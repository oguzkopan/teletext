# Secure Deployment with Firebase App Hosting

## The Security Issue

Previously, API keys were hardcoded in `apphosting.yaml`, which meant they were:
- ❌ Committed to version control (visible in Git history)
- ❌ Visible in your public GitHub repository
- ❌ Accessible to anyone who can see your code

## The Secure Solution: Firebase Secrets

Firebase App Hosting supports **Secret Manager** integration, which:
- ✅ Stores secrets encrypted in Google Cloud Secret Manager
- ✅ Keeps secrets out of version control
- ✅ Allows secure access only during deployment
- ✅ Supports secret rotation without code changes

## How to Set Up Secrets

### Option 1: Using the Setup Script (Recommended)

```bash
./scripts/setup-firebase-secrets.sh
```

This script will:
1. Read your API keys from `.env.local`
2. Upload them as encrypted secrets to Firebase
3. Keep them secure and out of Git

### Option 2: Manual Setup

Set each secret individually:

```bash
# News API
echo "your_news_api_key" | firebase apphosting:secrets:set NEWS_API_KEY --data-file=-

# Sports API
echo "your_sports_api_key" | firebase apphosting:secrets:set SPORTS_API_KEY --data-file=-

# Alpha Vantage API
echo "your_alpha_vantage_key" | firebase apphosting:secrets:set ALPHA_VANTAGE_API_KEY --data-file=-

# CoinGecko API
echo "your_coingecko_key" | firebase apphosting:secrets:set COINGECKO_API_KEY --data-file=-

# OpenWeather API
echo "your_openweather_key" | firebase apphosting:secrets:set OPENWEATHER_API_KEY --data-file=-
```

### Option 3: Using Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `teletext-eacd0`
3. Navigate to **App Hosting** → **Secrets**
4. Click **Add Secret** for each API key
5. Enter the secret name and value

## How It Works

In `apphosting.yaml`, secrets are referenced like this:

```yaml
- variable: NEWS_API_KEY
  secret: NEWS_API_KEY  # References the secret, not the actual value
  availability:
    - RUNTIME
```

During deployment:
1. Firebase reads the secret from Secret Manager
2. Injects it as an environment variable at runtime
3. Your code accesses it via `process.env.NEWS_API_KEY`
4. The actual value never appears in your code or logs

## Managing Secrets

### View Available Secrets
```bash
firebase apphosting:secrets:list
```

### Access a Secret Value (requires permissions)
```bash
firebase apphosting:secrets:access NEWS_API_KEY
```

### Update a Secret
```bash
echo "new_value" | firebase apphosting:secrets:set NEWS_API_KEY --data-file=-
```

### Delete a Secret
```bash
firebase apphosting:secrets:delete NEWS_API_KEY
```

## Security Best Practices

1. **Never commit `.env.local`** - It's in `.gitignore` for a reason
2. **Use secrets for all sensitive data** - API keys, tokens, passwords
3. **Rotate secrets regularly** - Update them periodically for security
4. **Limit access** - Only give team members the permissions they need
5. **Monitor usage** - Check Firebase logs for unauthorized access attempts

## What About the Previous Commit?

The previous commit exposed API keys in Git history. To fix this:

### Option A: Rotate the API Keys (Recommended)
1. Generate new API keys from each service:
   - [NewsAPI](https://newsapi.org/account)
   - [API-Football](https://www.api-football.com/account)
   - [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
   - [CoinGecko](https://www.coingecko.com/en/api/pricing)
   - [OpenWeatherMap](https://home.openweathermap.org/api_keys)
2. Update `.env.local` with new keys
3. Run `./scripts/setup-firebase-secrets.sh`
4. Revoke the old keys in each service

### Option B: Rewrite Git History (Advanced)
```bash
# WARNING: This rewrites history and affects all collaborators
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch apphosting.yaml" \
  --prune-empty --tag-name-filter cat -- --all

git push origin --force --all
```

**Note:** Option A is safer and recommended for most cases.

## Deployment Checklist

- [ ] API keys stored as Firebase secrets
- [ ] `apphosting.yaml` uses `secret:` references (not `value:`)
- [ ] `.env.local` is in `.gitignore`
- [ ] No sensitive data in Git history (or keys rotated)
- [ ] Secrets verified with `firebase apphosting:secrets:list`
- [ ] Test deployment successful

## Troubleshooting

### "Secret not found" error
- Run `firebase apphosting:secrets:list` to verify secrets exist
- Check secret names match exactly in `apphosting.yaml`
- Ensure you're in the correct Firebase project

### "Permission denied" error
- You need Secret Manager Admin role
- Ask project owner to grant permissions
- Or use `firebase login` with an account that has access

### Pages still show "SERVICE UNAVAILABLE"
- Check Firebase logs: `firebase apphosting:logs`
- Verify secrets are set: `firebase apphosting:secrets:list`
- Ensure deployment completed successfully
- Check adapter error logs in Firebase console

## Additional Resources

- [Firebase App Hosting Secrets Documentation](https://firebase.google.com/docs/app-hosting/manage-secrets)
- [Google Cloud Secret Manager](https://cloud.google.com/secret-manager/docs)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
