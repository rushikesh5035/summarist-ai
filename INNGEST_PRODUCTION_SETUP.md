# Inngest Production Deployment Guide

This guide walks you through setting up Inngest for production deployment of the Chat with PDF feature.

---

## Step 1: Create Inngest Cloud Account

1. Go to [https://www.inngest.com/](https://www.inngest.com/)
2. Sign up for a free account
3. Click "Create App" or "New Project"
4. Name your app: `summarist-ai` (or any name you prefer)

---

## Step 2: Get Your Production Keys

After creating your app, you'll see your dashboard. Get these keys:

### Event Key

1. In Inngest Dashboard, go to **Settings** → **Keys**
2. Find your **Event Key** (starts with `inngest_`)
3. Copy it - this is used to send events to Inngest

### Signing Key

1. In the same **Keys** section
2. Find your **Signing Key** (starts with `signkey-`)
3. Copy it - this is used to verify webhook requests

---

## Step 3: Add Environment Variables

### For Vercel (Recommended):

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these variables:

```bash
INNGEST_EVENT_KEY=inngest_your_event_key_here
INNGEST_SIGNING_KEY=signkey-prod-your_signing_key_here
```

4. Make sure to select **Production** environment
5. Click **Save**

### For Other Platforms:

Add these to your `.env.production` file or platform's environment variables:

```bash
INNGEST_EVENT_KEY=inngest_your_event_key_here
INNGEST_SIGNING_KEY=signkey-prod-your_signing_key_here
```

---

## Step 4: Deploy Your Application

Deploy your Next.js app to your platform (Vercel, Netlify, etc.):

```bash
# If using Vercel CLI
vercel --prod

# Or push to your main branch if auto-deploy is enabled
git push origin main
```

---

## Step 5: Register Your Inngest Endpoint with Inngest Cloud

Once deployed, you need to tell Inngest where your `/api/inngest` endpoint is:

1. Go to your Inngest Dashboard
2. Click on **Apps** → Your App Name
3. Click **Sync** or **Add Endpoint**
4. Enter your production URL:

   ```
   https://your-domain.com/api/inngest
   ```

   Example: `https://summarist-ai.vercel.app/api/inngest`

5. Click **Sync** or **Register**

Inngest will:

- Discover all your functions (`processPdfForChat`)
- Verify the endpoint is working
- Start routing events to your production server

---

## Step 6: Verify Everything Works

### Test the Connection:

1. In Inngest Dashboard, go to **Functions**
2. You should see `process-pdf-for-chat` listed
3. Click on it to see details

### Test a Real Upload:

1. Go to your production app
2. Upload a PDF and select "Chat with PDF"
3. Click "Start Chat"

### Monitor in Inngest Dashboard:

1. Go to **Events** to see the `pdf/chat.uploaded` event
2. Go to **Runs** to see the function execution
3. Check logs and status

---

## Step 7: Monitor and Debug

### View Logs:

1. **Inngest Dashboard** → **Runs** → Click on any run
2. See detailed execution timeline
3. Check for errors or failures

### View Events:

1. **Inngest Dashboard** → **Events**
2. See all events sent to Inngest
3. Check if events are being received

### Troubleshooting:

If functions aren't running:

1. **Check endpoint registration**:
   - Go to **Apps** → Your App → **Endpoints**
   - Verify URL is correct
   - Click **Sync** again

2. **Check environment variables**:
   - Verify `INNGEST_EVENT_KEY` is set in production
   - Verify `INNGEST_SIGNING_KEY` is set in production

3. **Check logs**:
   - Vercel: Go to **Deployments** → Select deployment → **Functions** tab
   - Look for errors in `/api/inngest` endpoint

4. **Test the endpoint directly**:
   ```bash
   curl https://your-domain.com/api/inngest
   ```
   Should return information about your functions

---

## Development vs Production Differences

### Development (Local):

```typescript
// inngest/client.ts
export const inngest = new Inngest({
  id: "summarist",
  // No eventKey needed for dev
});
```

- Run `npx inngest-cli dev` locally
- Events are sent to local Inngest dev server
- No cloud connection needed

### Production:

```typescript
// inngest/client.ts
export const inngest = new Inngest({
  id: "summarist",
  eventKey: process.env.INNGEST_EVENT_KEY, // Required!
});
```

- Events are sent to Inngest Cloud
- Inngest Cloud routes to your `/api/inngest` endpoint
- Secure with signing key

---

## Important Notes

### 1. Keep Keys Secret

- **Never commit** `INNGEST_EVENT_KEY` or `INNGEST_SIGNING_KEY` to Git
- Only store them in platform environment variables
- They are already in `.gitignore` via `.env.local`

### 2. Free Tier Limits

Inngest free tier includes:

- 10,000 function runs/month
- 100,000 events/month
- 30-day run history

This is more than enough for most apps. Monitor usage in Inngest Dashboard.

### 3. Retry Behavior

Our function has `retries: 2` configured:

```typescript
inngest.createFunction(
  { id: "process-pdf-for-chat", retries: 2 }
  // ...
);
```

If a step fails, Inngest will automatically retry up to 2 times.

### 4. Background Processing

Inngest runs functions in the background, so:

- Your API responds immediately after sending the event
- PDF processing happens asynchronously
- Status polling shows progress to the user

---

## Pricing (as of 2024)

- **Free**: 10,000 runs/month
- **Pro**: $20/month for 100,000 runs
- **Enterprise**: Custom pricing

Start with the free tier - it's plenty for initial production use.

---

## Additional Resources

- [Inngest Documentation](https://www.inngest.com/docs)
- [Inngest Next.js Guide](https://www.inngest.com/docs/sdk/serve#framework-next-js)
- [Inngest Dashboard](https://app.inngest.com/)
- [Inngest Discord](https://www.inngest.com/discord) - for support

---

## Summary Checklist

Before going to production, ensure:

- [ ] Created Inngest Cloud account
- [ ] Got Event Key from Inngest Dashboard
- [ ] Got Signing Key from Inngest Dashboard
- [ ] Added `INNGEST_EVENT_KEY` to production environment variables
- [ ] Added `INNGEST_SIGNING_KEY` to production environment variables
- [ ] Deployed application to production
- [ ] Registered endpoint in Inngest Dashboard (https://your-domain.com/api/inngest)
- [ ] Verified function appears in Inngest Dashboard
- [ ] Tested PDF upload and chat in production
- [ ] Checked Inngest Dashboard for successful runs

---

## Need Help?

If you encounter issues:

1. Check Inngest Dashboard logs
2. Check Vercel function logs
3. Check browser console for errors
4. Review this guide again
5. Contact Inngest support via their Discord

Good luck with your deployment! 🚀
