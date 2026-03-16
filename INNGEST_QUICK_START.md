# Quick Inngest Production Setup

## 1. Get Keys from Inngest Dashboard

```
Event Key:    inngest_xxxxxxxxxxxx
Signing Key:  signkey-prod-xxxxxxxxxxxx
```

## 2. Add to Vercel Environment Variables

```bash
INNGEST_EVENT_KEY=inngest_xxxxxxxxxxxx
INNGEST_SIGNING_KEY=signkey-prod-xxxxxxxxxxxx
```

## 3. Deploy to Production

```bash
git push origin main
# or
vercel --prod
```

## 4. Register Endpoint in Inngest

```
Go to Inngest Dashboard → Apps → Sync
URL: https://your-domain.vercel.app/api/inngest
```

## 5. Test

Upload a PDF → Watch in Inngest Dashboard → Verify success

---

## Files Changed for Production

✅ `inngest/client.ts` - Added `eventKey` parameter
✅ `app/api/inngest/route.ts` - Added `signingKey` parameter
✅ `.env.example` - Added Inngest variables
✅ `INNGEST_PRODUCTION_SETUP.md` - Full deployment guide

---

## Local Development (No Changes Needed)

For local development, continue using:

```bash
# Terminal 1
npm run dev

# Terminal 2 (optional for testing Inngest)
npx inngest-cli dev
```

The code automatically detects environment:

- **Local**: Works without keys (uses Inngest dev server)
- **Production**: Requires keys (uses Inngest Cloud)

---

## Troubleshooting

**Functions not appearing in Inngest Dashboard?**

- Verify endpoint URL is correct
- Click "Sync" again in Inngest Dashboard
- Check Vercel function logs

**Events not triggering functions?**

- Verify `INNGEST_EVENT_KEY` is set in Vercel
- Check Inngest Dashboard → Events tab
- Look for error messages

**Webhook signature verification failing?**

- Verify `INNGEST_SIGNING_KEY` is set in Vercel
- Make sure the key matches your Inngest app
- Redeploy after adding the key

---

## Important URLs

- **Inngest Dashboard**: https://app.inngest.com/
- **Your Production Endpoint**: https://your-domain.vercel.app/api/inngest
- **Inngest Docs**: https://www.inngest.com/docs

---

## Next Steps After Deployment

1. Monitor first few PDF uploads in Inngest Dashboard
2. Check function execution times
3. Verify error handling works
4. Set up alerts (optional) in Inngest Dashboard
5. Consider upgrading to Pro if you exceed free tier limits
